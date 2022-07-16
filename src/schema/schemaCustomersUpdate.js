const yup = require('./config')

const schemaCustomersUpdate = yup.object().shape({
   name: yup.string(),
   email: yup.string().email(),
   cpf: yup.string(),
   phone: yup.string()
})

module.exports = schemaCustomersUpdate