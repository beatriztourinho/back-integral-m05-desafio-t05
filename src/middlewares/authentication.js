const jwt = require('jsonwebtoken');
const knex = require('../db/connection');

module.exports = {
  async isValidToken(req, res, next) {
    const { authorization } = req.headers

    try {
      const token = authorization.replace('Bearer', '').trim()

      const { id } = jwt.verify(token, process.env.SECRET_KEY)

      const user = await knex('users')
        .where({ id })
        .first()

      if (!user) {
        return res.status(404).json({ "message": "Usuário não encontrado. Favor logar novamente." })
      }

      const { password: _, ...userData } = user

      req.user = userData

      next()
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ "message": "Usuário não autorizado. Favor fazer login novamente." })
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ "message": "O token expirou. Favor fazer login novamente." })
      }

      return res.status(500).json({ "message": "Ocorreu um erro inesperado: " + error.message })
    }
  }
}