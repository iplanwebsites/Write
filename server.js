
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


// Routes

app.get('/', function(req, res) {
  res.render('home');
});