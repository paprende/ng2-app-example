'use strict';

const express = require('express');
const app = require('express-ws-routes')();

let instances = require('./data/instances').instances;
let getRandomInstanceData = require('./data/instances').getRandomInstanceData;
let traffic = require('./data/traffic');
const bodyParser = require('body-parser')

const timeouts = {};

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.websocket('/api/ws/instances', (info, cb, next) => {

  console.log(
    'ws req from %s using origin %s',
    info.req.originalUrl || info.req.url,
    info.origin
  );

  cb((socket) => {
    setInterval(() => {
      const states = instances.map((i) => ({ name: i.name, state: i.state }));
      socket.send(JSON.stringify(states), (err) => {});
    }, 3000);
  })

});

app.get('/api/instances', (req, res) => {
  res.send(instances);
});

app.post('/api/instances/*/status', (req, res) => {
  const result = instances.find((i) => i.name === req.params[0]);

  result.state = req.body.state;
  if (req.body.state === 'starting') {
    timeouts[result.name] = setTimeout(() => {
      result.state = 'running';
      delete timeouts[result.name];
    }, Math.floor(Math.random() * 8) * 1000);
  } else if (req.body.state === 'stopped') {
    clearTimeout(timeouts[result.name]);
  }

  res.sendStatus(200);
});

app.post('/api/instances/*', (req, res) => {
  debugger;
  const newInstance = Object.assign({}, getRandomInstanceData(1)[0], req.body);
  instances = instances.concat(newInstance);
  setTimeout(() => {
    res.send(newInstance);
  }, 2000);
});

app.put('/api/instances/*', (req, res) => {
  debugger;
  instances = instances.map((i) => {
    if (i.name === req.params[0]) {
      return Object.assign({}, i, req.body);
    }
    return i;
  });
  setTimeout(() => res.sendStatus(200), 2000);
});

app.delete('/api/instances/*', (req, res) => {
  instances = instances.filter((i) => i.name !== req.params[0]);
  setTimeout(() => res.sendStatus(200), 2000);
});

app.get('/api/traffic', (req, res) => {
  res.send(traffic);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
