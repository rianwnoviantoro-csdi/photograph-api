import { Sequelize } from 'sequelize'
import db from '../config/dbConfig.js'

const { DataTypes } = Sequelize

const EmployeeSchema = db.define('employees', {
    name: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.TEXT
    },
    flagActive: {
        type: DataTypes.BOOLEAN
    }
}, {
    freezeTableName: true
})

export default EmployeeSchema