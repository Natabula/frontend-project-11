// src/js/app.js
import '../style.css'
import * as yup from 'yup';
// import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
// import { setupCounter } from './counter.js'
import { errorsApp } from './errors.js';
import i18next from 'i18next'

export const app = () => {
    const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('#urlInput'),
        feedback: document.querySelector('.feedback'),
        button: document.querySelector('form button'),
        feedsContainer: document.querySelector('.feeds'),
        postsContainer: document.querySelector('.posts'),
        modalContainer: document.querySelector('.modal-content')
    }
    const state = {
        error: null,
        modalPostId: null,
        viewPostIds: [],
        feeds: [],
        post: [],
        status: 'idle'
    }

    const validateUrl = (url, feeds, feed) => {
      const sheme = yup.string()
        .required()
        .url()
        .notOneOf(feeds, () => i18next.t('errors.urlExists'))
      return sheme.validate(url) 
        .then(() => {
          state.feeds.push(feed)
        })
    }
    
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()
      elements.button.classList.add('disabled')
      const formData = new FormData(e.target)
      const url = formData.get('url').trim()
      if (!url) {
        errorsApp(i18next.t('errors.urlNull'), elements)
      }
     

      const existingUrls = state.feeds.map(feed => feed.url)
      validateUrl(url, existingUrls, { url })
        .then((validUrl) => {
          console.log('URL валиден:', validUrl)
          elements.input.value = ''
          elements.button.classList.remove('disabled')
          elements.input.classList.remove('is-invalid')
          elements.feedback.textContent = i18next.t('success.validUrl')
          elements.feedback.classList.remove('text-danger')
          elements.feedback.classList.add('text-success')
        })
        .catch((err) => {
          console.log(err.message)
          errorsApp(err.message, elements)
          elements.button.classList.remove('disabled')
        })
    
      })
    
}