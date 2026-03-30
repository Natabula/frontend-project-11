// src/js/app.js
import * as yup from 'yup'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import view, { displayingFeeds } from './view.js'
import { errorsApp } from './errors.js'
import i18next from 'i18next'
import { getRss } from './api.js'
import { parserRss } from './parser.js'
import { proxy } from 'valtio/vanilla'

export const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#urlInput'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('form button'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  }
  const state = proxy({
    error: null,
    viewPostIds: [],
    feeds: [],
    formStatus: 'idle',
  })

  const validateUrl = (url, existingUrls) => {
    return yup.string()
      .url()
      .notOneOf(existingUrls, i18next.t('errors.urlExists'))
      .validate(url)
  }

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    elements.button.classList.add('disabled')

    const url = elements.input.value.trim()

    if (!url) {
      errorsApp(i18next.t('errors.urlNull'), elements)
      elements.button.classList.remove('disabled')
      elements.input.focus()
      return
    }

    const existingUrls = state.feeds.map(feed => feed.url)

    validateUrl(url, existingUrls)
      .then(() => getRss(url))
      .then(data => parserRss(data))
      .then((data) => {
        state.feeds.push(data)
        displayingFeeds(state.feeds, elements.feedsContainer, elements.postsContainer, state)
        elements.input.classList.remove('is-invalid')
        elements.feedback.className = 'feedback text-success'
        elements.feedback.textContent = i18next.t('success.validUrl')
        elements.input.value = ''
        elements.input.focus()
        view(elements, data, state, url)
      })
      .catch((err) => {
        console.log(err)
        if (err.name === 'ValidationError') {
          errorsApp(err.message, elements)
        }
        else {
          errorsApp(i18next.t(`errors.${err.code || 'invalidUrl'}`), elements)
        }
        elements.input.focus()
      })
      .then(() => {
        elements.button.classList.remove('disabled')
      })
  })
}
