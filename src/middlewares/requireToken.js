import jwt from 'jsonwebtoken'

export const requireToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403)

        req.email = decoded.accountUsername
        next()
    })
}

export const requireSuper = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403)

        req.role = decoded.accountRoleCode

        if (req.role !== 'ROLE_OWNER') return res.sendStatus(403)

        next()
    })
}