var msg = {};
var node = {};

var line1 = '';
var line2 = '';
node.send = function (msg) {
    if (msg.topic == 'line1') {
        line1 = msg.payload;
    }
    else {
        line2 = msg.payload;
    }
    console.log(line1);
    console.log(line2);
    console.log();

}

msg.payload =
    [
        { "line1": "Praveen", "line2": "Gulati" },
        { "line1": "Ajith", "line2": "Vasudevan" },
        { "line1": "Arun", "line2": "Jayapal" }
    ];

function lcdscroll(msg) {

    if (Array.isArray(msg.payload)) {
        console.log('it is an array');
        if (node.timer) {
            clearInterval(node.timer);
        }
        node.items = msg.payload.slice();
        node.curpos = 0;
        node.step = 1;
        node.line1 = true;
        node.hold = 0;
        node.timer = setInterval(function () {
            if (node.step == 2) {
                node.hold++;
                if (node.hold <= 20) {
                    return;
                }
                node.hold = 0;
            } else if (node.line1) {
                node.hold++;
                if (node.hold <= 4) {
                    return;
                }
                node.hold = 0;
            }
            var idx1 = node.curpos;
            var text1 = node.line1 ? node.items[idx1].line1 : node.items[idx1].line2;
            text1 = text1.padEnd(16, ' ');
            var idx2 = idx1 + 1;
            idx2 = idx2 % node.items.length;
            var text2 = node.line1 ? node.items[idx2].line1 : node.items[idx2].line2;
            text2 = text2.padEnd(16, ' ');
            var text = text1.substr(node.step - 1, 16) + text2;
            text = text.substr(0, 16);
           
         
            var message = {};
            message.payload = text;
            message.topic = node.line1 ? 'line1' : 'line2';
            node.send(message);
            if (!node.line1) {
                node.step++;
                if (node.step == 16) {
                    node.step = 1;
                    node.curpos++;
                    node.curpos = node.curpos % node.items.length;
                }
            }
            node.line1 = !node.line1;
        }, 200);
    }
    else {
        node.send(msg.payload);
    }
}

lcdscroll(msg);


