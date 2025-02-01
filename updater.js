const pool = require('./postdb');
function queryDatabase(query, params = []) { 
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, res) => { 
            if (err) { 
            return reject(err);
            } 
            resolve(res.rows); }); 
        });
    }
async function updater(){
    const terminatordata=await queryDatabase("SELECT * FROM terminator")
    if(terminatordata.length>0){
        terminatordata.forEach(async data => {
            if(new Date()>new Date(data.exptime)){
              try{
                 await queryDatabase("DELETE FROM terminator WHERE expid=$1",[data.expid])
                 console.log(`this data with this id${data.expid}   `)
                }catch{
                    console.log("Already Updated")
              }
            }
        });
       
    }
  
}
module.exports = {updater};