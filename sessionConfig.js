
const session = require('express-session');

const sessionConfig = session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
});

module.exports = sessionConfig;
