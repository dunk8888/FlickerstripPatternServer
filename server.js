var bodyParser = require('body-parser');
var db = require("./db.js");
var app = require('express')();
var session = require('express-session');
var auth = require("./authentication.js");
var credentials = require("./credentials.js");

//This saves the raw body of the incoming request into a separate variable (see: http://stackoverflow.com/questions/18710225/node-js-get-raw-request-body-using-express)
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(session({secret: credentials.sessionSecret}));
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));

app.use(function(req,res,next) {
    res.setHeader("Access-Control-Allow-Origin",process.env.DEBUG == 1 ? "http://localhost:4000" : "http://flickerstrip.com");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

function jsonTransform(key,value) {
    var omit = ["passwordHash"];
    if (omit.indexOf(key) != -1) return undefined;

    return value;
}

app.set('json replacer', jsonTransform);
app.use('/user', require('./userController.js'));
app.use('/pattern', require('./patternController.js'));

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening on port: %s', port);
});

