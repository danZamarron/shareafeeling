require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const flash = require("connect-flash")
const { setLocals } = require("./middlewares")
const { formatDate } = require("./middlewares/helpers")


let dbUrl = process.env.MONGODB || 'mongodb://localhost/shareafeeling';
process.env.PORT = process.env.PORT || 3000;
process.env.SITE = process.env.SITE  || `http://localhost:3000`;

mongoose
  .connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash())

require('./configs/session')(app);
app.use(setLocals(app))

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
hbs.registerHelper("formatDate", formatDate)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Share a Feeling';


app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/feelings'));
app.use('/', require('./routes/comments'));
app.use('/', require('./routes/donations'));


module.exports = app;
