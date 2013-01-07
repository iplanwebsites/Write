
var express = require('express')
  // Main App
  , app = express();

// Assets Path
app.use(express.static(__dirname + '/public/assets'));
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
// Let jade not print everything in a single line
app.locals.pretty = true;


// Parse POST Data
app.use(express.bodyParser());
// Parse Cookie Data
app.use(express.cookieParser());

// Launch Main App
var port = process.env.PORT || 8080;
app.listen(port);


// Redis

var redis = require("redis")
  , client = redis.createClient();


// Helpers
var generateId = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};


// Routes

app.get('/', function(req, res) {
  res.render('home');
});

// Tmp Favicon Fallback
app.get('/favicon.ico', function(req, res) {
  
});

// Get Writeup

app.get('/:key', function(req, res) {
  var key = req.params.key;

  client.hget('writeup:'+key, 'content', function(err, reply) {
    var data = {key: key, content: reply};

    res.render('home', data);
  });
  
});

// Save Writeup

app.post('/writeup', function(req, res) {
  // Storing in Redis Hashes

  // SADD writeup:key:*
  // HSET writeup:_key_ content '...'
  // HSET writeup:_key_ created_at '...'

  var key = generateId();
  var content = req.body.content
    , created_at = Date.now();

  client.sadd('writeup:key', key);
  client.hset('writeup:'+key, 'content', content);
  client.hset('writeup:'+key, 'created_at', created_at);

  res.json({key: key});
});

// Update Writeup

app.post('/writeup/:key', function(req, res) {
  var key = req.params.key;
  var content = req.body.content
    , modified_at = Date.now();

  client.sadd('writeup:key', key);
  client.hset('writeup:'+key, 'content', content);
  client.hset('writeup:'+key, 'modified_at', modified_at);

  res.json({status: 'success'});
});