const bcrypt = require('bcrypt')
const knex = require('../db/connection')
const jwt = require('jsonwebtoken')
const schemaLogin = require('../schema/schemaLogin')
const schemaUsers = require('../schema/schemaUsers')

module.exports = {
    async registerUser(req, res) {
        const { name, email, password } = req.body

        try {
            await schemaUsers.validate(req.body)

            const existsEmail = await knex('users').where({ email }).first()

            if (existsEmail) {
                return res.status(400).json({ "message": "O e-mail informado já foi cadastrado" })
            }

            const encryptedPassword = await bcrypt.hash(password, 10)

            const registeredUser = await knex('users')
                .insert({
                    name,
                    email,
                    password: encryptedPassword
                })

            if (registeredUser.length === 0) {
                return res.status(400).json({ "message": "Não foi possível cadastrar o usuário!" })
            }

            return res.status(201).json({ "message": "Usuário cadastrado com sucesso!" })
        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },

    async loginUser(req, res) {
        const { email, password } = req.body

        try {
            await schemaLogin.validate(req.body)

            const user = await knex('users').where({ email }).first()

            if (!user) {
                return res.status(401).json({ "message": "Usuário ou senha incorretos" })
            }

            const verifyPassword = await bcrypt.compare(password, user.password)

            if (!verifyPassword) {
                return res.status(401).json({ "message": "Usuário ou senha incorretos" })
            }

            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1d' })

            return res.status(200).json({
                token,
                user: {
                    name: user.name,
                    email: user.email
                }
            })
        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },

    async detailUser(req, res) {
        const { user } = req

        try {
            return res.status(200).json(user)
        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },

    async updateUser(req, res) {
        const { name, email, password, cpf, phone } = req.body
        const { id } = req.user
        let encryptedPassword

        try {
            await schemaUsers.validate(req.body)

            const existsEmail = await knex('users')
                .where({ email })
                .andWhere('id', '<>', id)
                .first()

            if (existsEmail) {
                return res.status(400).json({ "message": "O e-mail informado já foi cadastrado" })
            }

            const existsCPF = await knex('users')
                .where({ cpf })
                .andWhere('id', '<>', id)
                .first()

            if (existsCPF) {
                return res.status(400).json({ "message": "O CPF informado já foi cadastrado" })
            }

            if (password) {
                encryptedPassword = await bcrypt.hash(password, 10)
            }

            const user = await knex('users')
                .where({ id })
                .update({
                    name,
                    email,
                    password: encryptedPassword,
                    cpf,
                    phone
                })

            if (!user) {
                return res.status(400).json("Não foi possível alterar os dados do usuário!")
            }

            return res.status(200).json("Dados do usuário atualizados com sucesso!")
        } catch (error) {
            return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
        }
    },
}