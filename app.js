
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500',
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', require('./routes/auth'));

app.use('/students', require('./routes/students'));
app.use('/teachers', require('./routes/teachers'));
app.use('/classes', require('./routes/classes'));
app.use('/grades', require('./routes/grades'));
app.use('/attendance', require('./routes/attendance'));

module.exports = app;
