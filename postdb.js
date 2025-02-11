const { Pool } = require('pg');
require('dotenv').config();
try{
const pool =new Pool({
 connectionString: process.env.DATABASE_URL_TEST,

 //ssl: {rejectUnauthorized: false}

    ssl:false
});}catch{
    console.log("maymali");
}

module.exports = pool;