import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../models/index.js'
import jwt from 'jsonwebtoken'

const Account = db.accounts

// Create Account
export const signUp = async (req, res) => {
    const { name, username, email, password, confirmPassword, role } = req.body
    
    try {
        if (password !== confirmPassword) return res.status(400).json({ msg: 'Password not match' })

        const exist = await Account.findAll({
            where: {
                [Op.or]: [{ username: username }, { email: email }]
            }
        })

        console.log(exist)

        if (exist.length) return res.status(400).json({ msg: 'Username or email already taken' })

        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const hashPassword = await bcrypt.hash(password, salt)

        let info = {
            name: name,
            username: username,
            email: email,
            password: hashPassword,
            roleId: role || 1
        }

        await Account.create(info)
        return res.status(200).json({ msg: 'Account created' })
    } catch (err) {
        console.log(err.message)
    }
}

// SignIn Account
export const signIn = async (req, res) => {
    const { username, password } = req.body

    try {
        const registered = await Account.findAll({
            where: {
                [Op.or]: [{ username: username }, { email: username }]
            },
            include: ['role']
        })

        if (!registered.length) return res.status(400).json({ msg: 'Username or email not registered' })

        const match = await bcrypt.compare(password, registered[0].password)

        if (!match) return res.status(400).json({ msg: 'Invalid password' })

        const accountId = registered[0].id
        const accountName = registered[0].name
        const accountUsername = registered[0].username
        const accountEmail = registered[0].email
        const accountRoleCode = registered[0].role.code

        const accessToken = jwt.sign({ accountId, accountName, accountUsername, accountEmail, accountRoleCode }, process.env.TOKEN_KEY, {
            expiresIn: '20s'
        })

        const refreshToken = jwt.sign({ accountId, accountName, accountUsername, accountEmail, accountRoleCode }, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: '1d'
        })

        await Account.update({
            refreshToken: refreshToken
        }, {
            where: {
                id: accountId
            }
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: true
        })

        return res.status(200).json({ accessToken })

    } catch (err) {
        console.log(err.message)
    }
}

// Edit Account
export const updateAccount = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(204)

        const account = await Account.findAll({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!account.length) return res.sendStatus(204)

        const accountId = account[0].id

        let info = {
            name: req.body.name
        }

        await Account.update(info, { where: { id: accountId } })

        return res.status(200).json({ msg: 'Account updated'})
    } catch (error) {

    }
}

// Edit Password
export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body

    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(204)

        const account = await Account.findAll({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!account.length) return res.sendStatus(204)

        const accountId = account[0].id

        const exist = await Account.findByPk(accountId, {
            attributes: ['password']
        })

        if (!exist) return res.status(404).json({ msg: 'Account not found' })
        
        const match = await bcrypt.compare(oldPassword, exist.password)

        if (!match) return res.status(400).json({ msg: 'Invalid old password' })

        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const hashNewPassword = await bcrypt.hash(newPassword, salt)

        let info = {
            password: hashNewPassword,
            refreshToken: null
        }

        await Account.update(info, { where: { id: accountId } })

        res.clearCookie('refreshToken')

        return res.status(200).json({ msg: 'Password updated'})

    } catch (err) {
        console.log(err.message)
    }
}

// SignOut Account
export const signOut = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(204)

        const account = await Account.findAll({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!account.length) return res.sendStatus(204)

        const accountId = account[0].id

        await Account.update({
            refreshToken: null
        }, {
            where: {
                id: accountId
            }
        })

        res.clearCookie('refreshToken')
        return res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
    }
}