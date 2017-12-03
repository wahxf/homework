var net = require('net')
var crypto = require('crypto')

var ws = net.createServer(socket => {
    console.log('有人链接')
    socket.once('data', data => {
        // console.log(data.toString())
        var aHeaders = data.toString().split('\r\n')
        // 扔掉最后的两个空值和http请求行
        aHeaders.pop()
        aHeaders.pop()
        aHeaders.shift()

        // 将aHeaders转json
        var headers = {}
        aHeaders.forEach(item => {
            var [key, value] = item.split(': ')
            headers[key] = value
        })
        // console.log(headers)
        //判断是否是websocket协议
        if(headers.Connection !== 'Upgrade' || headers.Upgrade !== 'websocket') {
            console.log('连接不是websocket')
            socket.end()
        } else {
            console.log('这是一个websocket连接')
            // 判断websocket版本
            if(headers['Sec-WebSocket-Version'] != 13) {
                console.log('websocket的版本不是13')
                socket.end()
            }
            // 处理
            var hash = crypto.createHash('sha1')
            hash.update(headers['Sec-WebSocket-Key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
            var hashKey = hash.digest('base64')

           socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${hashKey}\r\nSec-WebSocket-Protrol: chat\r\n\r\n`)
           console.log('websocket握手成功')
        }
        socket.on('data', data => {
            console.log(data)
        })
    })

   

    socket.on('close', data => {
        console.log('websocket连接断开')
    })
})

ws.listen(8080)

