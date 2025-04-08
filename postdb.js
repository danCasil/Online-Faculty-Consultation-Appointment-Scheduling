const { Pool } = require('pg');
require('dotenv').config();

const pool =new Pool({
//  connectionString: process.env.DATABASE_URL_ONLINE,

// ssl: {rejectUnauthorized: false}

connectionString: process.env.DATABASE_URL_TEST,
 ssl:false
});

module.exports = pool;