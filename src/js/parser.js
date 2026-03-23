import { errorsApp } from "./errors";
import i18next from "i18next";

export const parserRss = ([contents, url], state) => {
    try {
        const parserDom = new DOMParser()
        const doc = parserDom.parseFromString(contents, 'text/xml')
        const parseError = doc.querySelector('parsererror')

        if (parseError) {
            console.log(parseError)
            if(doc.body?.querySelector('parsererror')) {
                throw new Error('invalidUrl')
            }
            else {
                throw new Error('notRss')
            }
        }
        const title = doc.querySelector('channel title').textContent
        const description = doc.querySelector('channel description').textContent
        const items = Array.from(doc.querySelectorAll('item')).map((item) => {
            const titleItem = item.querySelector('title').textContent
            const descriptionItem = item.querySelector('description').textContent
            const link = item.querySelector('link').textContent
            return { titleItem, descriptionItem, link }
        })
        return { url, title, description, items}
    }
    catch (e) {
        console.log(e.message)
        throw new Error(i18next.t(`errors.${e.message}`))
    }
}