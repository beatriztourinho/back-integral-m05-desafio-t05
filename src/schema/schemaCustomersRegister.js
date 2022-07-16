const yup = require('./config')

const schemaCustomersRegister = yup.object().shape({
   name: yup.string().required(),
   email: yup.string().email().required(),
   cpf: yup.string().required(),
   phone: yup.string().required()
})

module.exports = schemaCustomersRegister