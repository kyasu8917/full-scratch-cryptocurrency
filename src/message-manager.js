class MessageManager{

    protocol = 'protocol_name';
    version = '0.0.1';

    MSG_ADD = 0
    MSG_REMOVE = 1
    MSG_CORE_LIST = 2
    MSG_REQUEST_CORE_LIST = 3
    MSG_PING = 4
    MSG_ADD_AS_EDGE = 5
    MSG_REMOVE_EDGE = 6

    ERR_PROTOCOL_UNMATCH = 0
    ERR_VERSION_UNMATCH = 1
    OK_WITH_PAYLOAD = 2
    OK_WITHOUT_PAYLOAD = 3

    constructor() {
    };

    build(msg_type, payload) {
        message = {
            'protocol': this.protocol,
            'version': this.version,
            'msg_type': msg_type,
            'payload': payload
        };

        return JSON.stringify(message);
    }

    /*
        受信したメッセージ（json）をパースし、解釈した上で返却する
        @param {Buffer} data TCPで受信したデータ
    */
    parse(data) {
        return this.interpret(JSON.parse(data.toString()));
    }

    interpret(json) {
        if(!this.isProtocolMatch(json['protocol'])) {
            return {'status': 'error', 'detail': this.ERR_PROTOCOL_UNMATCH, 'msgType':null, 'payload': null};
        }

        if(!this.isVersionMatch(json['version'])) {
            return {'status': 'error', 'detail': this.ERR_VERSION_UNMATCH, 'msgType':null, 'payload': null};
        }

        if (json['msg_type'] == this.MSG_CORE_LIST) {
            return {'status': 'success', 'detail': this.OK_WITH_PAYLOAD, 'msgType': json['msg_type'], 'payload': json['payload']};
        } else {
            return {'status': 'success', 'detail': this.OK_WITHOUT_PAYLOAD, 'msgType': json['msg_type'], 'payload': null};
        }
    }

    isProtocolMatch(input) {
        return this.protocol == input;
    }

    isVersionMatch(input) {
        return this.version == input;
    }

}

module.exports = MessageManager;