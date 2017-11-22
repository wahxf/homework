let http = require('http')
let fs = require('fs')
let mysql = require('mysql')
let io = require('socket.io')
let url = require('url')
const db = mysql.createPool({ host: 'localhost', user: 'root', database: '20171113' })
const { isName, isPassword } = require('./util')

let server = http.createServer((req, res) => {
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
})
server.listen(9001)

let aSocket = []
let socketServer = io.listen(server)
socketServer.on('connection', socket => {
    let cur_username = ''
    let cur_userId = 1
        // 注册
    socket.on('reg', data => {
        let { username, password } = data
        // 查询数据库
        db.query(`select * from user where username='${username}'`, (err, data) => {
            if (err) {
                socket.emit('reg_ret', { code: 1, msg: '数据库出错了' })
            } else if (data.length > 0) {
                socket.emit('reg_ret', { code: 1, msg: '用户名已存在' })
            } else {
                //插入数据库 
                db.query(`insert into user (username, password, online) values ('${username}', '${password}', 0)`, err => {
                    if (err) {
                        socket.emit('reg_ret', { code: 1, msg: '数据库有问题' })
                    } else {
                        socket.emit('reg_ret', { code: 1, msg: '注册成功' })
                    }
                })
            }
        })
    })

    // 登陆
    socket.on('login', data => {
        let { username, password } = data
        if (!isName(username)) {
            socket.emit('login_ret', { code: 1, msg: '用户名格式不正确' })
        } else if (!isPassword(password)) {
            socket.emit('login_ret', { code: 1, msg: '密码格式不正确' })
        } else {
            // 查询数据库
            db.query(`select id,password from user where username='${username}'`, (err, data) => {
                if (err) {
                    socket.emit('login_ret', { code: 1, msg: '数据库出错了' })
                } else if (data.length == 0) {
                    socket.emit('login_ret', { code: 1, msg: '用户名不存在' })
                } else if (data[0].password !== password) {
                    socket.emit('login_ret', { code: 1, msg: '密码有误' })
                } else {
                    db.query(`UPDATE user SET online=1 WHERE id='${data[0].id}'`, err => {
                        if (err) {
                            socket.emit('login_ret', { code: 1, msg: '数据库出错了' })
                        } else {
                            socket.emit('login_ret', { code: 1, msg: '登陆成功' })
                            console.log(data[0].username)
                            cur_username = username
                            cur_userId = data[0].id
                            aSocket.push(socket)
                        }
                    })
                }
            })
        }


    })

    //消息
    socket.on('msg', (text) => {
        if (text == '') {
            socket.emit('msg_ret', { code: 1, msg: '消息不能为空' })
        } else {
            socket.emit('msg_ret', { code: 0, msg: '消息发送成功' })
            aSocket.forEach(item => {
                if (item == socket) return;
                item.emit('msg', cur_username, text)
            });
        }

    })

    // 离线
    socket.on('disconnect', () => {
        db.query(`update user set online=0 where id='${cur_userId}'`, err => {
            if (err) {
                console.log('数据库有错')
            }
            cur_username = ''
            cur_userId = ''
            aSocket = aSocket.filter(item => item !== socket)
        })
    })

})