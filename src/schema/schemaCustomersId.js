const yup = require('yup')

let schemaId = yup.object().shape({
  id: yup.string().uuid('O id do cliente deve ser um UUID válido'),
})

module.exports = schemaId