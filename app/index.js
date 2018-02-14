const aws = require('aws-sdk');
const express = require('express');
const os = require('os');
const process = require('process');
const uuid = require('uuid');

const TABLE_NAME = 'quotes';
const DEFAULT_PORT = 8080;
const DEFAULT_REGION = 'us-east-1';

const app = express();
const documentClient = new aws.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || DEFAULT_REGION,
});

app.enable('trust proxy')
app.use(express.json())

app.use(function(req, res, next) {
  console.log(`[${req.ip}] ${req.method} ${req.path}`);
  next();
});

app.get('/quotes', function(req, res, next) {
  const params = {
    TableName: TABLE_NAME,
  };

  documentClient.scan(params).promise()
    .then((data) => res.json(data.Items))
    .catch(next);
});

app.put('/quotes', function(req, res, next) {
  if (!req.body.Text || !req.body.AttributedTo) {
    return res.status(400).json({Error: "Required fields: AttributedTo, Text"})
  }

  const id = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ID: id,
      AttributedTo: req.body.AttributedTo,
      Text: req.body.Text,
    },
  };

  documentClient.put(params).promise()
    .then((data) => res.redirect(201, `/quotes/${id}`))
    .catch(next);
});

app.get('/quotes/:id', function(req, res, next) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      ID: req.params.id,
    },
  };

  documentClient.get(params).promise()
    .then((data) => data.Item ? res.json(data.Item) : res.status(404).end())
    .catch(next);
});

app.get('/', function(req, res, next) {
  res.json({Hostname: os.hostname()});
});

//app.delete('/quotes/:id', function(req, res, next) {
//  const params  = {
//    TableName: TABLE_NAME,
//    Key: {
//      ID: req.params.id,
//    },
// };

//  documentClient.delete(params).promise()
//    .then((data) => res.status(200).end())
//    .catch(next);
//});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({Error: err.message}).end();
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

app.listen(process.env.PORT || DEFAULT_PORT);
