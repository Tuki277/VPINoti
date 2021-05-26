const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    console.log(req.header['authorization'])
    if ( typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken
        next()
    } else {
        res.status(403).json({ message: 'Fail'})
    }
}

module.exports = verifyToken