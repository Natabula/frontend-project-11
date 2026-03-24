// src/js/errors.js
export const errorsApp = (err, elements) => {
  elements.button.classList.remove('disabled')
  elements.input.classList.add('is-invalid')
  elements.feedback.classList.add('text-danger')
  elements.feedback.classList.remove('text-success')
  elements.feedback.textContent = err
}
