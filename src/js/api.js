import axios from 'axios'
import { parserRss } from './parser'

const getProxyUrl = (url) => {
  const baseUrl = 'https://allorigins.hexlet.app/get'
  const params = new URLSearchParams({
    disableCache: 'true',
    url,
  })
  return `${baseUrl}?${params.toString()}`
}

export const getRss = (url) => {
  const timeout = 10000
  return axios.get(getProxyUrl(url), { timeout })
    .then(response => response.data.contents)
    .then(data => [data, url])
    .catch((error) => {
      const err = new Error('errorNetwork')
      err.code = 'errorNetwork'
      err.cause = error
      throw err
    })
}

export const startTime = (url, posts, state, displaying) => {
  getRss(url)
    .then(data => parserRss(data))
    .then(({ items }) => {
      items.forEach((item) => {
        const newPost = posts.filter(post => post.link === item.link)
        if (newPost.length === 0) {
          displaying(item, 'new', state)
        }
      })
      return items
    })
    .then((items) => {
      setTimeout(() => startTime(url, items, state, displaying), 5000)
    })
    .catch((error) => {
      console.log(error)
      setTimeout(() => startTime(url, posts, state, displaying), 5000)
    })
}
