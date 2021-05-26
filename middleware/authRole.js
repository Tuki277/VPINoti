const jwt = require('jsonwebtoken')
const redis = require('redis')

exports.authAdmin = (req, res, next) => {
    const token = req.headers['authorization']
    const tokenData = token.slice(7)
    req.data = tokenData
    const key = jwt.verify(req.data, 'mk')
    console.log(key.username)
    const client = redis.createClient(6379)
    return client.GET(key.username, (err, data) => {
        const role = JSON.parse(data).data[0].role
        if (role === 'admin') {
            next()
        } else {
            res.status(401).json({ message : 'NOT PERMISSION' })
        }
    })
}
