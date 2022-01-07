var fs = require('fs');
var path = require('path');
var crypto=require('crypto');
var express = require('express');
var port = process.env.PORT || 3333;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var util = require('util');
var app = express();
app.set('port', port);
app.use('/', express.static(path.join(__dirname, './')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var ccUser = '', //  ----> enter CC key
ccSecret = ''; //  ----> enter CC secret
ccBootstrapUrl = '' //  ----> enter CC bootstrap URL

const { Kafka, CompressionTypes, logLevel } = require('kafkajs')

const topic = 'kafka_resource_requests';

const kafka = new Kafka({
  brokers: [ccBootstrapUrl],
  connectionTimeout: 6000,
  clientId: 'requestPortal-Producer',
  ssl: {
    rejectUnauthorized: false
  },
  sasl: {
    mechanism: 'plain',
    username: ccUser,
    password: ccSecret
  }
});

const producer = kafka.producer();
//const consumer = kafka.consumer({ groupId: "" + Date.now() });

var requestsArray=[];

let msgNumber = 0

runRequests().then(() => console.log("Done"), err => console.log(err));

async function runRequests() {
  // If you specify the same group id and run this process multiple times, KafkaJS
  // won't get the events. That's because Kafka assumes that, if you specify a
  // group id, a consumer in that group id should only read each message at most once.
  //const consumer = kafka.consumer({ groupId: "" + Date.now() });
  const consumer = kafka.consumer({ groupId: "" + Date.now() });
  await consumer.connect();

  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async (data) => {
      const buffId = Buffer.from(data.message.key, 'utf8');
      var datavalue=JSON.parse(data.message.value);
      datavalue.id=buffId.toString(); // 'Hello, World'

      requestsArray.push(datavalue);
      console.log('requestsArray',requestsArray);
    }
  });
}

var createsArray=[];
runCreates().then(() => console.log("Done"), err => console.log(err));

async function runCreates() {
  // If you specify the same group id and run this process multiple times, KafkaJS
  // won't get the events. That's because Kafka assumes that, if you specify a
  // group id, a consumer in that group id should only read each message at most once.
  //const consumer = kafka.consumer({ groupId: "" + Date.now() });
  const consumer = kafka.consumer({ groupId: "" + Date.now() });
  await consumer.connect();

  await consumer.subscribe({ topic: 'create_resources_command', fromBeginning: true });
  await consumer.run({
    eachMessage: async (data) => {
      console.log('new message',data)
      // const buffId = Buffer.from(data.message.key, 'utf8');
      var datavalue=JSON.parse(data.message.value);
      // datavalue.id=buffId.toString(); // 'Hello, World'
      //
      // createsArray.push(datavalue);
      // console.log('createsArray',createsArray);
    }
  });
}


app.listen(port, function () {
  console.log('Express server listening on port ' + port);
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/getRequests', (req, res) => {
  res.send(requestsArray)
});

app.get('/getRequest', (req, res) => {
  console.log('req.params.id',req.query.id)
  var reqid=req.query.id;
  requestsArray.forEach(function(datum) {
    console.log('datum id',datum.id)
    if (datum.id===req.query.id) {
      res.send(datum)
    }
  })
  //res.send(requestsArray.find('id',reqid))
});

function sha256(data) {
 return crypto
  .createHash("sha1")
  .update(data, "binary")
  .digest("hex");
}

// app.post('/createTopic', (req, res) => {
//   console.log('topic to create: ',req.body);
//   res.send('Topic successfully created!');
// })

app.post('/createRequest', (req, res) => {
  var message ={};

  message.value=JSON.stringify(req.body);
  message.key=sha256(message.value);

  var sendMessage = async (message) => {
    await producer.connect()
    await producer.send({
      topic: topic,
      messages: Array(message)
    })
    await producer.disconnect()
  }

  sendMessage(message);
  res.sendStatus(200);

});

app.post('/createTopic', (req, res) => {
  console.log('got request for post create topic');
  var message ={};
  message.value=req.body.params;
  message.key=req.body.params.requestId;
  console.log('creating topic', message);

  var sendMessage = async (message) => {
    await producer.connect()
    await producer.send({
      topic: 'create_resources_command',
      messages: Array(message)
    })
    await producer.disconnect();
  }

  sendMessage(message);
  res.send('Topic Created');

});
