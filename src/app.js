const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const ejs = require('ejs');
const { newStrategy } = require('./controllers/passport');
const authRoutes = require('./routes/auth.route');
const fileRoutes = require('./routes/file.route');



const app = express();

//CORS
app.use(cors());

// setting
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'view'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// file statics
app.use(express.static(__dirname + '/public'))

//middleware
app.use(morgan('dev'));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
passport.use(newStrategy);

//routes
app.use(fileRoutes);
app.use(authRoutes);



module.exports = app;