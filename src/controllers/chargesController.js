const knex = require('../db/connection')
const schemaCharges = require('../schema/schemaCharges')
const schemaChargesId = require('../schema/schemaChargesId')
const compareData = require('../utils/compareData')

module.exports = {
  async registerCharge(req, res) {
    const { customer_id, description, deadline, value, is_paid } = req.body

    try {
      await schemaCharges.validate(req.body)

      const newCharge = await knex('charges')
        .insert({
          customer_id,
          description,
          deadline,
          value,
          is_paid
        })

      if (!newCharge) {
        return res.status(400).json({ "message": "Não foi possível cadastrar a cobrança!" })
      }

      return res.status(201).json({ "message": "Cobrança cadastrada com sucesso" })
    } catch (error) {
      return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
    }
  },

  async listCharges(req, res) {
    let status

    try {
      const charges = await knex.select('ch.id', 'ch.customer_id', 'c.name', 'ch.value', 'ch.deadline', 'ch.is_paid', 'ch.description')
        .from('charges as ch')
        .join('customers as c', 'c.id', 'ch.customer_id')
        .orderBy('ch.id')

      const chargesList = charges.map((charge) => {
        let { is_paid, deadline, ...rest } = charge

        status = compareData(is_paid, deadline)

        charge = { ...rest, deadline, status }

        return charge
      })

      return res.status(200).json(chargesList)
    } catch (error) {
      return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
    }
  },

  async detailCharge(req, res) {
    const { id } = req.params
    let status

    try {
      await schemaChargesId.validate(req.params)

      let detailedCharge = await knex.select('ch.id', 'ch.customer_id', 'c.name', 'ch.value', 'ch.deadline', 'ch.is_paid', 'ch.description')
        .from('charges as ch')
        .join('customers as c', 'c.id', 'ch.customer_id')
        .where('ch.id', id)
        .first()

      if (!detailedCharge) {
        return res.status(404).json({ "message": "Cobrança não encontrada" })
      }

      const { is_paid, deadline, ...rest } = detailedCharge

      status = compareData(is_paid, deadline)

      detailedCharge = { ...rest, deadline, status }

      return res.status(200).json(detailedCharge)
    } catch (error) {
      return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
    }
  },

  async updateCharge(req, res) {
    const { id } = req.params
    const { description, deadline, value, is_paid } = req.body

    try {
      await schemaChargesId.validate(req.params)

      await schemaCharges.validate(req.body)

      const charge = await knex('charges')
        .where({ id })
        .first()

      if (!charge) {
        return res.status(404).json({ "message": "Cobrança não encontrada" })
      }

      const chargeEdited = await knex('charges')
        .where({ id })
        .update({
          description,
          deadline,
          value,
          is_paid
        })

      if (!chargeEdited) {
        return res.status(400).json({ "message": "Não foi possível alterar os dados da cobrança!" })
      }

      return res.status(200).json({ "message": "Cobrança atualizada com sucesso" })
    } catch (error) {
      return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
    }
  },

  async deleteCharge(req, res) {
    const { id } = req.params

    try {
      await schemaChargesId.validate(req.params)

      const charge = await knex('charges')
        .where({ id })
        .first()

      if (!charge) {
        return res.status(404).json({ "message": "Cobrança não encontrada" })
      }

      const { is_paid, deadline } = charge

      const status = compareData(is_paid, deadline)

      if (status === 'paga' || status === 'vencida') {
        return res.status(400).json({ "message": "Esta cobrança não pode ser excluída!" })
      }

      const chargeDeleted = await knex('charges')
        .where({ id })
        .del()

      if (!chargeDeleted) {
        return res.status(400).json({ "message": "Não foi possível excluir a cobrança!" })
      }

      return res.status(200).json({ "message": "Cobrança excluída com sucesso!" })
    } catch (error) {
      return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
    }
  },
}