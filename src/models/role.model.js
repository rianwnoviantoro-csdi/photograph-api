import { Sequelize } from 'sequelize'
import db from '../config/dbConfig.js'

const { DataTypes } = Sequelize

const RoleSchema = db.define('roles', {
    code: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
})

export default RoleSchema