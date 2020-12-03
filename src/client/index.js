// WebSocketのコネクション生成
let socket = new WebSocket("ws://localhost:3000");
// メッセージを受け取った時の処理
socket.onmessage = (m) => { getMessgae(m.data) };

function sendMessage() {
    var username = document.getElementById("input_username").value;
    var message = document.getElementById("input_message").value;

    var obj = {
        "username": username,
        "message": message
    }

    var json = JSON.stringify(obj);
    // メッセージを送信
    socket.send(json);
}

function getMessgae(json) {
    var messageList = JSON.parse(json);
    var messageArea = document.getElementById("message-area");
    messageArea.innerHTML = "";
    messageList.forEach(m => {
        var username = m["username"];
        var message = m["message"]
        messageArea.insertAdjacentHTML('beforeend', username + ':' + message + '<br>');
    })
}
