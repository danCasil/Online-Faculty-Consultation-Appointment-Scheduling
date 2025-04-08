const express = require("express")
const route = express.Router()
const {updater} = require('../updater.js');
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
const authenticateSec = (req, res, next) => {
    if(req.session.user_id){
        console.log(req.session.user_id)
        next()
    }else{
        res.redirect('/')
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
    //res.send("UNDERMAINTENANCE")
    res.render("login")
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
    res.redirect('/home/sec')
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

route.get("/grouper",async(req, res)=>{
    updater()
    const id=req.session.user_id
    try {
        const role=await queryDatabase("SELECT course FROM info WHERE id_number=$1",[id])
     
    if(role[0].course=="secretary"){
        res.redirect("/home/sec")
    }else{
        res.redirect("/home")
    }
    }
    catch { 
        console.error("err")
    }
})   
route.get("/home",authenticate, (req, res)=>{
    updater()
  const id=req.session.user_id
    const date=req.session.userlogindate
    const role=req.session.role
    res.render("home",{id,date,role})
})
route.get("/test",(req,res)=>{
    
    res.render("test")
})
route.get( "/change",authenticate,(req, res)=>{
    updater()
    const id=req.session.user_id
    res.render("change_sched")
})
route.get( "/faculty/reg",(req, res)=>{
    updater()
    res.render("reg",{role:'faculty'})
})

route.get( "/student/reg",(req, res)=>{
    updater()
    res.render("reg",{role:'student'})
})
route.get('/secure/:id',async (req, res)=>{
    updater()
    const status=await encryptThis('change')
res.redirect(`/resetPass?type=change&secret=${status}`)
})
const transporter = require('../emailConfig');
const { parseJSON } = require("date-fns");
const { console } = require("inspector");
route.get('/forgot',async (req, res)=>{
    updater()
    const linktime=new Date()
        
    linktime.setMinutes(linktime.getMinutes() + 5);
    const id=req.query.id
    const url=req.query.url
    const secret=await encryptThis('reset')
    console.log(id)
const target=await queryDatabase(`SELECT email FROM info WHERE id_number='${id}'`)
const existing=await queryDatabase("SELECT * FROM terminator WHERE expid=$1",[`Login:${id}`])
const link=url+"resetPass?id="+id+"&type=reset&secret="+secret
if((target&&target.length>0)&&(existing&&existing.length==0)){
    await queryDatabase("INSERT INTO terminator (expid,exptime,expcode) values ($1,$2,$3)",[`Login:${id}`,linktime,secret])
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
    if(existing&&existing.length>0){
        res.json("We already sent an Email to your Gmail Account. Please wait for few minutes thankyou")  
    }else{
res.json("Invalid ID")    }
}

})
route.get("/resetPass",async (req, res)=>{
    updater()
const id=req.query.id
const secret=req.query.secret
const type=req.query.type
const linktime=await queryDatabase("SELECT exptime FROM terminator WHERE expid=$1",[`Login:${id}`])
console.table(linktime)
if(linktime&&linktime.length>0){
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
   }else{
    res.send("LINK EXPIRED")
   }
 
})


route.get( "/notification",authenticate,(req, res)=>{
    updater()
    const id=req.session.user_id
    res.render("notification",{id})
})
route.get("/secret",(req, res)=>{
    updater()
    res.render("DeanLogin")
})

route.get("/home/sec",authenticateSec,(req, res)=>{
    updater()
    res.render("sec")
})
route.get('/dean_logout',(req,res)=>{
    updater()
    req.session.destroy()
    
    res.json({logout:true})
})
route.get("/getfaculty",async(req, res)=>{
    const college=req.session.college
    updater()
    /**SELECT DISTINCT info.id_number, info.first,info.mid,info.last, record.used_time,record.type FROM info JOIN record ON info.id_number = record.id_number WHERE college= */
    try{
    const result = await queryDatabase('SELECT id_number,first,mid,last,college FROM info WHERE course=$2 and college=$1',[college,"faculty"])
    res.json({result})
   }catch (err) { 
    console.error('Failed to fetch records:', err);
    res.status(500).json({ error: 'Failed to fetch records' }); 
}
  
})
route.get('/logout',(req, res)=>{
    updater()
    req.session.destroy()
    res.redirect('/')
})
route.get('/check/id_number/:id',async (req, res)=>{
    const id=req.params.id
    const available_id=await queryDatabase("SELECT id_number FROM info WHERE id_number=$1;",[id])
    var timeLength=0
    const id_num=available_id.length
    if(id_num==1){
    let table="facultytime",targetID
    if(req.session.role=='student'){
        targetID=id
    }else{
        targetID=req.session.user_id
    }
console.log(targetID)
   const  available_time=await queryDatabase("SELECT * FROM "+table+" WHERE id=$1;",[targetID])
   timeLength=available_time.length
}

    res.json({idL:id_num,timeL:timeLength})
})


route.get('/createPDF', async (req, res) => {
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    const path = require('path');
    const imgPath = path.resolve(__dirname, '../publicfiles/img/header.jpg');
    const imgBase64 = fs.readFileSync(imgPath, { encoding: 'base64' });

    try {
        let body = '';
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Parse the ids array
        const ids = JSON.parse(req.query.idNum);
        console.log(req.query.idNum);

        // Loop through faculty IDs and generate records
        for (const faculty of ids) {
            console.log(faculty);

            // Get faculty name
            const facultyNames = await queryDatabase("SELECT CONCAT(last, ', ', first, ' ', SUBSTRING(mid, 1, 1), '.') AS name FROM info WHERE id_number=$1", [faculty.id]);

            // Get faculty records
            const facultyRecords = await queryDatabase(
                "SELECT type, learner_id, consulted_date, consulted_time_in, consulted_time_out, consultation_purpose FROM record WHERE id_number=$1",
                [faculty.id]
            );

            // Generate rows for the table
            const rows = await Promise.all(
                facultyRecords.map(async (entry) => {
                    const studentName = await queryDatabase(
                        `SELECT CONCAT(last, ', ', first, ' ', SUBSTRING(mid, 1, 1), '.') AS NAME FROM info WHERE id_number=$1`,
                        [entry.learner_id]
                    );

                    const time = formatTimeToHourMinute(entry.consulted_time_in, false) + "-" + formatTimeToHourMinute(entry.consulted_time_out, true);

                    const date = new Date(entry.consulted_date);
                    const formattedDate = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    });

                    return `
                        <tr>
                            <td>${studentName[0].name}</td>
                            <td>${entry.consultation_purpose}</td>
                            <td>${formattedDate}</td>
                            <td>${time}</td>
                     <td>${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</td>

                        </tr>`;
                })
            );

            // Add a page for this faculty record
            body += `
                <div style="page-break-before: always;">
                    <img src="data:image/jpeg;base64,${imgBase64}" style="width:100%;height:130px">
                    <p style="font-size:12.5px"><b>ID:</b> ${faculty.id} <br> <b>NAME:</b> ${facultyNames[0].name}</p>
                    <center>
                        <h3>Consultation Record</h3>
                    </center>
                    <table border="1" style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <th>Student Name</th>
                            <th>Purpose</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Remarks</th>
                        </tr>
                        ${rows.join('')}
                    </table>
                </div>`;
        }

        // Wrap HTML content
        const htmlContent = `
            <html>
            <head>
                <style>
                    body {
                        margin: 50px 50px;
                        font-family: Arial, sans-serif;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                </style>
            </head>
            <body>
                ${body}
            </body>
            </html>
        `;

        // Generate the PDF
        await page.setContent(htmlContent);
        await page.pdf({ path: './publicfiles/files/Report.pdf', format: 'A4' });

        await browser.close();
        console.log('PDF created: table.pdf');

        res.send("PDF generation completed.");
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("An error occurred while generating the PDF.");
    }
});




route.get('/createDocx',async (req,res)=>{
    const { Document, Packer, Paragraph, TextRun,ImageRun,  Table, TableRow, TableCell  } = require('docx');
    const fs = require('fs');
  
    const data=await queryDatabase("SELECT * FROM record WHERE id_number='54321'")
    console.table(data)
    const tableRows = [];
    data.forEach((entry) => {
        var date=new Date(entry.consulted_date);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          });
        var time=formatTimeToHourMinute(entry.consulted_time_in,false)+"-"+formatTimeToHourMinute(entry.consulted_time_out,true)
        tableRows.push(
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph(entry.learner_id)], // Add Student Name
                    }),
                    new TableCell({
                        children: [new Paragraph(entry.consultation_purpose)], // Add Purpose
                    }),
                    new TableCell({
                        children: [new Paragraph(formattedDate)], // Add Date and Time
                    }),
                    new TableCell({
                        children: [new Paragraph(time)], // Add Date and Time
                    }),
                    new TableCell({
                        children: [new Paragraph(entry.type)], // Add Remarks
                    }),
                ],
            })
        );
    });
    // Create a new document
    if(fs.readFileSync("./publicfiles/img/header.jpg")){
        console.log("TRue");
    }
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { // Adjust margins to ensure proper centering
                            top: 720,   // 1 inch in twips
                            bottom: 720,
                            left: 360,
                            right: 360,
                        },
                    },
                },
            
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: fs.readFileSync("./publicfiles/img/header.jpg"),
                                transformation: { width: 550 / 0.8, height: 110 / 0.8 },
                            }),
                        ],
                        alignment: "center",
                        spacing: { line: 480 },
                    }),
                    new Table({
                        width: {
                            size: 100, // Set width as a percentage (relative to page width)
                            type: "pct", // Use percentage width type
                        },
                        rows: [
                            
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: "Student Name", bold: true })] })],
                                        shading: {
                                            fill: "D3D3D3", // Gray color (Hex code for light gray)
                                        },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: "Purpose", bold: true })] })],
                                        shading: {
                                            fill: "D3D3D3", // Gray color (Hex code for light gray)
                                        },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })],
                                        shading: {
                                            fill: "D3D3D3", // Gray color (Hex code for light gray)
                                        },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: "Time", bold: true })] })],
                                        shading: {
                                            fill: "D3D3D3", // Gray color (Hex code for light gray)
                                        },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: "Remarks", bold: true })] })],
                                        shading: {
                                            fill: "D3D3D3", // Gray color (Hex code for light gray)
                                        },
                                    }),
                                ],
                            }),
                            
                            ...tableRows,

                        ],
                    }),
                    new Paragraph({
                        
                        children: [
                            new TextRun({
                                text: "This is a computer-generated document",
                                size: 24,
                            }),
                        ],
                        alignment: "center",
                    })
                ],
            },
        ],
    });
    
    // Write the document to a file
    Packer.toBuffer(doc).then(async (buffer) => {
        fs.writeFileSync('Report.docx', buffer);
        console.log('Word document created: Report.docx');
    
    });
    res.send("okey")
    
})

function formatTimeToHourMinute(timeString,isLast) {
    // Split the time string into components
    const [hours, minutes] = timeString.split(":");
  
    // Convert the hour to 12-hour format if needed
    const formattedHour = (parseInt(hours, 10) % 12) || 12;
  
    // Combine hour and minutes
    if(isLast) {
       if(hours<6||hours==12){
        return `${formattedHour}:${minutes} PM`
       }else{
return `${formattedHour}:${minutes} AM`
       }
         
    }
    return `${formattedHour}:${minutes}`;
  }
updater()
module.exports = route
