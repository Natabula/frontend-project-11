import { errorsApp } from "./errors";
import i18next from "i18next";

export const parserRss = ([contenst, url], state) => {
    try {
        const parserDom = new DOMParser()
        const doc = parserDom.parseFromString(contenst, 'text/xml')
        const parseError = doc.querySelector('parsererror')

        if (parseError) {
            console.log(parseError)
            if(doc.bode?.querySelector('parsererror')) {
                throw new Error('invalidUrl')
            }
            else {
                throw new Error('notRss')
            }
        }
        const title = doc.querySelector('channel title').textContent
        const discription = doc.querySelector('channel discription').textContent
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
        throw errorsApp(i18next.t(`errors.${e.message}`), state)
    }
}