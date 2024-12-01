const express = require("express")
const route = express.Router()
const db = require('../postdb');
const {encryptThis, verifyThis}= require("../encryptor.js");
require('dotenv').config();
function queryDatabase(query, params = []) { 
    return new Promise((resolve, reject) => {
         db.query(query, params, (err, res) => { 
            if (err) { 
            return reject(err);
            } 
            resolve(res.rows); }); 
        });
     } 

const authenticate = (req, res, next) => {
    if(req.session.user_id){
        console.log(req.session.user_id)
        next()
    }else{
        res.redirect('/')
    }
}
const authenticateDean = (req, res, next) => {
    if(req.session.user_id){
        console.log(req.session.user_id)
        next()
    }else{
        res.redirect('/secret')
    }
}
const checkLogSession = (req, res, next) => {
    if(req.session.user_id){
        console.log(req.session.user_id)
        res.redirect("/home")
    }else{
        if(req.session){
            req.session.destroy()
        }
       next()
    }
}

route.get("/",checkLogSession, (req, res)=>{
    res.send("UNDERMAINTENANCE")
    //res.render("login")
})

//start development
const test=(req,res,next)=>{
    req.session.user_id='54321'
   req.session.role='faculty'
     req.session.college='0'
   next()
  }
  const test2=(req,res,next)=>{
    req.session.user_id='21-01298'
    req.session.role='Bachelor of Science in Information Technology'
     req.session.college='0'
   next()
  }
  const deanTest=(req, res,next)=>{
    req.session.college='CCSICT'
    req.session.user_id='54321'
    next()
}
  route.get("/test/login/s",test2, (req,res)=>{
    res.redirect('/home')
  })
  route.get("/test/login/f",test, (req,res)=>{
    res.redirect('/home')
  })
  route.get("/test/login/d",deanTest, (req,res)=>{
    res.redirect('/home/dean')
  })
route.get( "/creator/login/:id",(req, res)=>{

    const id=req.params.id
    if(id==process.env.DB_Pass) {
        req.session.creatorID='Master'
        res.redirect("/creator")
    }
})
route.get( "/creator",(req, res)=>{
        if(req.session.creatorID=='Master'){
        res.render("table")}else{
            res.send("cannot get")
        }
})
const path = require('path');
route.get('/download', (req, res) => { 
    const filePath = path.join(__dirname, '../databaseSQLite/schedulerData.db'); 
    res.download(filePath, 'schedulerData.db', (err) => { 
        if (err) { console.error('Error downloading file:', err); 
            res.status(500).send('Error downloading file'); }
         });
});

route.get( "/creator/logout",(req, res)=>{
    req.session.destroy()
    res.redirect('/creator')
})
//end of development


route.get("/home",authenticate, (req, res)=>{
   
  const id=req.session.user_id
    const date=req.session.userlogindate
    const role=req.session.role
    res.render("home",{id,date,role})
})

route.get( "/change",authenticate,(req, res)=>{
 
    const id=req.session.user_id
    res.render("change_sched")
})
route.get( "/faculty/reg",(req, res)=>{
    res.render("reg",{role:'faculty'})
})

route.get( "/student/reg",(req, res)=>{
    res.render("reg",{role:'student'})
})
route.get('/secure/:id',async (req, res)=>{
    const status=await encryptThis('change')
res.redirect(`/resetPass?type=change&secret=${status}`)
})
const transporter = require('../emailConfig');
route.get('/forgot',async (req, res)=>{
    const id=req.query.id
    const url=req.query.url
    const secret=await encryptThis('reset')
    console.log(id)
const target=await queryDatabase(`SELECT email FROM info WHERE id_number='${id}'`)
const link=url+"resetPass?id="+id+"&type=reset&secret="+secret
if(target&&target.length>0){
    console.log(target[0].email)
    const mailOptions = {
        to: target[0].email,
        from: 'OFCAS <ofcas.system@gmail.com>',
        subject: 'Password Recovery',
       html: ` <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Password Reset</title> </head> <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;"> <h2>Password Recovery</h2> <p>It looks like you've requested to reset your password. Click the link below to reset it:</p> <a href="${link}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"> Reset Password </a> <p>If you didn't request a password reset, please ignore this email.</p> </body> </html> `
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error(err);
            res.json( { errorMessage: 'Error sending email.' });
        }
    res.json("success")    
})

  
}else{
res.json("Invalid ID")    
}

})
route.get("/resetPass",async (req, res)=>{
const id=req.query.id
const secret=req.query.secret
const type=req.query.type
   if(req.session.user_id){
    req.session.userPass=req.session.user_id
   }else{
    req.session.userPass=id
   }
   var tok 
   if(type=="change"){
   tok=true
   }else{   
    tok=false
   }
  
   res.render('reset',{secretToken:secret,changepass:tok})
   
 
})


route.get( "/notification",authenticate,(req, res)=>{

    const id=req.session.user_id
    res.render("notification",{id})
})
route.get("/secret",(req, res)=>{
    res.render("DeanLogin")
})

route.get("/home/dean",authenticateDean,(req, res)=>{
    res.render("DeanHome")
})
route.get('/dean_logout',(req,res)=>{
    req.session.destroy()
    
    res.json({logout:true})
})
route.get("/getfaculty",async(req, res)=>{
    const college=req.session.college
    /**SELECT DISTINCT info.id_number, info.first,info.mid,info.last, record.used_time,record.type FROM info JOIN record ON info.id_number = record.id_number WHERE college= */
    try{
    const result = await queryDatabase('SELECT id_number,first,mid,last,college FROM info WHERE college=$1',[college])
    res.json({result})
   }catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
}
  
})
route.get('/logout',(req, res)=>{
    req.session.destroy()
    res.redirect('/')
})
route.get('/check/id_number/:id',async (req, res)=>{
    const id=req.params.id
    const available_id=await queryDatabase("SELECT id_number FROM info WHERE id_number=$1;",[id])
    var timeLength=0
    const id_num=available_id.length
    if(id_num==1){
    let table
    if(req.session.role=='student'){
    table="facultytime"
    }else{
    table="studenttime"
    }

   const  available_time=await queryDatabase("SELECT * FROM "+table+" WHERE id=$1;",[id])
   timeLength=available_time.length
}

    res.json({idL:id_num,timeL:timeLength})
})

module.exports = route
