import { Sequelize } from 'sequelize'

const db = new Sequelize(process.env.DB_NAME || 'photograph', process.env.DB_USERNAME || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql'
})

export default db