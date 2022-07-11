import { Op } from 'sequelize'
import db from '../models/index.js'

const Role = db.roles

// Create Role
export const addRole = async (req, res) => {
    const { code, name, description} = req.body

    try {
        const exist = await Role.findAll({
            where: {
                [Op.or]: [{code: code}, {name: name}]
              }
        })

        if (exist.length) return res.status(400).json({ msg : 'Role already exist' })

        let info = {
            code: code,
            name: name,
            description: description
        }

        await Role.create(info)
        return res.status(200).json({ msg: 'Role created'})
    } catch (err) {
        console.log(err.message)
    }
}