// src/js/view.js
import onChange from 'on-change'
import i18next from 'i18next'
import { startTime } from './api'
import { subscribe } from 'valtio/vanilla';

const displayingNewPosts = (item, element = null) => {
    const listPosts = document.querySelector('ul')
    const itemListPost = document.createElement('li')
    itemListPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
    element === 'new' ? listPosts.prepend(itemListPost) : listPosts.append(itemListPost)

    const titlePost = document.createElement('a')
    titlePost.setAttribute('href', `${item.link}`)
    titlePost.classList.add('fw-bold')
    titlePost.textContent = `${item.titleItem}`

    itemListPost.append(titlePost)

    const buttonPost = document.createElement('button')
    buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    buttonPost.textContent = i18next.t('buttons.buttonPost')
    itemListPost.append(buttonPost)


}

const displayingFeeds = (feeds, feedsContainer, postsContainer) => {
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
    divPost.innerHTML = '<div class="card-body"><h2 class="card-title h4">Посты<h2></div>'
    postsContainer.append(divPost)
    const listPost = document.createElement('ul')
    listPost.classList.add('list-group', 'border-0', 'rounded-0')
    postsContainer.append(listPost)

    feeds.forEach(feed => {
        const itemListFeed = document.createElement('li')
        itemListFeed.classList.add('list-group-item', 'border-0', 'border-end-0')
        listFeed.append(itemListFeed)

        const titleFeed = document.createElement('h3')
        titleFeed.classList.add('h6', 'm-0')
        titleFeed.textContent = `${feed.title}`
        itemListFeed.append(titleFeed)

        const descriptionFeed = document.createElement('p')
        descriptionFeed.classList.add('m-o', 'small', 'text-black-50')
        descriptionFeed.textContent = `${feed.description}`
        itemListFeed.append(descriptionFeed)

        feed.items.forEach(item => displayingNewPosts(item))  
    });
}

const view = (elements, validate, feed, state, urlFeed) => {
    elements.button.classList.remove('disabled')
    const unsubscribe = subscribe(state, () => {
        if (state.error)  {
            elements.input.classList.add('is-invalid')
            elements.feedback.classList.add('text-danger')
            elements.feedback.classList.remove('text-success')
            elements.feedback.textContent = state.error
            return
        }
         if (state.feeds.length > 0) {
        elements.input.classList.remove('is-invalid')
        elements.feedback.classList.remove('text-danger')
        elements.feedback.classList.add('text-success')
        elements.feedback.textContent = i18next.t('success.validUrl')
        displayingFeeds(state.feeds, elements.feedsContainer, elements.postsContainer)
        startTime(urlFeed, feed.items, state, displayingNewPosts)
        }
    })
    const url = feed.url
    const currentFeed = state.feeds.map(feed => feed.url)
    state.error = null
    validate(url, currentFeed, feed)
        .catch((err) => {
            state.error = err.message
        })
}
export default view

