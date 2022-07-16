const yup = require('./config')

let schemaUsers = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  cpf: yup.string(),
  phone: yup.string(),
})

module.exports = schemaUsers