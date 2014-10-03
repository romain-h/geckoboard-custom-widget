var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');
var chance = require('chance').Chance();

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Cors
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
 });

app.get('/', function(req, res) {
  res.json({message: 'ok'});
});

app.get('/bullet-graph', function(req, res) {
  var obj = JSON.parse(fs.readFileSync('data/bullet.json', 'utf8'));
  res.json(obj);
});

app.get('/funnel', function(req, res) {
  var i, items = [];

  // Generate 5 step value
  for(i=0;i<5;i++) {
    items.push({
      value: chance.floating({ min: 0, max: 20000 }),
      label: chance.word()
    });
  }

  var obj = {
    'item': _.sortBy(items, function(item) {
      return -item.value;
    }),
  };
  res.json(obj);
});

app.get('/geckometer', function(req, res) {
  var i, values = [];
  // Generate 5 step value
  for(i=0;i<3;i++) {
    values.push(chance.integer({ min: 0, max: 1000 }));
  }

  values.sort(function (a, b) {
    return a - b;
  });
  var label = chance.word();

  var obj = {
    'item': values[1],
    'min': {
      'value': values[0],
      'text': 'Min ' + label
    },
    'max': {
      'value': values[2],
      'text': 'Max ' + label
    }
  };

  res.json(obj);
});

app.get('/map', function(req, res) {
  var obj = JSON.parse(fs.readFileSync('data/map.json', 'utf8'));
  setTimeout(function() {
    res.json(obj);
  }, 4000);
});

app.get('/csv', function(req, res) {
  res.sendfile('data/csv.csv');
});

app.get('/number', function(req, res) {
  var obj = {
    'item': [
      { value: chance.floating({ min: 0, max: 1000 }) },
      { value: chance.floating({ min: 0, max: 1000 }) },
    ]
  };
  res.json(obj);
});

app.get('/text', function(req, res) {
  var obj = {
    "item": [
      {
        "text": chance.sentence({ words: 4 }),
        "type": chance.integer({ min: 0, max: 2 })
      }
    ]
  }
  // Fake network latency between 0 and 5sec
  setTimeout(function() {
    res.json(obj);
  }, chance.integer({ min: 0, min: 5000 }));
});

var server = app.listen(9001, function() {
    console.log('Rest server listening on port %d', server.address().port);
});
