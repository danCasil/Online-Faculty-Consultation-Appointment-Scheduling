const { Pool } = require('pg');
require('dotenv').config();

const pool =new Pool({
 connectionString: process.env.DATABASE_URL_TEST,

 //ssl: {rejectUnauthorized: false}

     ssl:false
});

module.exports = pool;