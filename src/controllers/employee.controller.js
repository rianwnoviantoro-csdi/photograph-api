import { Op } from 'sequelize'
import db from '../models/index.js'

const Employee = db.employees
const Job = db.jobs

// Create Employee
export const addEmployee = async (req, res) => {
    try {
        let info = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.date,
            flagActive: req.body.flagActive || 1
        }

        await Employee.create(info)

        return res.status(200).json({ msg: 'Employee created'})
    } catch (err) {
        console.log(err.message)
    }
}

// Get All Employe
export const getAllEmployees = async (req, res) => {
    try {
        let employees = await Employee.findAll({
            where: {
                flagActive : 1
            },
            include: {
                model: Job,
                as: 'jobs',
                attributes: ['id', 'name', 'date', 'address',  'gmapUrl', 'status', 'createdAt', 'updatedAt'],
                through: {
                    attributes: [],
                }
            }
        })
        return res.status(200).send(employees)
    } catch (err) {
        console.log(err.message)
    }
}

// Get One Employee
export const getOneEmployee = async (req, res) => {
    try {
        let id = req.params.id
        let employee = await Employee.findOne({ 
            where: { 
                [Op.and]: [{id: id}, {flagActive: 1}]
            },
            include: {
                model: Job,
                as: 'jobs',
                attributes: ['id', 'name', 'date', 'address',  'gmapUrl', 'status', 'createdAt', 'updatedAt'],
                through: {
                    attributes: [],
                }
            }
         })
        return res.status(200).send(employee)
    } catch (err) {
        console.log(err.message)
    }
}

// Update Employee
export const updateEmployee = async (req, res) => {
    try {
        let id = req.params.id
        await Employee.update(req.body, { where: { id: id } })

        if (req.body.jobId) {
            const employee = await Employee.findByPk(id)
            await employee.addEmployee(req.body.jobId, id)
        }

        return res.status(200).json({ msg: 'Employee updated'})
    } catch (err) {
        console.log(err.message)
    }
}

// Delete Employee By ID
export const deleteEmployee = async (req, res) => {
    try {
        let id = req.params.id
        await Employee.destroy({ where: { id: id } })
        return res.status(200).json({ msg: 'Employee deleted'})
    } catch (err) {
        console.log(err.message)
    }
}