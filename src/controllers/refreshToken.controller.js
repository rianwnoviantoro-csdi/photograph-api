import jwt from 'jsonwebtoken'
import db from '../models/index.js'

const Account = db.accounts

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.sendStatus(401)

        const account = await Account.findAll({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!account.length) return res.sendStatus(403)

        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, decode) => {
            if (err) return res.sendStatus(403)

            const accountId = registered[0].id
            const accountName = registered[0].name
            const accountUsername = registered[0].username
            const accountEmail = registered[0].email
            const accountRoleCode = registered[0].role.code

            const accessToken = jwt.sign({ accountId, accountName, accountUsername, accountEmail, accountRoleCode }, process.env.TOKEN_KEY, {
                expiresIn: '20s'
            })

            return res.json({ accessToken })
        })

    } catch (err) {
        console.log(err.message)
    }
}