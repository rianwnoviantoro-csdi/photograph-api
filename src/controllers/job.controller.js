import db from '../models/index.js'

const Job = db.jobs
const Employee = db.employees

// Create Job
export const addJob = async (req, res) => {
    try {
        let info = {
            name: req.body.name,
            date: req.body.date,
            address: req.body.address,
            gmapUrl: req.body.gmap,
            status: req.body.status
        }

        const job = await Job.create(info)

        if (req.body.employeeId) {
            await job.addEmployee(req.body.employeeId, job.id)
        }

        return res.status(200).json({ msg: 'Job created' })
    } catch (err) {
        console.log(err.message)
    }
}

// Get All Job
export const getAllJobs = async (req, res) => {
    try {
        let jobs = await Job.findAll({
            include: {
                model: Employee,
                as: 'employees',
                attributes: ['id', 'name', 'phone', 'address', 'flagActive', 'createdAt', 'updatedAt'],
                through: {
                    attributes: [],
                }
            },
            attributes: ['id', 'name', 'date', 'address', 'gmapUrl', 'status', 'createdAt', 'updatedAt']
        })
        return res.status(200).send(jobs)
    } catch (err) {
        console.log(err.message)
    }
}

// Get One Job
export const getOneJob = async (req, res) => {
    try {
        let id = req.params.id
        let job = await Job.findOne({
            include: {
                model: Employee,
                as: 'employees',
                attributes: ['id', 'name', 'phone', 'address', 'flagActive', 'createdAt', 'updatedAt'],
                through: {
                    attributes: [],
                }
            },
            where: { id: id },
            attributes: ['id', 'name', 'date', 'address', 'gmapUrl', 'status', 'createdAt', 'updatedAt']
        })
        return res.status(200).send(job)
    } catch (err) {
        console.log(err.message)
    }
}

// Update Job
export const updateJob = async (req, res) => {
    try {
        console.log(req.body)
        let id = req.params.id
        await Job.update(req.body, { where: { id: id } })

        if (req.body.employeeId) {
            const job = await Job.findByPk(id)
            await job.addEmployee(req.body.employeeId, id)
        }

        return res.status(200).json({ msg: 'Job updated' })
    } catch (err) {
        console.log(err.message)
    }
}

// Delete Job By ID
export const deleteJob = async (req, res) => {
    try {
        let id = req.params.id
        await Job.destroy({ where: { id: id } })
        return res.status(200).send('Job deleted')
    } catch (err) {
        console.log(err.message)
    }
}