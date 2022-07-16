const yup = require('yup')

let schemaId = yup.object().shape({
  id: yup.number().positive(),
})

module.exports = schemaId