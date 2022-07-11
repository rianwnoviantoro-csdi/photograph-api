import { Sequelize } from 'sequelize'
import dbConfig from '../config/dbConfig.js'
import AccountSchema from './account.model.js'
import EmployeeSchema from './employee.model.js'
import JobSchema from './job.model.js'
import RoleSchema from './role.model.js'

const db = {}

db.Sequelize = Sequelize
db.dbConfig = dbConfig

db.employees = EmployeeSchema
db.jobs = JobSchema
db.accounts = AccountSchema
db.roles = RoleSchema

db.dbConfig.sync({ alter: true, force: false })
    .then(() => {
        console.log('Yes, re-sync done!')
    })

db.employees.belongsToMany(db.jobs, {
    through: 'employee_job',
    as: 'jobs',
    foreignKey: 'employeeId'
})

db.jobs.belongsToMany(db.employees, {
    through: 'employee_job',
    as: 'employees',
    foreignKey: 'jobId',
})

db.roles.hasMany(db.accounts, { as: 'account'})
db.accounts.belongsTo(db.roles, {
    foreignKey: 'roleId',
    as: 'role'
})


export default db