// src/js/view.js
import i18next from 'i18next'
import { startTime } from './api'
import { subscribe } from 'valtio/vanilla'

const modalOpen = (element) => {
  const body = document.querySelector('body')
  const modal = document.querySelector('#modal')
  const modalTitle = document.querySelector('.modal-title')
  const modalBody = document.querySelector('.modal-body')

  modalTitle.textContent = element.titleItem
  modalBody.textContent = element.descriptionItem
  body.classList.add('modal-open')
  modal.classList.add('show')
  modal.removeAttribute('aria-hidden')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('style', 'display:block')

  const close = () => {
    modal.removeAttribute('style')
    modal.removeAttribute('aria-modal')
    modal.setAttribute('aria-hidden', 'true')
    body.classList.remove('modal-open')
    modal.classList.remove('show')
  }

  const modalCross = modal.querySelector('button')
  modalCross.addEventListener('click', () => close())

  const modalFooter = document.querySelector('.modal-footer')
  const buttonClose = modalFooter.querySelector('button')
  buttonClose.addEventListener('click', () => close())

  const modalLink = modalFooter.querySelector('a')
  modalLink.setAttribute('href', `${element.link}`)
}

const displayingNewPosts = (item, element = null, state) => {
  const listPosts = document.querySelector('.posts ul')
  if (!listPosts) return

  if (listPosts.querySelector(`[data-id="${item.link}"]`)) return
  const itemListPost = document.createElement('li')
  itemListPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
  element === 'new' ? listPosts.prepend(itemListPost) : listPosts.append(itemListPost)

  const titlePost = document.createElement('a')
  titlePost.setAttribute('href', `${item.link}`)
  titlePost.dataset.id = item.link
  titlePost.dataset.description = item.descriptionItem || ''

  if (state?.viewPostIds?.includes(item.link)) {
    titlePost.classList.add('fw-normal', 'link-secondary')
  }
  else {
    titlePost.classList.add('fw-bold')
  }

  titlePost.textContent = `${item.titleItem}`

  const buttonPost = document.createElement('button')
  buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm')
  buttonPost.textContent = i18next.t('buttons.buttonPost')
  itemListPost.append(titlePost, buttonPost)
}

const displayingFeeds = (feeds, feedsContainer, postsContainer, state) => {
  feedsContainer.innerHTML = ''
  const divFeed = document.createElement('div')
  divFeed.classList.add('card', 'border-0')
  divFeed.innerHTML = '<div class="card-body"><h2 class="card-title h4">Фиды</h2></div>'
  feedsContainer.append(divFeed)
  const listFeed = document.createElement('ul')
  listFeed.classList.add('list-group', 'border-0', 'rounded-0')
  feedsContainer.append(listFeed)

  // посты создание
  postsContainer.innerHTML = ''
  const divPost = document.createElement('div')
  divPost.classList.add('card', 'border-0')
  divPost.innerHTML = '<div class="card-body"><h2 class="card-title h4">Посты</h2></div>'
  postsContainer.append(divPost)
  const listPost = document.createElement('ul')
  listPost.classList.add('list-group', 'border-0', 'rounded-0')
  postsContainer.append(listPost)

  feeds.forEach((feed) => {
    const itemListFeed = document.createElement('li')
    itemListFeed.classList.add('list-group-item', 'border-0', 'border-end-0')
    listFeed.append(itemListFeed)

    const titleFeed = document.createElement('h3')
    titleFeed.classList.add('h6', 'm-0')
    titleFeed.textContent = `${feed.title}`
    itemListFeed.append(titleFeed)

    const descriptionFeed = document.createElement('p')
    descriptionFeed.classList.add('m-0', 'small', 'text-black-50')
    descriptionFeed.textContent = `${feed.description}`
    itemListFeed.append(descriptionFeed)

    feed.items.forEach(item => displayingNewPosts(item, null, state))
  })
}

const view = (elements, feed, state, urlFeed) => {
  elements.button.classList.remove('disabled')

  let feedsRendered = false

  subscribe(state, () => {
    if (state.error) {
      elements.input.classList.add('is-invalid')
      elements.feedback.classList.add('text-danger')
      elements.feedback.classList.remove('text-success')
      elements.feedback.textContent = state.error
      return
    }
    if (state.feeds.length > 0 && !feedsRendered) {
      displayingFeeds(state.feeds, elements.feedsContainer, elements.postsContainer, state)
      feedsRendered = true
      startTime(urlFeed, feed.items, state, displayingNewPosts)

      if (state.viewPostIds.length > 0) {
        state.viewPostIds.forEach((link) => {
          const el = elements.postsContainer.querySelector(`a[data-id="${link}"]`)
          if (el) {
            el.classList.remove('fw-bold')
            el.classList.add('fw-normal', 'link-secondary')
          }
        })
      }
    }
  })

  const posts = elements.postsContainer
  posts.addEventListener('click', (e) => {
    const currentButton = e.target
    const currentList = currentButton.parentNode
    const linkEl = currentList.querySelector('a[data-id]')
    const hrefPost = linkEl?.dataset.id

    linkEl.classList.remove('fw-bold')
    linkEl.classList.add('fw-normal', 'link-secondary')

    if (!state.viewPostIds.includes(hrefPost)) {
      state.viewPostIds.push(hrefPost)
    }

    const post = {
      titleItem: linkEl.textContent,
      descriptionItem: linkEl.dataset.description || '',
      link: hrefPost,
    }

    modalOpen(post)
  })
}

export default view
export { displayingFeeds, displayingNewPosts }
