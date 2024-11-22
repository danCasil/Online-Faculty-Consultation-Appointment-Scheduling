const bcrypt = require("bcryptjs");
/*const pool = require('./postdb');
function queryDatabase(query, params = []) { 
  return new Promise((resolve, reject) => {
      pool.query(query, params, (err, res) => { 
          if (err) { 
          return reject(err);
          } 
          resolve(res.rows); }); 
      });
  } 
*/

async function encryptThis(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
async function verifyThis(plainPassword, hashedPassword) { 
const match = await bcrypt.compare(plainPassword, hashedPassword);
console.log( match);
return match;
    }


/*
    async function encryptALL() {
  const result=await queryDatabase("SELECT password,id_number FROM info")
  result.forEach(async account => {
    const newpass= await encryptThis(account.password);
    
    await queryDatabase("UPDATE info set password=$1 where id_number=$2",[newpass,account.id_number])
  });

}
encryptALL()
 */
module.exports = {encryptThis, verifyThis};