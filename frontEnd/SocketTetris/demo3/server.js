const ws = require('nodejs-websocket');

let count = 0

let server = ws.createServer((conn) => {
    count++;
    conn.nickName = "user" + count + ": ";
    conn.on("text", (str) => {
        server.connections.forEach(connection => {
            connection.sendText(conn.nickName + str)
        })
    })
    conn.on("close", () => {
        console.log("close")
    })
    conn.on("error", () => {
        console.log("error")
    })
}).listen(3000)
