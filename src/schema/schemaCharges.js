const yup = require('./config')

let schemaCharges = yup.object().shape({
  customer_id: yup.string().uuid('O id do cliente deve ser um UUID válido'),
  description: yup.string().required(),
  deadline: yup.string().required(),
  value: yup.number().positive().required(),
  is_paid: yup.bool().required(),
})

module.exports = schemaCharges