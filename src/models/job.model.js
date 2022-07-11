import { Sequelize } from 'sequelize'
import db from '../config/dbConfig.js'

const { DataTypes } = Sequelize

const JobSchema = db.define('jobs', {
    name: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE
    },
    address: {
        type: DataTypes.TEXT
    },
    gmapUrl: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    }
})

export default JobSchema