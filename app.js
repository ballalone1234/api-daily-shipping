const createError = require('http-errors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('yaml');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
require("dotenv").config({ path: ".env." + env });

console.log('Environment:', process.env.NODE_ENV);
console.log('API Version:', process.env.API_VERSION);

const swaggerSpec = yaml.parse(fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8'));

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "daily-shipping-judgement API",
  customfavIcon: "/favicon.ico",
};

const corsOptions = {
  origin: "*",
  credentials: true,
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(corsOptions));

const indexRoute = require('./routes/index');
const webRoute = require('./routes/web_route');

app.get('/', (req, res) => {
  res.send({ message: 'daily-shipping-judgement API V' + process.env.API_VERSION });
});

app.use('/daily-shipping-judgement/', indexRoute);
app.use('/daily-shipping-judgement/web', webRoute);
app.use('/daily-shipping-judgement/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.status = err.status || 500;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;