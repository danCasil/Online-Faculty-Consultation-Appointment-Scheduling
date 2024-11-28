const { Pool } = require('pg');
require('dotenv').config();

const pool =new Pool({
 connectionString: process.env.DATABASE_URL_ONLINE,
 //Online
 ssl: {rejectUnauthorized: false}
 //Ofline
    // ssl:false
});

module.exports = pool;