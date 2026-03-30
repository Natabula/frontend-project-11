// src/js/errors.js
export const errorsApp = (err, elements) => {
  elements.input.classList.add('is-invalid')
  elements.feedback.classList.add('text-danger')
  elements.feedback.classList.remove('text-success')
  elements.feedback.textContent = err
}
