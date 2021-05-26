const e = require('express')
const data = require('../config/connect')
const redis = require('redis')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

exports.getId = (req, res, next) => {
    // const username = req.body.username
    // const password = req.body.password
    // data.query('SELECT * FROM account WHERE account = ? AND password = ?', [username, password], (err, rows, fields) => {
    //     if (rows.length > 0) {
    //         console.log(rows[0].id)
    //         const token = jwt.sign({ username: username}, 'mk')
    //         const client = redis.createClient(6379)

    //         return client.GET(username, (err, data) => {
    //             console.log({ data })
    //             if (data) {
    //                 console.log(JSON.parse(data).data)
    //                 res.status(200).json({
    //                     message : "success (get from redis)",
    //                     token :JSON.parse(data).token,
    //                     rows: JSON.parse(data).data
    //                 })
    //             } else {
    //                 //redis
    //                 client.SET(username, JSON.stringify({
    //                     data : rows,
    //                     token
    //                 }))
    //                 //===================================
    //                 res.status(200).json({ message : "success",
    //                                     token : token,
    //                                     rows
    //                 })
    //             }
    //         })

    //     } else {
    //         // res.send('LOGIN FAIL')
    //         res.status(200).json({ data : "false" })
    //     }
    // })

    // console.log(req.body)

    const client = redis.createClient(6379)
    const id = req.body.id

    client.GET(id, (err, data) => {
        if (data) {
            client.GET(id, (err, data) => {
                res.status(200).json({ message : "success ( get from redis ) "})
            })
        } else {
            client.SET(id, JSON.stringify({
                key : id
            }))
            res.status(200).json({ message : "success (add to redis) " })
        }
    })
}

exports.getProfileById = (req, res, next) => {
    var id = req.params.id
    data.query('SELECT * FROM account WHERE id = ?', id, (err, rows, fields) => {
        if (err) {
            res.status(500).json({ err })
        } else {
            res.status(200).json({ data : rows })
        }
    })
}

exports.postData = (req, res, next) => {

    console.log('connection from app ==== ', global.connections)
    const id = req.body.id
    const message = req.body.message
    // console.log(title)
    if (message) {
        req.app.io.emit('data', id,{
            message: 'success'
        })
        res.status(200).json({ message : "done ( socket on )"})
    } else {
        res.status(200).json({ message : "error ( socket off )"})
    }

    let key = `user_${id}`
    if (global.connections.hasOwnProperty(key)) {
        for ( let i in global.connections[key]) {
            global.connections[key][i].emit('message', message)
        }
    }
}

exports.getData = (req, res, next) => {
    data.query('SELECT * FROM notify', (err, rows, fields) => {
        if (err) {
            res.status(200).json({ err })
        } else {
            res.status(200).json({ data : rows })
        }
    })
}

exports.getNotiByUser = (req, res, next) => {
    const id = req.params.id
    jwt.verify(req.token, 'mk', (err, authData) => { // protected router
        if (err) {
            res.status(403).json({ err })
        } else {
            data.query('SELECT * FROM notify, account WHERE notify.id_user = ? AND notify.id_user = account.id', id, (err, rows, fields) => {
                if ( err ) {
                    res.status(500).json({ err })
                } else {
                    res.status(200).json({ data : rows })
                }
            })
        }
    })
}