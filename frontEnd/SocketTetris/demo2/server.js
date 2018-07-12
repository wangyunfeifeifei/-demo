const ws = require('nodejs-websocket');

const server = ws.createServer((connection) => {
    console.log("new connection");
    connection.on("text", (str) => {
        console.log("Received"+ str);
        connection.sendText(str.toUpperCase() + "!!!");
    });
    connection.on("close", () => {
        console.log("connection close");
    });
    connection.on("error", (err) => {
        console.log(err)
    })
}).listen(3000)
