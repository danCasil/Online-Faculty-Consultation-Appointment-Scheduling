const express = require("express")
const route = express.Router()
const db = require('../postdb');
const transporter = require("../emailConfig.js");
const { commitAndPush } = require('../gitPusher.js');
function queryDatabase(query, params = []) { 
    return new Promise((resolve, reject) => {
         db.query(query, params, (err, res) => { 
            if (err) { 
            return reject(err);
            } 
            resolve(res.rows); });  
        });
     } 
function formatDate(dateString) {
    const date = new Date(dateString);

    // Options for formatting the date
    const options = { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
    };

    // Convert to a readable format
    return date.toLocaleDateString('en-US', options);
}

route.patch("/update/notification",async (req,res)=>{
    const id=req.query.id
    const notif_stat='new'
    try { 
        const stats = await queryDatabase("SELECT status FROM notif WHERE notif_id=$1",[id]);
        if(stats[0].status==notif_stat){
         await queryDatabase("UPDATE notif SET status='old' WHERE notif_id=$1",[id]);
         commitAndPush()
         res.json({update:"updated"}); 
         }else{
         res.json({update:"not updated"})
         }
     } catch (err) { 
         console.error('Failed to fetch records:', err);
         res.status(500).json({ error: 'Failed to fetch records' }); 
     }
})
route.patch("/update/record",async(req,res)=>{

    const type=req.query.type
   const bd=req.query.data
   const data=JSON.parse(bd)
    const date=new Date()
console.log(type)
console.table(data)
let learn,teach
console.log(req.session.role)
if(data.scheduler_role=='student'){
    learn=data.nagsched
    teach=data.nasched
}else{
    teach=data.nagsched
    learn=data.nasched
}
 if(type=='consulted'){
    try { // Delete the entry 
        await queryDatabase("INSERT INTO record(id_number, exc_date, type, learner_id,sched_id) VALUES ($1,$2,$3,$4,$5)",[teach,date,'consulted',learn,data.sched_id]);
        await queryDatabase("UPDATE sched SET remark='finished' WHERE sched_id=$1",[data.sched_id]);
        mailSendNotif(data,'finish',req)
        commitAndPush()
        res.json({success:true})
         } catch (err) {  
            console.error('Failed to fetch records:', err);
             res.status(500).json({ error: 'Failed to fetch records' }); 
            }
 }

})
route.patch("/update/remove_notif", async(req,res)=>{
    const id=req.query.id
    try{
    await queryDatabase("DELETE FROM notif WHERE notif_id=$1",[id])
    commitAndPush()
    res.json({status:`success`})
    }catch (err) {  
        console.error('Failed to fetch records:', err);
         res.status(500).json({ error: 'Failed to fetch records' }); 
    }
})

route.patch('/vote',async(req,res)=>{
    const voted=req.query.voted
    const voter=req.session.user_id
    const vote=req.query.vote   
    try{
        await queryDatabase("INSERT INTO pool (voter_id, voted_id, vote) VALUES ($1,$2,$3)", [voter, voted, vote])
        poolCheck(voted,res)
        commitAndPush()
        }catch (err) {  
            console.error('Failed to fetch records:', err);
             res.status(500).json({ error: 'Failed to fetch records' }); 
        }
 
})
async function poolCheck(voted,res) {
try{
   const Result1= await queryDatabase(`SELECT voted_id FROM pool WHERE voted_id='${voted}' AND vote='y'`)
   
    const Result2= await queryDatabase(`SELECT * FROM dean_list WHERE id_number='${voted}'`)
    if(Result2&&Result2.length==0){
    
        if(Result1&&Result1.length>=8){
            await queryDatabase(`INSERT INTO dean_list(id_number) VALUES ($1)`,[voted])
            await queryDatabase(`DELETE FROM pool WHERE voted_id=$1`, [voted])   
            await queryDatabase(`DELETE FROM notif WHERE notif_text=$1`, [voted])
            commitAndPush()
            res.status(200).json({ msg: "success" });
            }
            
    }else{
        await queryDatabase(`DELETE FROM pool WHERE voted_id=$1`, [voted]) 
        
        await queryDatabase(`DELETE FROM notif WHERE notif_text=$1`, [voted])
        commitAndPush()
        res.status(200).json({ msg: "success" });
  
        
    }
    }catch (err) {  
    console.error('Failed to fetch records:', err);
     res.status(500).json({ error: 'Failed to fetch records' }); 
}
}

//editted
route.patch("/update/schedule/accept",async(req,res)=>{
    const id=req.query.id
   try {
    await queryDatabase("UPDATE sched SET remark='accepted' WHERE sched_id=$1",[id])
    commitAndPush()
    const schedResult=await queryDatabase("SELECT * FROM sched WHERE sched_id=$1",[id])
            const data={
            nagsched:schedResult[0].nasched,
            nasched:schedResult[0].nagsched,
            scheduler_role:schedResult[0].scheduler_role,
            timein:formatTime(schedResult[0].time_in),
            timeout:formatTime(schedResult[0].time_out),
            date:schedResult[0].date
        }
   
        mailSendNotif(data,'accepted',req)
        acceptNotification(id)
        res.json({status:true}) 
    }catch(err) {  
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
        }  
})
route.patch(`/update/cancel`,async(req,res)=>{
    const type=req.query.type
    const bd=req.query.data
    const data=JSON.parse(bd)
     const date=new Date()
 console.log(type)
 console.table(data)
 let learn,teach
 console.log(req.session.role)
 if(data.scheduler_role=='student'){
     learn=data.scheduler
     teach=data.scheduled
 }else{
     teach=data.scheduler
     learn=data.scheduled
 }
  if(req.session.role=='faculty'){
 
  try{
    await queryDatabase("INSERT INTO record(id_number, exc_date, type, learner_id,sched_id) VALUES ($1,$2,$3,$4,$5)",[teach,date,'cancelled',learn,data.id])
    commitAndPush()
  }catch (err) {  
        console.error('Failed to fetch records:', err);
         res.status(500).json({ error: 'Failed to fetch records' }); 
    }
  }
  try{
   await queryDatabase("UPDATE sched SET remark='cancelled' WHERE sched_id=$1",[data.id])
   commitAndPush()
  }
  catch (err) {  
    console.error('Failed to fetch records:', err);
     res.status(500).json({ error: 'Failed to fetch records' }); 
}
  const datas={
    nagsched:data.scheduled,
    nasched:data.scheduler,
    scheduler_role:data.scheduler_role,
    timein:data.timeIn,
    timeout:data.timeOut,
    date:data.schedDate
}

  mailSendNotif(datas,'cancelled',req)
    res.json({success:true})
})
function formatTime(time) { 
    const [hours, minutes, seconds] = time.split(':'); const period = hours >= 12 ? 'PM' : 'AM';
     const formattedHours = hours % 12 || 12; 
     return `${formattedHours}:${minutes} ${period}`; 
    }
//edited
async function acceptNotification(id){
try{
    const result=await queryDatabase("SELECT * FROM sched WHERE sched_id=$1",[id])
    const R=result[0]
    const now=new Date() 
    var txt=`Accepted the scheduled time from ${formatTime(R.time_in)} to ${formatTime(R.time_out)} on ${formatDate(R.date)}`
    await queryDatabase("INSERT INTO notif(sender_id, receiver_id, notif_text, dateandtime, status, type) VALUES ($1,$2,$3,$4,$5,$6)",[R.nasched,R.nagsched,txt,now,'new','accepted'])
    commitAndPush()
   }catch (err) {  
    console.error('Failed to fetch records:', err);
     res.status(500).json({ error: 'Failed to fetch records' }); 
}
}   



async function mailSendNotif(data,txt,req){
    let mailtxt,subj
    try { 
        const Name = await queryDatabase("SELECT last, first FROM info WHERE id_number=$1",[data.nagsched]);
        const Email = await queryDatabase("SELECT email FROM info WHERE id_number=$1",[data.nasched]);
        const currentTime = new Date();
         let greet; 
         const morningStart = new Date(); morningStart.setHours(6, 0, 0); 
        const afternoonStart = new Date(); afternoonStart.setHours(12, 0, 0); 
        const eveningStart = new Date(); eveningStart.setHours(18, 0, 0);
        if (currentTime >= morningStart && currentTime < afternoonStart) { greet = "Good Morning!"; } else if (currentTime >= afternoonStart && currentTime < eveningStart) { greet = "Good Afternoon!"; } else { greet = "Good Evening!"; }

        if(txt=='finish'&&data.scheduler_role=='student'){
            subj=`Consultation Confirmation`
            mailtxt=`${greet} , We are here to inform you that ${Name[0].last}, ${Name[0].first} has Confirmed that you have successfully completed the scheduled consultation.`
        }else if(txt=='finish'&&data.scheduler_role=='faculty'){
             subj=`Consultation Confirmation`
            mailtxt=`${greet} , We are here to inform you that ${Name[0].last}, ${Name[0].first} has Confirmed that you have  completed the scheduled time.`
        }else if(txt=='accepted'){

            subj=`Schedule Accepted`
            mailtxt=`${greet} , We are here to inform you that ${Name[0].last}, ${Name[0].first} has Accepted your scheduled time from ${data.timein} to ${data.timeout} on ${formatThis(data.date)}` 
        }else if(txt=='declined'){
            subj=`Schedule Declined`
            mailtxt=`${greet} , We are here to inform you that ${Name[0].last}, ${Name[0].first} has Confirmed that you have  completed the scheduled time.` 
        }else{
            subj=`Schedule Cancelled`
           mailtxt=`${greet} , We are here to inform you that ${Name[0].last}, ${Name[0].first} has Cancelled your scheduled time on ${formatThis(data.date)}`
        }
        
        const mailOptions = {
            to: Email[0].email,
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
        })
     } catch (err) { 
         console.error('Failed to fetch records:', err);
         res.status(500).json({ error: 'Failed to fetch records' }); 
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