const knex = require('../db/connection')
const schemaCustomersRegister = require('../schema/schemaCustomersRegister')
const schemaCustomersUpdate = require('../schema/schemaCustomersUpdate')
const schemaCustomersId = require('../schema/schemaCustomersId')
const compareData = require('../utils/compareData')

module.exports = {
    async registerCustomer(req, res) {
        const {
            name,
            email,
            cpf,
            phone,
            cep,
            address,
            complement,
            district,
            city,
            state
        } = req.body

        const { id } = req.user

        try {
            await schemaCustomersRegister.validate(req.body)

            const existsEmail = await knex('customers')
                .where({ email })
                .first()

            if (existsEmail) {
                return res.status(400).json({
                    "message": "O e-mail já existe"
                })
            }

            const existsCPF = await knex('customers')
                .where({ cpf })
                .first()

            if (existsCPF) {
                return res.status(400).json({
                    "message": "O CPF já existe"
                })
            }

            const customer = await knex('customers')
                .insert({
                    user_id: id,
                    name,
                    email,
                    cpf,
                    phone,
                    cep,
                    address,
                    complement,
                    district,
                    city,
                    state
                })

            if (!customer) {
                return res.status(400).json({
                    "message": "Não foi possível cadastrar o cliente!"
                })
            }

            return res.status(200).json({ "message": "Cliente cadastrado com sucesso!" })
        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },

    async listCustomers(req, res) {
        const customersList = []

        try {
            async function getCustomers() {
                return await
                    knex.select('c.id', 'c.name', 'c.cpf', 'c.email', 'c.phone')
                        .from('customers as c')
            }

            async function getCustomersCharges(customerId) {
                return await
                    knex.select('c.id', 'ch.deadline', 'ch.is_paid')
                        .from('charges as ch')
                        .leftJoin('customers as c', 'ch.customer_id', 'c.id')
                        .where({ customer_id: customerId })
            }

            const customers = await getCustomers()

            for (let i = 0; i < customers.length; i++) {
                let status = 'em dia'
                const { ...rest } = customers[i]

                const customerCharges = await getCustomersCharges(customers[i].id)

                customerCharges.filter(item => {
                    if (compareData(item.is_paid, item.deadline) === 'vencida') {
                        status = 'inadimplente'
                        return
                    }
                })

                customers[i] = { ...rest, status }

                customersList.push(customers[i])
            }

            return res.status(200).json(customersList)
        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },

    async detailCustomer(req, res) {
        const { id } = req.params

        try {
            await schemaCustomersId.validate(req.params)

            const customer = await knex('customers')
                .where({ id })
                .first()

            if (!customer) {
                return res.status(404).json({ "message": "Cliente não encontrado" })
            }

            const { user_id, ...customerData } = customer

            return res.status(200).json(customerData)
        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },

    async updateCustomer(req, res) {
        const {
            name,
            email,
            cpf,
            phone,
            cep,
            address,
            complement,
            district,
            city,
            state
        } = req.body

        const { id } = req.params

        if (!name && !email && !cpf && !phone) {
            return res
                .status(404)
                .json({
                    messagem: "Obrigatório informar ao menos um campo para atualização"
                })
        }

        try {
            await schemaCustomersId.validate(req.params)

            await schemaCustomersUpdate.validate(req.body)

            const customerExist = await knex('customers')
                .where({ id })
                .first()

            if (!customerExist) {
                return res.status(404).json({
                    "message": "Cliente não existe"
                })
            }

            const existEmailCustomer = await knex('customers')
                .where({ email })
                .andWhere('id', '<>', id)
                .first()

            if (existEmailCustomer) {
                return res.status(404).json({
                    "message": "O e-mail informado já foi cadastrado"
                })
            }

            const existCPFCustomer = await knex('customers')
                .where({ cpf })
                .andWhere('id', '<>', id)
                .first()

            if (existCPFCustomer) {
                return res.status(404).json({
                    "message": "O CPF informado já foi cadastrado"
                })
            }

            const updateCustomer = await knex('customers')
                .where({ id })
                .update({
                    name,
                    email,
                    cpf,
                    phone,
                    cep,
                    address,
                    complement,
                    district,
                    city,
                    state
                })

            if (!updateCustomer) {
                return res.status(404).json({
                    "message": "Não foi possível alterar os dados do cliente!"
                })
            }
            return res.status(200).json({
                "message": "Dados do cliente atualizados com sucesso"
            })

        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },

    async deleteCustomer(req, res) {
        const { id } = req.params

        try {
            await schemaCustomersId.validate(req.params)

            const customer = await knex.select('id')
                .from('customers')
                .where({ id })
                .first()

            if (!customer) {
                return res.status(404).json({ "message": "Cliente não encontrado" })
            }

            const customerDeleted = await knex('customers')
                .where({ id })
                .del()

            if (!customerDeleted) {
                return res.status(400).json({ "message": "Não foi possível excluir o cliente!" })
            }

            return res.status(200).json({ "message": "Cliente excluído com sucesso!" })
        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },
}