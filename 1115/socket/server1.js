let http = require('http')
let fs = require('fs')
let mysql = require('mysql')
let io = require('socket.io')
let url = require('url')
const db = mysql.createPool({ host: 'localhost', user: 'root', database: '20171113' })
const { isName, isPassword } = require('./util')

let server = http.createServer((req, res) => {
    let { pathname, query } = url.parse(req.url, true)
        // 注册
    if (pathname == '/reg') {
        let { name, password } = query
        if (!isName(name)) {
            createResponse(res, 200, { code: 1, msg: '用户格式不正确' })
        } else if (!isPassword(password)) {
            createResponse(res, 200, { code: 1, msg: '密码格式不正确' })
        } else {
            // 判断用户是否存在
            console.log(name, password)
            db.query(`select * from user where username='${name}'`, (err, data) => {
                console.log(data)
                if (err) {
                    createResponse(res, 200, { code: 1, msg: '服务器出错了' })
                } else {
                    if (data.length) {
                        createResponse(res, 200, { code: 1, msg: '用户名已存在' })
                    } else {
                        db.query(`insert into user (username, password) values ('${name}', '${password}')`, () => {
                            if (err) {
                                createResponse(res, 200, { code: 1, msg: '注册失败' })
                            } else {
                                createResponse(res, 200, { code: 0, msg: '注册成功' })
                            }
                        })
                    }
                }
            })
        }
    } else if (pathname == '/login') { //登陆
        let { name, password } = query
        if (!isName(name)) {
            createResponse(res, 200, { code: 1, msg: '用户格式不正确' })
        } else if (!isPassword(password)) {
            createResponse(res, 200, { code: 1, msg: '密码格式不正确' })
        } else {
            // 判断用户是否存在
            db.query(`select * from user where username='${name}'`, (err, data) => {
                console.log(data)
                if (err) {
                    createResponse(res, 200, { code: 1, msg: '数据库出错了' })
                } else {

                    if (data.length && data[0].password == password) {
                        createResponse(res, 200, { code: 1, msg: '登陆成功' })
                    } else if (data.length && data[0].password !== password) {
                        createResponse(res, 200, { code: 0, msg: '密码错误' })
                    }
                }


            })
        }
    } else {
        fs.readFile(`www${req.url}`, (err, data) => {
            if (err) {
                res.writeHead(404)
                res.write('not found')
            } else {
                res.writeHead(200)
                res.write(data)
            }
            res.end()
        })
    }
})

function createResponse(res, code, data) {
    res.writeHead(code, {
        'Content-Type': 'text/plain'
    })
    res.write(JSON.stringify(data))
    res.end()
}

server.listen(9001)