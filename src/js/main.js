// src/js/main.js
import * as yup from 'yup';
import i18next from 'i18next'
import { app } from './app.js'


export const init = () => {
  i18next.init({
    lng: 'ru', 
    debug: true,
    resources: {
      ru: {
        translation: {
          errors: {
                  invalidUrl: 'Ссылка должна быть валидным URL',
                  urlExists: 'RSS уже существует',
                  urlNull: 'Не должно быть пустым',
                  notRss: 'Ресурс не содержит валидный RSS',
                  errorNetwork: 'Ошибка сети',
          },
          success: {
                  validUrl: 'RSS успешно загружен',
                },
          buttons: {
                  buttonClose: 'Закрыть',
                  buttonModal: 'Читать полностью',
                  buttonPost: 'Просмотр'
          }
        }
      }
    }
  }).then(() => yup.setLocale({
    string: {
      url: () => i18next.t('errors.invalidUrl'),
    },
  })).then(() => app())
}




