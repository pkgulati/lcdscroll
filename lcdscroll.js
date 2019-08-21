module.exports = function (RED) {

    function LCDScrollNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            if (Array.isArray(msg.payload)) {
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
        });
    }
    RED.nodes.registerType("lcdscroll", LCDScrollNode);
}

