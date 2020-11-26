const express = require('express');
const mqtt = require('async-mqtt');
const config = require('./config').config;
const cors = require('cors');
const app = express();
app.use(cors());

let mqttConn = null;
let timerInd = null;
app.get('/test', (req, res) => {
    return res.status(200).json({ test: "Done" });
});

app.get('/mqtt', (req, res) => {
    const connStatus = (mqttConn && mqttConn.connected) ? 'Started' : 'Stopped';
    const topic = config.TOPICNAME;
    return res.status(200).json({ status: connStatus, topic });
});

app.post('/mqtt', async (req, res) => {
    if (req.query.mode) {
        switch (req.query.mode) {
            case 'start':
                if(mqttConn && timerInd){
                    return res.status(200).json({status: "Already Started"});
                }
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
                return res.status(200).json({status: "Started"});
            case 'stop':
            default:
                if (timerInd && mqttConn) {
                    clearInterval(timerInd);
                    timerInd = null;
                    mqttConn.end();
                    mqttConn = null;
                    return res.status(200).json({status: "Stopped"});
                }else{
                    return res.status(200).json({status: "Not yet started"});
                }
                
        }
    }
});

app.listen(process.env.PORT || 3000);