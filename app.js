import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dbConfig from './src/config/dbConfig.js'
import router from './src/routes/index.js'

dotenv.config()
const app = express()
const USE_PORT = process.env.PORT || 5000

try {
    await dbConfig.authenticate()
    console.log('DB Connected')
} catch (err) {
    console.error(err)
}

app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(router)

app.listen(USE_PORT, () => console.log(`Port ${USE_PORT} is open...`))
