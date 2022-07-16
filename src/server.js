const express = require('express')
const cors = require('cors')
const app = express()

const router = require('./router')

require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use('/', router)

app.listen(process.env.PORT, () => console.log(`Server is Running at http://localhost:${process.env.PORT}/`))
