const yup = require('./config')

let schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
})

module.exports = schema