// Babel ES6/JSX Compiler
require('babel-register');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');

var Sequelize = require('sequelize');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var pg = require('pg');

var app = express();

var conString = "postgres://postgres:123456@localhost:5432/storycreate";
var sequelize = new Sequelize(conString);


app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//passport
// require('./config/passport')(passport);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// var Navbar = require(path.join(__dirname, 'app/components/Navbar'));
// var Footer = require(path.join(__dirname, 'app/components/Footer'));

//routing
// var viewPath = path.join(__dirname, 'views');
// app.get('/write', function (req, res) {
//     var navbarHtml = ReactDOM.renderToString(React.createElement(Navbar.default));
//     var footerHtml = ReactDOM.renderToString(React.createElement(Footer.default));
//     var writePage = swig.renderFile('views/write.html', { navbar: navbarHtml, footer: footerHtml});
//     res.status(200).send(writePage);
// });

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    // } else if (req.url == '/write') {
    //   console.log(Router.RoutingContext);
    //   var navbarHtml = ReactDOM.renderToString(React.createElement(Navbar.default));
    //   var footerHtml = ReactDOM.renderToString(React.createElement(Footer.default));
    //   var writePage = swig.renderFile('views/write.html', { navbar: navbarHtml, footer: footerHtml});
    //   res.status(200).send(writePage);
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
