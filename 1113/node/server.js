let http = require('http')
let fs = require('fs')
let mysql = require('mysql')
let db = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: '20171113' })

db.query('select * from user', (err, data) => {
    if (err) {
        console.log(err)
    } else {
        console.log(data)
    }
})

const httpServer = http.createServer((req, res) => {
    fs.readFile(`www${req.url}`, (err, data) => {
        if (err) {
            res.writeHead(404)
            res.write('not found')
        } else {
            res.writeHead(200)
            res.write(data)
        }
        res.end();
    })
})

httpServer.listen(8080)