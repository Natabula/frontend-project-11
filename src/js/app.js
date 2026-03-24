// src/js/app.js
import * as yup from 'yup'
import { errorsApp } from './errors.js'
import i18next from 'i18next'
import { getRss } from './api.js'
import { parserRss } from './parser.js'
import view from './view.js'
import { proxy } from 'valtio/vanilla'

export const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#urlInput'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('form button'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modalContainer: document.querySelector('.modal-content'),
  }
  const state = proxy({
    error: null,
    modalPostId: null,
    viewPostIds: [],
    feeds: [],
    post: [],
    formStatus: 'idle',
  })

  const validateUrl = (url, feeds, feed) => {
    const scheme = yup.string()
      .url()
      .notOneOf(feeds, () => i18next.t('errors.urlExists'))
    return scheme.validate(url)
      .then(() => {
        state.error = null
        state.feeds.push(feed)
      })
  }

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    elements.button.classList.add('disabled')
    const formData = new FormData(e.target)
    const url = formData.get('url').trim()
    if (!url) {
      throw errorsApp(i18next.t('errors.urlNull'), elements)
    }

    getRss(url, state)
      .then(data => parserRss(data, state))
      .then((data) => {
        elements.input.value = ''
        view(elements, validateUrl, data, state, url)
      })
      .catch((err) => {
        console.log(err)
        elements.button.classList.remove('disabled')
        errorsApp(err.message, elements)
      })
  })
}
