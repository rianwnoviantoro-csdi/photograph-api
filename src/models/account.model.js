import { Sequelize } from 'sequelize'
import db from '../config/dbConfig.js'

const { DataTypes } = Sequelize

const AccountSchema = db.define('accounts', {
    name: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refreshToken: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
})

export default AccountSchema