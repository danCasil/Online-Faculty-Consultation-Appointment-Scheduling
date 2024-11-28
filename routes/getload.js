const express = require("express")
const route = express.Router()
const db = require('../postdb');

const transporter = require("../emailConfig.js");
const { commitAndPush } = require('../gitPusher.js');
let pg_role;
function queryDatabase(query, params = []) { 
    return new Promise((resolve, reject) => {
         db.query(query, params, (err, res) => { 
            if (err) { 
            return reject(err);
            } 
            resolve(res.rows); }); 
        });
     } 
  
  

  
route.get("/load/pg_role",async (req, res,)=>{
    const id=req.session.user_id
   const username= await queryDatabase("SELECT id_number, first, last, (first || ' ' || last) AS fullname FROM info where id_number='"+id+"';")
    if(req.session.role=='faculty'){
        res.json({role:'faculty',name:username[0].fullname,id:username[0].id_number})  
    }else{
        req.session.role='student'
        res.json({role:'student',name:username[0].fullname,id:username[0].id_number})  
    }
  
})
route.get('/load/new_notification',async(req,res)=>{
const id=req.session.user_id
try{
const result=await queryDatabase("SELECT COUNT(status) AS new_notif FROM notif WHERE status='new'AND receiver_id=$1",[id])

    res.json({result})
}catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
}
})

//for development
route.get('/get/all/user',async(req,res)=>{
    try{
        const result=await queryDatabase("SELECT * FROM info")
            res.json({raw:result})
        }catch (err) { 
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' }); 
        }
})
route.get('/deleteThisUser/:id',async (req,res)=>{
    const id=req.params.id
    try{
        await queryDatabase("DELETE FROM info WHERE id_number=$1",[id])
        commitAndPush()
        res.json(true)
        }catch (err) { 
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' }); 
        }
})
//end of development

route.get('/load/notification',(req, res)=>{
    const id=req.session.user_id
    notif_data(id, async(err, result) => {
    if (err) {
    console.error(err);
    res.status(500).send('Database error');
    return;
    }
    try{
         const poolresult=await queryDatabase('SELECT voter_id,voted_id FROM pool WHERE voter_id=$1',[req.session.user_id])
    if(poolresult&&poolresult.length==0) {
       const SYSTEMnotif=await queryDatabase("SELECT notif.*,info.last,info.mid,info.first,info.college,notif.notif_text FROM notif JOIN info ON notif.notif_text=info.id_number WHERE sender_id='SYSTEM' AND receiver_id='alpha'AND info.college=$1 AND notif.notif_text!=$2",[req.session.college,req.session.user_id])
        res.json({result,SYSTEMnotif })
    }else
   { 
    res.json({result})
}

    }catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }
    })
})
route.get("/load/schedule",(req, res)=>{
    if(req.session.role!='faculty'){
        req.session.role='student'
    }
    const id=req.session.user_id
    pg_role=req.session.role

    user_sched(id,async(err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
       
     try{  
    const rec_id=await queryDatabase("SELECT record_id FROM record WHERE id_number=$1 AND type='consulted'",[id])
    res.json({result,pg_role,rec_id,id})
    }catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
    }
})
})
route.get("/load/declineSched",async(req, res)=>{
    const rawdata=req.query.data
    const data=JSON.parse(rawdata)
    const {id,scheduler,scheduled,timeIn,timeOut,schedDate}=data
   

   console.table(data)
        if(req.session.role=='faculty'){
     
         try { 
            const pur=await queryDatabase("SELECT purpose FROM sched WHERE sched_id=$1",[id])
             await queryDatabase("INSERT INTO record(id_number,  exc_date, type, learner_id,consulted_date,consulted_time_in,consulted_time_out,consultation_purpose) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",[scheduled,new Date(),'declined',scheduler,schedDate,timeIn,timeOut,pur[0].purpose])
             await queryDatabase("UPDATE sched SET remark='declined' WHERE sched_id=$1",[id])
             commitAndPush()
             notif(data,'declined',req)
            }catch (err) { 
                console.error('Failed to fetch records:', err);
                res.status(500).json({ error: 'Failed to fetch records' }); 
            }
}else{
   try{ 
    await queryDatabase("UPDATE sched SET remark='declined' WHERE sched_id=$1",[id])
    commitAndPush()
    notif(data,'declined',req)
    }catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
    }
}

})
route.get("/load/checkConflict",async(req,res)=>{
    const tin=req.query.tin
    const tout=req.query.tout
    const day=req.query.Day
    const user_id=req.session.user_id
let table
    if(req.session.role=='faculty'){
table='facultytime'
    }else{
table='studenttime'
    }
    console.log(tin+""+tout)
    console.log(`SELECT FROM ${table} WHERE id = ${user_id} AND day = ${day} AND ((timein <= ${tout} AND timeout >= ${tin}) OR (timein <= ${tin} AND timeout >= ${tout}) OR (timein >= ${tin} AND timeout <= ${tout}) ) ; `)
      try { 
       const result=await queryDatabase(` SELECT  timein,timeout FROM ${table} WHERE id = $1 AND day = $2 
         ; `, [user_id, day])
       console.table(result)
         // Conflict found 
        res.json({ datas:result});
    
    }catch (err) { 
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' }); 
        }
    
})

route.get("/load/change_sched",async(req,res)=>{

 const userid=req.session.user_id
 
 if(req.session.role=='faculty'){
  try{
    const result=await queryDatabase("SELECT * FROM facultytime WHERE id = $1 ORDER BY timein asc;",[userid])
    
        res.json({msg:"es",result})
     }
     catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }
 }else{
   try{ 
    const result=await queryDatabase("SELECT * FROM studenttime WHERE id=$1 ORDER BY timein asc;",[userid])
    console.table(result)
    res.json({msg:"es",result})
    }
    catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
    }
 }
 
 
   
})
route.get("/load/record",async(req,res)=>{
const id=req.query.id

try{
    const record_type=await queryDatabase("SELECT type FROM record WHERE id_number=$1", [id]) 
  const user_data=await queryDatabase("SELECT last,first,mid,id_number FROM info WHERE id_number=$1",[id])
    const studentdata=await queryDatabase("SELECT info.last,info.first,info.mid,record.* FROM record JOIN  info ON record.learner_id=info.id_number  WHERE record.id_number=$1 ",[id])
    const counts = record_type.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + 1;
    return acc;
    }, { consulted: 0, cancelled: 0, declined: 0, missed: 0 });
    console.log(user_data)
    res.json({ msg: "eyy", counts,user_data,studentdata});
  }catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); }
})
route.get("/load/availabletime",async(req,res)=>{
    const information=JSON.parse(req.query.data)
const {date,month,day,target_id,year} = information
let target

target=target_id
console.log(target)
const targetdate=new Date(year, month, day)
let table
if(req.session.role!='faculty'){
table='facultytime'
}else{
    table='studenttime'
}

try{
    const result1=await queryDatabase("SELECT * FROM "+table+" WHERE id=$1 ORDER BY timein asc",[target])
    get_name(target,async(err, result2) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }      
    const formatdate=`${year}-${month+1}-${date}` 
    const result3=await queryDatabase("SELECT * FROM sched JOIN  "+table+" ON sched.time_in= "+table+".timein AND sched.time_out= "+table+".timeout WHERE (nasched=$1 OR nagsched=$2 )AND date=$3 AND remark='accepted' ",[target,target,formatdate])
        res.json({result1,result2,result3,month:month,date:date})  
    })
}catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }


})
route.get("/load/conflict", async(req,res)=>{
    const information=JSON.parse(req.query.data)
    const {date,month,timein,timeout,day,target_id,year} = information
    console.log(timein+" "+timeout)
     const formatdate=`${year}-${month+1}-${date}`
    try{
        const result4=await queryDatabase(`SELECT sched.*,info.last,info.first,info.mid FROM sched JOIN info ON info.id_number=sched.nasched WHERE nagsched=$1 AND date=$2 AND ( remark='accepted' OR remark='new') AND (( time_in >= '${timein}' AND time_in < '${timeout}' )OR (time_out >'${timein}'  AND time_out <='${timeout}') OR (time_in <= '${timein}' AND time_out >= '${timeout}'))`,[req.session.user_id,formatdate])
        console.table(result4)
        if(result4&&result4.length>0){
            const sched=result4
            console.table(sched)
            res.json({isConflict:true,sched})
        }else{
            res.json({isConflict:false})
        }
    }catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }
})

route.get("/load/create_suggestion",async(req,res)=>{
    const txt = req.query.target
    const lastChar = txt.charAt(txt.length - 1)
    const firstChar = txt.charAt(0)
   let course
    if(req.session.role=='faculty'){
course=`course != 'faculty'`
   }else{
    course=`course = 'faculty'`
   }
   
console.log(course)
    if (lastChar=='-'||!isNaN(firstChar)) {
    try{
        const results=await queryDatabase(`SELECT id_number, id_number, last, mid, first FROM info WHERE id_number LIKE '${txt}%' AND ${course}`)
 
        console.table(results)
        res.json({results,type:'id'})
    
    }catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }

}else{
    try{
        const results=await queryDatabase(`SELECT id_number, last, mid, first FROM info 
WHERE (first ILIKE '${txt}%' OR last ILIKE '${txt}%' OR CONCAT(last,', ', first) ILIKE '${txt}%' OR CONCAT(last, ' ,', first) ILIKE '${txt}%' OR CONCAT(last, ', ', first) ILIKE '${txt}%') 
AND ${course}`)
        console.table(results)
                res.json({results,type:'name'})
    }catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }
}
})
route.get("/load/graphdata", async (req, res) => {
    const dates=JSON.parse(req.query.dates)
    const college = 'CCSICT';
    let xValues = [];
    let yValues = [];
    console.log("SELECT COUNT(type) AS Count FROM record WHERE id_number = $1 AND type='consulted' AND(consulted_date>='"+dates.d1+"' AND consulted_date<='"+dates.d2+"')")
    try {
        const name_and_id = await queryDatabase("SELECT last, id_number,first FROM info WHERE college=$1 and course='faculty'", [college])
    console.log("dasdasdasdasdasd")
        for (const element of name_and_id) {
            const counts = await queryDatabase("SELECT COUNT(type) AS Count FROM record WHERE id_number = $1 AND type='consulted' AND(consulted_date>='"+dates.d1+"' AND consulted_date<='"+dates.d2+"');", [element.id_number]) 
            console.log(counts)
            xValues.push(element.last + ", " + element.first);
            const countTOINT=parseInt(counts[0].count)
            yValues.push(countTOINT);
        }

        console.table(xValues);
        console.table(yValues);
        res.json({ xValues: xValues, yValues: yValues,dates });
    }catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }
});
route.get("/filter/data", async (req,res)=>{
    const checkbox=req.query.checkbox;
    const {dec,can,con,mis,id}=JSON.parse(checkbox)
    let query = "SELECT record.*,info.first,info.last,info.mid FROM record JOIN info ON info.id_number=record.learner_id WHERE (1=1 AND record.id_number='"+id+"')";
    let conditions = [];
    if (dec) { 
        conditions.push("type = 'declined'"); }
     if (can) { 
        conditions.push("type = 'cancelled'"); }
     if (con) { 
        conditions.push("type = 'consulted'"); } 
    if (mis) { 
        conditions.push("type = 'missed'"); }

     if (conditions.length > 0) {
         query += " AND (" + conditions.join(" OR ") + ")"; }
     
        console.log(query);
    const filtered =await queryDatabase(query)
    console.table(filtered);
    res.json({filtered})
})
route.get("/load/available",async (req,res)=>{
     let id
    
        id=req.query.target_id
     let table
        if(req.session.role!='faculty'){
            table='facultytime'
            }else{
                table='studenttime'
            }
     const date=req.query.date
     const month=parseInt(req.query.month)+1
     
        const year=req.query.year
     const day=req.query.day
      const formatdate=`${year}-${month+1}-${date}`
     const targetdate=`${year}-${month}-${date}`
  
  try{ 
    
    const results=await queryDatabase("SELECT DISTINCT day FROM "+table+" WHERE id=$1 AND day=$2;",[id,day])
    const results2=await queryDatabase("SELECT indx FROM "+table+" WHERE id=$1 AND day=$2;",[id,day])
    const result3=await queryDatabase("SELECT * FROM sched JOIN "+table+" ON sched.time_in="+table+".timein AND sched.time_out="+table+".timeout  WHERE (nasched=$1 OR nagsched=$2) AND date=$3 AND remark='accepted'",[id,id,targetdate])

   
 
  if(results&&results.length==1&&(results2.length>result3.length)){
    console.log(`SELECT * FROM sched JOIN ${table} ON sched.time_in=${table}.timein AND sched.time_out=${table}.timeout  WHERE nasched='${id}' AND date='${targetdate}' AND remark='accepted'`)
    const slot=results2.length-result3.length
    console.table(results)
    console.table(result3)
    console.table(results2)
    console.log(""+slot+"Dasdasdkashdjk")
    res.json({status:true,result3,slot:slot})
  }else{
res.json({status:false})
    }
    }catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
}
})


async function user_sched(id,callback){
try{
        const A=await queryDatabase(`SELECT * FROM (SELECT info.first, info.last, sched.* FROM info JOIN sched ON info.id_number = sched.nagsched WHERE sched.nasched = '${id}'UNION SELECT info.first, info.last,  sched.* FROM info JOIN sched ON info.id_number = sched.nasched WHERE sched.nagsched = '${id}') AS combined_results ORDER BY date DESC;
`)
        callback(null, A);
 }catch (err) { 
    return callback(err);
}
}

async function notif_data(id,callback){
  try { 
    const userdata=await queryDatabase("SELECT notif.notif_id,info.first, info.last,notif.status, notif.dateandtime,notif.notif_text,notif.type FROM info JOIN notif ON info.id_number = notif.sender_id WHERE notif.receiver_id = $1 ORDER BY dateandtime DESC;", [id]) 
        console.table(userdata)
        callback(null, userdata);
 }catch (err) { 
    return callback(err);
    }
}
async function get_name(id,callback){
  try { 
  const userdata =await queryDatabase('SELECT first, last,mid FROM info WHERE id_number=$1;', [id])
callback(null, userdata);
}catch (err) { 
    return callback(err);
    }
}
async function notif(data,status,req){
    const {id,scheduler,scheduled,timeIn,timeOut,schedDate,txtmsg,scheduler_role}=data

    const datas={
        nagsched:scheduled,
        nasched:scheduler,
        scheduler_role:scheduler_role,
        timein:timeIn,
        timeout:timeOut,
        date:schedDate
    }
  const timedate= new Date();
    let msg
    if(status=='declined'){
       
type=`declined`
    }else if(status=='accepted'){
type=`accepted`
    }
    else if(status=='cancelled'){
type=`cancelled`
    }
    else{
type="notif"
    }
  try{ 
     await queryDatabase("INSERT INTO notif(sender_id, receiver_id, notif_text, dateandtime, status,type) VALUES ($1,$2,$3,$4,'new',$5) ",[scheduled,scheduler,txtmsg,timedate,type])
     commitAndPush()
        mailSendNotif(datas,'declined',req)
   }
    catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
    }
}

async function duplicheck(data,callback){
    console.table(data.id)
    try{switch(data.checking){
        case "idnum":
                const id_number=await queryDatabase("SELECT id_number FROM info WHERE id_number=$1",[data.id])
                if(id_number&&id_number.length>0){
                    callback(null, {duplicated:true});
                }else{
                    callback(null, {duplicated:false});
                }
     
            break;
        case "email":
                const email=await queryDatabase("SELECT email FROM info WHERE email=$1",[data.id])
                    if(email&&email.length>0){
                        callback(null, {duplicated:true});
                    }else{
                        callback(null, {duplicated:false});
                    }
        break;
        case "user":
            const user=await queryDatabase("SELECT username FROM info WHERE username=$1",[data.id])
                if(user&&user.length>0){
                    callback(null, {duplicated:true});
                }else{
                    callback(null, {duplicated:false});
                }
        break;
    } 
 }catch (err) { 
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' }); 
        return callback(err);
    }     
}
route.get('/load/checkduplicate',(req,res)=>{
const inValue=req.query.inputvalue
const check=req.query.checktype
const data={
    id:inValue,
    checking:check
}

    duplicheck(data,(err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }      

res.json({dupli:result.duplicated})


})

})


async function mailSendNotif(data,txt,req){
    let mailtxt,subj
 try{   
   const Name=await queryDatabase("SELECT last, first FROM info WHERE id_number=$1",[data.nagsched])
   const Email=await queryDatabase("SELECT email FROM info WHERE id_number=$1",[data.nasched])
        console.log(Email[0].email)
        console.table(Name)
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
            mailtxt=`${greet} , We are here to inform you that ${Name[0].last}, ${Name[0].first} has Declined your scheduled time from ${data.timein} to ${data.timeout} on ${formatThis(data.date)}` 
        }else{
            subj=`Schedule Cancelled`
            mailtxt=`${greet} , We are here to inform you that ${Name[0].last}, ${Name[0].first} has Cancelled your scheduled time from ${data.timein} to ${data.timeout} on ${formatThis(data.date)}` 
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
            
        
          
            res.json({success:true});
    
        })
    
    }catch (err) { 
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