const express = require('express');
const mqtt = require('async-mqtt');
const config = require('./config').config;
const TestClass = require('./bug-locate');
const app = express();
let mqttConn = null;
let timerInd = null;
app.get('/test', (req, res) => {
    return res.status(200).json({ test: "Done" });
});

app.get('/mqtt', (req, res) => {
    const testClassInstance = new TestClass();
    testClassInstance.testMe();
    const connStatus = (mqttConn && mqttConn.connected) ? 'Started' : 'Stopped';
    const topic = config.TOPICNAME;
    return res.status(200).json({ status: connStatus, topic });
});

app.post('/mqtt', async (req, res) => {
    if (req.query.mode) {
        switch (req.query.mode) {
            case 'start':
                mqttConn = await mqtt.connect(config.MQTTHOST);
                timerInd = setInterval(async () => {
                    try {
                        await mqttConn.publish(
                            config.TOPICNAME,
                            JSON.stringify({ timestamp: Date.now(), currentValue: Math.random() })
                        )
                    } catch (ex) {
                        console.log(ex.stack);
                    }
                }, 5000);
                res.status(200).json({status: "Started"});
                break;
            case 'stop':
            default:
                if (timerInd) {
                    clearInterval(timerInd);
                }
                if (mqttConn) {
                    mqttConn.end();
                    mqttConn = null;
                }
                res.status(200).json({status: "Stopped"});
        }
    }
});

app.listen(process.env.PORT || 3000);