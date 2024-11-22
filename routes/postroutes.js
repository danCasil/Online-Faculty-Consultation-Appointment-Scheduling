    const express = require("express")
    const route = express.Router()
    const pool = require('../postdb');
    const transporter = require('../emailConfig');
    const { commitAndPush } = require('../gitPusher.js');
    const {encryptThis, verifyThis}= require("../encryptor.js");

    function queryDatabase(query, params = []) { 
        return new Promise((resolve, reject) => {
            pool.query(query, params, (err, res) => { 
                if (err) { 
                return reject(err);
                } 
                resolve(res.rows); }); 
            });
        } 

route.get("/RemoveThis",async(req, res,)=>{
    const index=req.query.id
    const role =req.session.role
    let userRole
    if (role=='faculty') {
        userRole='facultytime'
    }else{
        userRole='studenttime'
    }
    try { 
        await queryDatabase('DELETE FROM ' + userRole + ' WHERE indx = $1', [index]);
        commitAndPush()
        res.json({ status: true }); 
    } catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }
})

route.post("/resetTHIS",async (req, res)=>{
    const {old,pass,secure,stat}= req.body
    const newpass=await encryptThis(pass)

    console.log(newpass)
const id=req.session.userPass
    if(await verifyThis('change',secure)){
        
        const result=await queryDatabase(`SELECT password FROM info WHERE id_number='${id}'`)
      
        if(result&&result.length>0)
            {  
        console.log(result[0].password)
        const oldpass=result[0].password
        const verify=await verifyThis(old,oldpass)
       if(verify){
           await queryDatabase("UPDATE info set password=$1 WHERE id_number=$2",[newpass,id])
           res.json({ status: true })
       }else{
          res.json({ status: false })
       }
    }
}else if(await verifyThis('reset',secure)){
    console.log("nadasd"+id)
  try{ 
await queryDatabase("UPDATE info set password=$1 WHERE id_number=$2",[newpass,id])
    res.json({ status: true })
}catch{
        res.json({ status: false })
    }
}else{
    res.json('failed')
}
})

route.get("/OTP",(req, res)=>{
    const OTP_params=req.query.OTP_STATUS
    let mailtxt
    let subj
    let OTP_status
    let receipient
    if(OTP_params.length>7){
const OTP_data=JSON.parse(OTP_params)
        OTP_status=OTP_data.stat
        req.session.email=OTP_data.email
        console.table(OTP_data)
        req.session.otp_type='reg'
    }else{
        OTP_status=OTP_params
        
    }
    receipient=req.session.email



   let rawOTP
    if(OTP_status=='send'){
       
         rawOTP=generateOTP(6)
         const OTP = rawOTP.join('');
         console.log(OTP)
         if(OTP_params.length>7){
            mailtxt=`You are about to register for our Online Faculty Consultation Appointment Scheduling. To continue with the registration, please use the following One Time Pin (OTP): ${OTP}`
            subj='OFCAS - Registration OTP'
        }else{
            mailtxt=`For verification, please use the following One Time Pin (OTP): ${OTP}`
            subj='OFCAS - Login OTP'
        }
        const otplife=new Date()
        otplife.setMinutes(otplife.getMinutes() + 1);
        req.session.otpLifespan=otplife
        
          
             const mailOptions = {
            to: receipient,
            from: 'OFCAS <ofcas.system@gmail.com>',
            subject: subj,
            text:mailtxt
        };
        
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err);
                res.json( { errorMessage: 'Error sending email.' });
            }
            
            req.session.OTPnumber=OTP;
          
            res.json({success:true});

        }); }else{
            const OTP_LIFE=new Date(req.session.otpLifespan)
            console.log(OTP_LIFE>new Date())
            if(OTP_LIFE>new Date()){
                console.log("Cooldown")
                const currentTime = new Date();
                const remainingTime = Math.max(0, Math.round((OTP_LIFE - currentTime) / 1000)); // Remaining time in seconds
                res.json({success:false,msg:`Wait for ${remainingTime}`,seconds:remainingTime})
            }
        }   
})

function generateOTP(count) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * 9) + 1;
      numbers.push(randomNumber);
    }
    return numbers; 
  
  }

route.post("/OTP/Authenticate",async (req,res)=>{
    const {otp1,otp2,otp3,otp4,otp5,otp6}=req.body
    const OTP=otp1+''+otp2+''+otp3+''+otp4+''+otp5+''+otp6
    
   if(OTP==req.session.OTPnumber){
    if(req.session.otp_type){
        res.json({success:true,type:'reg'})
    }else{ 
        try { 
            const results=await queryDatabase(`SELECT id_number,course FROM info WHERE email=$1`,[req.session.email]);
            req.session.user_id=results[0].id_number;
            req.session.role=results[0].course;
            req.session.userlogindate=new Date()
            res.json({ status: true }); 
        } catch (err) { 
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' }); 
        }   
}
}else{
    res.json({success:false})
   }
})

route.post("/User_login", async(req, res)=>{
    const {id,pass}=req.body


try { 
    const results=await queryDatabase("SELECT username,password,id_number,college,course,email FROM info WHERE username=$1",[id]);
    if(results&&results.length>0){
       const checkPass=await verifyThis(pass,results[0].password)
        if(checkPass){
        req.session.email=results[0].email;
        req.session.college=results[0].college;
        res.json({success:true})}
    else{
          res.json('Invalid username or password');
    }
    }else{
        res.json("");
    }
} 
catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
}   




})

const deanTest=()=>{
    
}


route.post("/secret/login",async (req,res)=>{
    const {id,pass}=req.body

try { 

    const results=await queryDatabase("SELECT info.id_number,info.course,info.college,info.password FROM dean_list JOIN info ON dean_list.id_number=info.id_number WHERE username=$1",[id]);
   
    if(results&&results.length>0){
        const checkPass=await verifyThis(pass,results[0].password)
        if(checkPass){
        req.session.college= results[0].college;
        req.session.user_id=results[0].id_number;
        req.session.role=results[0].course;
       res.json({success:true})
     }
    } else {
      res.json('Invalid username or password');
    }
} catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
}  

})
route.post("/secret/reg",async (req,res)=>{
    const {id,pass}=req.body
try { 
    const results=await queryDatabase("SELECT id_number,password FROM info WHERE id_number=$1 AND password=$2",[id,pass]);
    if(results&&results.length>0){
      const selectRes=await queryDatabase(`SELECT * FROM notif WHERE sender_id='SYSTEM' AND notif_text='${id}'`)
      if(selectRes&&selectRes.length>0){
        res.json('You already send a request please wait for others to confirm. Thank your for your Understanding');
    }else{
    queryDatabase("INSERT INTO notif( sender_id, receiver_id,notif_text,dateandtime, status, type) VALUES ($1,$2,$3,$4,$5,$6) ",['SYSTEM','alpha',id,new Date(),'new','reg'])
    res.json('You Successfully submit a request please wait for others to confirm. Thank your for your Understanding');
    commitAndPush()
     }
    }else {
        res.json('Invalid username or password');
      }
}
    catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
}  


})
route.post("/faculty/reg/new", async(req,res)=>{
const {userid,birthday,first,mid,last,email,pass,college,civil,gender,ninja_username}=req.body


const year='0',section='0',course="faculty"

try {  
    const hashedPass= await encryptThis(pass)
    await queryDatabase("INSERT INTO info (id_number,first,mid, last, course, year, section, birthday,email, college,username,password,gender,civil_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", [userid,first,mid,last,course,year,section,birthday,email,college,ninja_username,hashedPass,gender,civil]);
    commitAndPush()
     req.session.user_id=userid;
    req.session.role=course;
    req.session.userlogindate=new Date()
    res.json({ status: true }); 
     } catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' });
 }
})
route.post("/student/reg/new",async (req,res)=>{
    const {userid,birthday,section,course,year,first,mid,last,email,ninja_username,pass,civil,gender}=req.body
   const college='0'
   try {  
    const hashedPass= await encryptThis(pass)
    await queryDatabase("INSERT INTO info(id_number, first, mid, last, course, year, section, birthday,email, college,username,password,civil_status,gender) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",[userid,first,mid,last,course,year,section,birthday,email,college,ninja_username,hashedPass,civil,gender]);
    commitAndPush()
    req.session.user_id=userid;
    req.session.role=course;
    req.session.userlogindate=new Date()
       res.json({ status: true }); 
     } catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' });
 }
})

    


route.post("/notify", async(req, res)=>{
    const {R_id,msg}=req.body
    const S_id=req.session.user_id
    const Insertquery="INSERT INTO notif(sender_id, receiver_id, notif_text, dateandtime, status,type) VALUES ($1,$2,$3,$4,'new','notif') "
   
  const timedate= new Date()
    try {  
        await queryDatabase(Insertquery,[S_id,R_id,msg,timedate]);
        commitAndPush()
         res.json({ status: true }); 
         } catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
     }
})
route.post("/editSchedule",async(req,res)=>{
    let{timein,timeout,day}=req.body
    timein=timein+':00'
    timeout=timeout+':00'
    let id=req.session.user_id
if(req.session.role=='faculty'){
    try {  
        const result=await queryDatabase("INSERT INTO facultytime(id, timein, timeout, day) VALUES ($1,$2,$3,$4)",[id,timein,timeout,day]);
        commitAndPush()
         res.json({result}); 
         } catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
     }
}else{
      
        try {  
           const result= await queryDatabase("INSERT INTO studenttime(id, timein, timeout, day) VALUES ($1,$2,$3,$4)",[id,timein,timeout,day]);
           commitAndPush()
             res.json({result}); 
             } catch (err) { 
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
         }

    }
})

route.post("/createSchedule",async(req,res)=>{

    const{ScheduledID,PreferredDate,purpose,PreferredTin,PreferredTout,reSched}=req.body
    const scheduler_id=req.session.user_id
    const role=req.session.role
    const data={
        scheduler:scheduler_id,
        scheduled:ScheduledID,
        txtmsg:purpose
    }
if(reSched==''){
    try {  
        const result= await queryDatabase("SELECT sched_id FROM sched WHERE time_in=$1 AND time_out=$2 AND date=$3 AND nasched=$4 AND remark='new'",[PreferredTin,PreferredTout,PreferredDate,ScheduledID]);
        if(result&&result.length>0){
            res.json({status:false})
        }else{
    await queryDatabase("INSERT INTO sched(nagsched, nasched, time_in, time_out, date, remark,scheduler_role) VALUES ($1,$2,$3,$4,$5,'new','"+role+"')",[scheduler_id,ScheduledID,PreferredTin,PreferredTout,PreferredDate]);
    commitAndPush()
    notif(data,'new Sched')
    res.json({status:true}); 
        } 
    } catch (err) { 
         console.error('Failed to fetch records:', err);
         res.status(500).json({ error: 'Failed to fetch records' });
      }
}

else{
    try {  
       await queryDatabase(`UPDATE sched SET nagsched='${scheduler_id}',nasched='${ScheduledID}',time_in='${PreferredTin}',time_out='${PreferredTout}',date='${PreferredDate}',remark='new',scheduler_role='${req.session.role}'WHERE sched_id='${reSched}'`);
       commitAndPush()
          res.json({status:true}); 
          } catch (err) { 
         console.error('Failed to fetch records:', err);
         res.status(500).json({ error: 'Failed to fetch records' });
      }
}
})

async function  notif(data,status){
    const scheduler=data.scheduler
    const scheduled=data.scheduled
    const txtmsg=data.txtmsg

    const Insertquery="INSERT INTO notif(sender_id, receiver_id, notif_text, dateandtime, status,type) VALUES ($1,$2,$3,$4,'new',$5) "

    var inputDateTime = new Date();
    var year=inputDateTime.getFullYear()
    var day=inputDateTime.getDay()
    var month=inputDateTime.getMonth()+1
    var hour=inputDateTime.getHours()
    var minutes=inputDateTime.getMinutes()
  const timedate=new Date()
    let msg

    if(status=='declined'){
type=`declined`
    }else if(status=='accepted'){
type=`accepted`
    }
    else if(status=='cancelled'){
type=`cancelled`
    }else if(status=='new Sched'){
type="Schedule"
const name=await queryDatabase("SELECT first,last,mid,email FROM info WHERE id_number=$1",[scheduler])
const mailOptions = {
    to: name.email,
    from: 'OFCAS <ofcas.system@gmail.com>',
    subject: `New Schedule`,
    text:` Set by ${name.first} ${name.last} \n on ${formatThis(timedate)} \n Purpose:${txtmsg}`
};

await transporter.sendMail(mailOptions, (err) => {
    if (err) {
        console.error(err);
    }
});
    }
    else{
type="notif"
    }
    try {  
      await queryDatabase(Insertquery,[scheduler,scheduled,txtmsg,timedate,type]);
      commitAndPush()
          } catch (err) { 
         console.error('Failed to fetch records:', err);
      }
}

function formatThis(d){
    const originalDate = new Date(d); 
    const options = { 
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric' 
    }; 

   return  formattedDate = originalDate.toLocaleDateString('en-US', options);
}
module.exports = route
