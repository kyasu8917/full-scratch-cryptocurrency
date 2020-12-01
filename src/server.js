// クライアントからメッセージを受け取るサーバー

const net = require('net');

var server = net.createServer(socket => {
    socket.on('data', data=> {
        console.log('from' + socket.remoteAddress + ':' + socket.remotePort);
        console.log(data.toString());
        socket.write('success in receiving your message!');
    });
    socket.on('close', () => {
        console.log('close connection');
    });
});
server.listen(3000);