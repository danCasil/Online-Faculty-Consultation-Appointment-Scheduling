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
            resolve(res.rows);
        });
    });
}



route.get("/load/pg_role", async (req, res,) => {
    const id = req.session.user_id
    const username = await queryDatabase("SELECT id_number, first, last, (first || ' ' || last) AS fullname FROM info where id_number='" + id + "';")
    if (req.session.role == 'faculty') {
        res.json({ role: 'faculty', name: username[0].fullname, id: username[0].id_number })
    } else {
        req.session.role = 'student'
        res.json({ role: 'student', name: username[0].fullname, id: username[0].id_number })
    }

})
route.get('/load/new_notification', async (req, res) => {
    const id = req.session.user_id
    try {
        const result = await queryDatabase("SELECT COUNT(status) AS new_notif FROM notif WHERE status='new'AND receiver_id=$1", [id])

        res.json({ result })
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
})

//for development
route.get('/get/all/user', async (req, res) => {
    try {
        const result = await queryDatabase("SELECT * FROM info")
        res.json({ raw: result })
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
})
route.get('/deleteThisUser/:id', async (req, res) => {
    const id = req.params.id
    try {
        await queryDatabase("DELETE FROM info WHERE id_number=$1", [id])
        commitAndPush()
        res.json(true)
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
})
//end of development

route.get('/load/notification', (req, res) => {
    const id = req.session.user_id
 
    notif_data(id, async (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        try {
            const poolresult = await queryDatabase('SELECT voter_id,voted_id FROM pool WHERE voter_id=$1', [req.session.user_id])
            if (poolresult && poolresult.length == 0) {
                const SYSTEMnotif = await queryDatabase("SELECT notif.*,info.last,info.mid,info.first,info.college,notif.notif_text FROM notif JOIN info ON notif.notif_text=info.id_number WHERE sender_id='SYSTEM' AND receiver_id='alpha'AND info.college=$1 AND notif.notif_text!=$2", [req.session.college, req.session.user_id])
                res.json({ result, SYSTEMnotif })
            } else {
                res.json({ result })
            }

        } catch (err) {
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    })
})
route.get("/load/schedule", (req, res) => {
    if (req.session.role != 'faculty') {
        req.session.role = 'student'
    }
    const id = req.session.user_id
    pg_role = req.session.role

    user_sched(id, async (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }

        try {
            const rec_id = await queryDatabase("SELECT record_id FROM record WHERE id_number=$1 AND type='consulted'", [id])
            res.json({ result, pg_role, rec_id, id })
        } catch (err) {
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    })
})
route.get("/load/declineSched", async (req, res) => {
    const rawdata = req.query.data
    const data = JSON.parse(rawdata)
    const { id, scheduler, scheduled, timeIn, timeOut, schedDate } = data


    console.table(data)
    if (req.session.role == 'faculty') {

        try {
            const pur = await queryDatabase("SELECT purpose FROM sched WHERE sched_id=$1", [id])
            await queryDatabase("INSERT INTO record(id_number,  exc_date, type, learner_id,consulted_date,consulted_time_in,consulted_time_out,consultation_purpose) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [scheduled, new Date(), 'declined', scheduler, schedDate, timeIn, timeOut, pur[0].purpose])
            await queryDatabase("UPDATE sched SET remark='declined' WHERE sched_id=$1", [id])
            commitAndPush()
            notif(data, 'declined', req)
        } catch (err) {
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    } else {
        try {
            await queryDatabase("UPDATE sched SET remark='declined' WHERE sched_id=$1", [id])
            commitAndPush()
            notif(data, 'declined', req)
        } catch (err) {
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    }

})
route.get("/load/checkConflict", async (req, res) => {
    const tin = req.query.tin
    const tout = req.query.tout
    const day = req.query.Day
    const user_id = req.session.user_id
    let table
    if (req.session.role == 'faculty') {
        table = 'facultytime'
    } else {
        table = 'studenttime'
    }
    console.log(tin + "" + tout)
    console.log(`SELECT FROM ${table} WHERE id = ${user_id} AND day = ${day} AND ((timein <= ${tout} AND timeout >= ${tin}) OR (timein <= ${tin} AND timeout >= ${tout}) OR (timein >= ${tin} AND timeout <= ${tout}) ) ; `)
    try {
        const result = await queryDatabase(` SELECT  timein,timeout FROM ${table} WHERE id = $1 AND day = $2 
         ; `, [user_id, day])
        console.table(result)
        // Conflict found 
        res.json({ datas: result });

    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }

})

route.get("/load/change_sched", async (req, res) => {

    const userid = req.session.user_id

    if (req.session.role == 'faculty') {
        try {
            const result = await queryDatabase("SELECT * FROM facultytime WHERE id = $1 ORDER BY timein asc;", [userid])

            res.json({ msg: "es", result })
        }
        catch (err) {
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    } else {
        try {
            const result = await queryDatabase("SELECT * FROM studenttime WHERE id=$1 ORDER BY timein asc;", [userid])
            console.table(result)
            res.json({ msg: "es", result })
        }
        catch (err) {
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    }



})
route.get("/load/record", async (req, res) => {
    const id = req.query.id
    const sem = req.query.sem
    try {
        const semester = await queryDatabase("SELECT * FROM sem WHERE sem_id=$1", [sem])
        console.table(semester)
        const date1 = new Date(semester[0].sem_start);
        const date2 = new Date(semester[0].sem_end);
        const formattedDate1 = `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()}`;
        const formattedDate2 = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`;
        console.table(formattedDate1 + " " + formattedDate2)
        const record_type = await queryDatabase("SELECT type FROM record WHERE id_number=$1 AND(record.exc_date>='" + formattedDate1 + "' AND record.exc_date<='" + formattedDate2 + "')", [id])
        const user_data = await queryDatabase("SELECT last,first,mid,id_number FROM info WHERE id_number=$1", [id])
        const studentdata = await queryDatabase("SELECT info.last,info.first,info.mid,record.* FROM record JOIN  info ON record.learner_id=info.id_number  WHERE record.id_number=$1  AND(record.exc_date>='" + formattedDate1 + "' AND record.exc_date<='" + formattedDate2 + "') ", [id])

        console.table(`SELECT info.last,info.first,info.mid,record.* FROM record JOIN  info ON record.learner_id=info.id_number  WHERE record.id_number='${id}'  AND(record.exc_date>='${formattedDate1}' AND record.exc_date<='${formattedDate2}') `)
        const counts = record_type.reduce((acc, record) => {
            acc[record.type] = (acc[record.type] || 0) + 1;
            return acc;
        }, { consulted: 0, cancelled: 0, declined: 0, missed: 0 });
        console.log(user_data)
        res.json({ msg: "eyy", counts, user_data, studentdata });
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
})
route.get("/load/availabletime", async (req, res) => {
    const information = JSON.parse(req.query.data)
    const { date, month, day, target_id, year } = information
    let target
    const targetdate = new Date(year, month, day)
    let table = 'facultytime'

    //forPostman
    // req.session.role='faculty'

    if (req.session.role != 'faculty') {
        target = target_id
    } else {
        //for postman
        // target='54321'
        //for Running
        target = req.session.user_id
    }

    try {
        const consultHour = await queryDatabase("SELECT * FROM " + table + " WHERE id=$1 AND day=$2 ORDER BY timein asc", [target, day])
        get_name(target, async (err, targetName) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
                return;
            }

            const formatdate = `${year}-${month + 1}-${date}`
            const existingSched = await queryDatabase("SELECT * FROM sched JOIN  " + table + " ON sched.time_in= " + table + ".timein AND sched.time_out= " + table + ".timeout WHERE (nasched=$1 OR nagsched=$2 )AND date=$3 AND remark='accepted' ", [target, target, formatdate])

            var availableSched = []

            consultHour.forEach(hour => {
                if (existingSched.length > 0) {
                    existingSched.forEach(sched => {
                        if ((sched.time_in != hour.timein) && (sched.time_out != hour.timeout)) {
                            availableSched.push({  indx:hour.indx,timeIn: hour.timein, timeOut: hour.timeout })
                        }
                    })
                }
                else {
                    availableSched.push({ indx:hour.indx,timeIn: hour.timein, timeOut: hour.timeout })
                }
            })
            availableSched = availableSched.filter((value, index, self) =>
                index === self.findIndex((item) => item.timeIN === value.timeIN && item.timeOut === value.timeOut)
            );
            console.log("availableSched")
            console.table(availableSched)
            console.table(consultHour)
            console.table(existingSched)
            res.json({ availableSched, consultHour, targetName, existingSched, month: month, date: date })
        })
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }


})
route.get("/load/conflict", async (req, res) => {
    const information = JSON.parse(req.query.data)
    const { date, month, timein, timeout, day, target_id, year } = information
    console.log(timein + " " + timeout)
    const formatdate = `${year}-${month + 1}-${date}`
    try {
        const conflictedSched = await queryDatabase(`SELECT sched.*,info.last,info.first,info.mid FROM sched JOIN info ON info.id_number=sched.nasched WHERE nagsched=$1 AND date=$2 AND ( remark='accepted' OR remark='new') AND (( time_in >= '${timein}' AND time_in < '${timeout}' )OR (time_out >'${timein}'  AND time_out <='${timeout}') OR (time_in <= '${timein}' AND time_out >= '${timeout}')) ORDER BY sched.time_in`, [req.session.user_id, formatdate])
        var existingSched =[]
        if(req.session.role=="faculty"){
             existingSched = await queryDatabase("SELECT * FROM sched WHERE nasched=$1 AND date=$2 AND time_in=$3 AND time_out=$4", [req.session.user_id,formatdate,timein,timeout])
        }

        if (conflictedSched && conflictedSched.length > 0||existingSched.length>0) {
            const sched = conflictedSched
            console.table(existingSched)
            res.json({ isConflict: true, sched,existingSched })
        } else {
            res.json({ isConflict: false })
        }
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
})

route.get("/load/create_suggestion", async (req, res) => {
    const txt = req.query.target
    const lastChar = txt.charAt(txt.length - 1)
    const firstChar = txt.charAt(0)
    let course
    if (req.session.role == 'faculty') {
        course = `course != 'faculty'`
    } else {
        course = `course = 'faculty'`
    }


    if (lastChar == '-' || !isNaN(firstChar)) {
        try {
            const results = await queryDatabase(`SELECT id_number, id_number, last, mid, first FROM info WHERE id_number LIKE '${txt}%' AND ${course}`)

            console.table(results)
            res.json({ results, type: 'id' })

        } catch (err) {
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }

    } else {
        try {
            const results = await queryDatabase(`SELECT id_number, last, mid, first FROM info 
WHERE (first ILIKE '${txt}%' OR last ILIKE '${txt}%' OR CONCAT(last,', ', first) ILIKE '${txt}%' OR CONCAT(last, ' ,', first) ILIKE '${txt}%' OR CONCAT(last, ', ', first) ILIKE '${txt}%') 
AND ${course}`)
            console.table(results)
            res.json({ results, type: 'name' })
        } catch (err) {
            console.error('Failed to fetch records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
        }
    }
})
route.get("/load/graphdata", async (req, res) => {
    const id = req.query.id
    const college = 'CCSICT';
    const dates = await queryDatabase(`SELECT sem_name,sem_start,sem_end FROM sem WHERE sem_id='${id}' `)
    console.table(dates)

    const date1 = new Date(dates[0].sem_start);
    const date2 = new Date(dates[0].sem_end); // Format the dates (Example: Convert to ISO string) 
    const formattedDate1 = `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()}`;
    const formattedDate2 = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`;
    let xValues = [];
    let yValues = [];
    const currentDate = new Date()
    const thisMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1)
    const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const start = `${thisMonthStart.getFullYear()}-${thisMonthStart.getMonth()}-${thisMonthStart.getDate()}`;
    const end = `${thisMonthEnd.getFullYear()}-${thisMonthEnd.getMonth()}-${thisMonthEnd.getDate()}`;

    try {
        const finshedCon = await queryDatabase(`SELECT count(type) FROM record WHERE type='consulted' AND(exc_date>='${start}'AND exc_date<'${end}')`)
        const count2 = await queryDatabase(`SELECT sched.scheduler_role, COUNT(sched.scheduler_role) AS count FROM sched JOIN info ON sched.nagsched=info.id_number OR sched.nasched=info.id_number WHERE (sched.date>='${start}'AND sched.date<'${end}') AND info.college='${college}' Group by sched.scheduler_role`)

        const counts = await queryDatabase("SELECT type, COUNT(*) AS Count FROM record JOIN info on info.id_number=record.id_number WHERE info.college='" + college + "'  AND(exc_date>='" + formattedDate1 + "' AND exc_date<='" + formattedDate2 + "') Group by type;")
        const forBarChart = await queryDatabase(`SELECT exc_date FROM record WHERE type='consulted' AND(exc_date>='${formattedDate1}'AND exc_date<'${formattedDate2}')`)
        console.table(counts)
        const semDate = [date1, date2]
        counts.forEach(element => {
            xValues.push(element.type)
            yValues.push(element.count)
        });
        var xroles = []
        var yroles = []
        count2.forEach(element => {
            xroles.push(element.scheduler_role)
            yroles.push(element.count)
        });
        console.table(forBarChart)

        res.json({ yroles, xroles, date1, xValues: xValues, yValues: yValues, sem_name: dates[0].sem_name, count2: count2, finished: finshedCon, semDate: semDate, forBarChart: forBarChart });
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});
route.get("/filter/data", async (req, res) => {
    const checkbox = req.query.checkbox;

    const { dec, can, con, mis, id, sem } = JSON.parse(checkbox)
    const dates = await queryDatabase(`SELECT sem_name,sem_start,sem_end FROM sem WHERE sem_id='${sem}' `)
    const date1 = new Date(dates[0].sem_start);
    const date2 = new Date(dates[0].sem_end); // Format the dates (Example: Convert to ISO string) 
    const formattedDate1 = `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()}`;
    const formattedDate2 = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`;
    let query = "SELECT info.last,info.first,info.mid,record.* FROM record JOIN  info ON record.learner_id=info.id_number  WHERE record.id_number='" + id + "'  AND(record.exc_date>='" + formattedDate1 + "' AND record.exc_date<='" + formattedDate2 + "') "
    // let query = "SELECT record.*,info.first,info.last,info.mid FROM record JOIN info ON info.id_number=record.learner_id WHERE (1=1 AND record.id_number='"+id+"')";
    let conditions = [];
    if (dec) {
        conditions.push("type = 'declined'");
    }
    if (can) {
        conditions.push("type = 'cancelled'");
    }
    if (con) {
        conditions.push("type = 'consulted'");
    }
    if (mis) {
        conditions.push("type = 'missed'");
    }

    if (conditions.length > 0) {
        query += " AND (" + conditions.join(" OR ") + ")";
    }

    console.log(query);
    const filtered = await queryDatabase(query)
    console.table(filtered);
    res.json({ filtered })
})

route.get("/load/available", async (req, res) => {
    const id = req.query.target_id
    var table = 'facultytime', target
    if (req.session.role != 'faculty') {
        target = id
    } else {
        target = req.session.user_id
    }
    const date = req.query.date
    const month = parseInt(req.query.month) + 1
    const year = req.query.year
    const day = req.query.day
    const targetdate = `${year}-${month}-${date}`
 
    try {

        const consultHour = await queryDatabase("SELECT DISTINCT day FROM " + table + " WHERE id=$1 AND day=$2;", [target, day])
        const results2 = await queryDatabase("SELECT indx FROM " + table + " WHERE id=$1 AND day=$2;", [target, day])
        const result3 = await queryDatabase("SELECT * FROM sched JOIN " + table + " ON sched.time_in=" + table + ".timein AND sched.time_out=" + table + ".timeout  WHERE (nasched=$1 OR nagsched=$2) AND date=$3 AND remark='accepted'", [target, target, targetdate])
        if(consultHour.length>0){
            console.log("consultHour")
            console.table(consultHour)
        }
        if(results2.length>0){
            console.log("results2")
            console.table(results2)
        }
        console.log(`SELECT * FROM sched JOIN ${table} ON sched.time_in=${table}.timein AND sched.time_out=${table}.timeout  WHERE (nasched='${target}' OR nagsched='${target}') AND date='${targetdate}' AND remark='accepted'`)
        if(result3.length>0){
            console.log("result3")
            console.table(result3)
        }
     
        if (consultHour && consultHour.length == 1 && (results2.length > result3.length)) {
            console.table(consultHour)
            console.table(result3)
            const Allin = await queryDatabase("SELECT timein FROM " + table + " WHERE id=$1 AND day=$2;", [target, day])
            const slot = results2.length - result3.length
            res.json({ status: true, result3, Allin, slot: slot, consultHour })
        } else {
            res.json({ status: false })
        }
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
})


async function user_sched(id, callback) {
    try {

        const A = await queryDatabase(`SELECT * FROM (SELECT info.first, info.last,info.mid,sched.* FROM info JOIN sched ON info.id_number = sched.nagsched WHERE sched.nasched = '${id}'UNION SELECT info.first, info.last, info.mid, sched.* FROM info JOIN sched ON info.id_number = sched.nasched WHERE sched.nagsched = '${id}' ) AS combined_results ORDER BY date DESC;
`)     
console.table(A)
        callback(null, A);
    } catch (err) {
        return callback(err);
    }
}

async function notif_data(id, callback) {
    try {
        const userdata = await queryDatabase("SELECT notif.notif_id,info.first, info.last,notif.status, notif.dateandtime,notif.notif_text,notif.type FROM info JOIN notif ON info.id_number = notif.sender_id WHERE notif.receiver_id = $1 ORDER BY dateandtime DESC;", [id])
        console.table(userdata)
        callback(null, userdata);
    } catch (err) {
        return callback(err);
    }
}
async function get_name(id, callback) {
    try {
        const userdata = await queryDatabase('SELECT first, last,mid FROM info WHERE id_number=$1;', [id])
        callback(null, userdata);
    } catch (err) {
        return callback(err);
    }
}
async function notif(data, status, req) {
    const { id, scheduler, scheduled, timeIn, timeOut, schedDate, txtmsg, scheduler_role } = data

    const datas = {
        nagsched: scheduled,
        nasched: scheduler,
        scheduler_role: scheduler_role,
        timein: timeIn,
        timeout: timeOut,
        date: schedDate
    }
    const timedate = new Date();
    let msg
    if (status == 'declined') {

        type = `declined`
    } else if (status == 'accepted') {
        type = `accepted`
    }
    else if (status == 'cancelled') {
        type = `cancelled`
    }
    else {
        type = "notif"
    }
    try {
        await queryDatabase("INSERT INTO notif(sender_id, receiver_id, notif_text, dateandtime, status,type) VALUES ($1,$2,$3,$4,'new',$5) ", [scheduled, scheduler, txtmsg, timedate, type])
        commitAndPush()
        mailSendNotif(datas, 'declined', req)
    }
    catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
}

async function duplicheck(data, callback) {
    console.table(data.id)
    try {
        switch (data.checking) {
            case "idnum":
                const id_number = await queryDatabase("SELECT id_number FROM info WHERE id_number=$1", [data.id])
                if (id_number && id_number.length > 0) {
                    callback(null, { duplicated: true });
                } else {
                    callback(null, { duplicated: false });
                }

                break;
            case "email":
                const email = await queryDatabase("SELECT email FROM info WHERE email=$1", [data.id])
                if (email && email.length > 0) {
                    callback(null, { duplicated: true });
                } else {
                    callback(null, { duplicated: false });
                }
                break;
            case "user":
                const user = await queryDatabase("SELECT username FROM info WHERE username=$1", [data.id])
                if (user && user.length > 0) {
                    callback(null, { duplicated: true });
                } else {
                    callback(null, { duplicated: false });
                }
                break;
        }
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
        return callback(err);
    }
}
route.get('/load/checkduplicate', (req, res) => {
    const inValue = req.query.inputvalue
    const check = req.query.checktype
    const data = {
        id: inValue,
        checking: check
    }

    duplicheck(data, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }

        res.json({ dupli: result.duplicated })


    })

})


async function mailSendNotif(data, txt, req) {
    let mailtxt, subj
    try {
        const Name = await queryDatabase("SELECT usert, last, first FROM info WHERE id_number=$1", [data.nagsched])
        const Email = await queryDatabase("SELECT email FROM info WHERE id_number=$1", [data.nasched])
        console.log(Email[0].email)
        console.table(Name)
        const currentTime = new Date();
        let greet;
        const morningStart = new Date();
        morningStart.setHours(6, 0, 0);
        const afternoonStart = new Date(); afternoonStart.setHours(12, 0, 0);
        const eveningStart = new Date();
        eveningStart.setHours(18, 0, 0);
        if (currentTime >= morningStart && currentTime < afternoonStart) {
            greet = "Good Morning!";
        } else if (currentTime >= afternoonStart && currentTime < eveningStart) {
            greet = "Good Afternoon!";
        }
        else { greet = "Good Evening!"; }
        let fullname
        if (Name[0].usert != null) {
            fullname = `${Name[0].usert} ${Name[0].first} ${Name[0].last}`
        } else {
            fullname = ` ${Name[0].last}, ${Name[0].first}`
        }
        if (txt == 'finish' && data.scheduler_role == 'student') {
            subj = `Consultation Confirmation`
            mailtxt = `${greet} , We are here to inform you that ${fullname} has Confirmed that you have successfully completed the scheduled consultation.`
        } else if (txt == 'finish' && data.scheduler_role == 'faculty') {
            subj = `Consultation Confirmation`
            mailtxt = `${greet} , We are here to inform you that ${fullname} has Confirmed that you have  completed the scheduled time.`
        } else if (txt == 'accepted') {

            subj = `Schedule Accepted`
            mailtxt = `${greet} , We are here to inform you that ${fullname} has Accepted your scheduled time from ${data.timein} to ${data.timeout} on ${formatThis(data.date)}`
        } else if (txt == 'declined') {
            subj = `Schedule Declined`
            mailtxt = `${greet} , We are here to inform you that ${fullname} has Declined your scheduled time from ${data.timein} to ${data.timeout} on ${formatThis(data.date)}`
        } else {
            subj = `Schedule Cancelled`
            mailtxt = `${greet} , We are here to inform you that ${fullname} has Cancelled your scheduled time from ${data.timein} to ${data.timeout} on ${formatThis(data.date)}`
        }

        const mailOptions = {
            to: Email[0].email,
            from: 'OFCAS <ofcas.system@gmail.com>',
            subject: subj,
            text: mailtxt
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err);
                res.json({ errorMessage: 'Error sending email.' });
            }



            res.json({ success: true });

        })

    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
}
route.get('/load/notif/filter', async (req, res) => {
    const token = req.query.token;
    const id = req.session.user_id
    let text
    if (token == 'all') {
        text = ""
    } else if (token == 'new') {
        text = "AND status='new' "
    } else {
        text = "AND status='old' "
    }
    try {
        const result = await queryDatabase("SELECT notif.notif_id,info.first, info.last,notif.status, notif.dateandtime,notif.notif_text,notif.type FROM info JOIN notif ON info.id_number = notif.sender_id WHERE notif.receiver_id = $1 " + text + " ORDER BY dateandtime DESC;", [id]);
        const poolresult = await queryDatabase('SELECT voter_id,voted_id FROM pool WHERE voter_id=$1', [req.session.user_id])
        if (poolresult && poolresult.length == 0) {
            const SYSTEMnotif = await queryDatabase("SELECT notif.*,info.last,info.mid,info.first,info.college,notif.notif_text FROM notif JOIN info ON notif.notif_text=info.id_number WHERE sender_id='SYSTEM' AND receiver_id='alpha'AND info.college=$1 AND notif.notif_text!=$2", [req.session.college, req.session.user_id])
            res.json({ result, SYSTEMnotif })
        }
        else {
            res.json({ result })
        }

    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
    }


})
function formatThis(d) {
    const originalDate = new Date(d);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return formattedDate = originalDate.toLocaleDateString('en-US', options);
}
route.get("/ReqOTP", async (req, res) => {
    let id = req.query.id;
    try {
        const otp = await queryDatabase("Select exptime,expcode From terminator WHERE expid=$1", [id]);
        let number, geneartedOTP = ""


        if (otp.length > 0) {


            if (new Date() < otp[0].exptime) {
                console.log("active")
                Toarray = otp[0].expcode.split(',').map(Number);
                geneartedOTP = Toarray;
            } else {
                console.log("expired")
                number = generateOTP(6)
                let expiredTime = new Date(new Date(otp[0].exptime).getTime() + 5 * 60000)
                await queryDatabase("DELETE FROM terminator WHERE expid=$1", [id]);
                let otpString = number.toString();
                await queryDatabase("INSERT INTO terminator(expid, exptime,expcode) VALUES($1, $2,$3)", [id, expiredTime, otpString]);
                console.log("walang karga");
                geneartedOTP = number
            }

        } else {
            number = generateOTP(6)
            let otpString = number.toString();
            await queryDatabase("INSERT INTO terminator(expid, exptime,expcode) VALUES($1, $2,$3)", [id, new Date(), otpString]);
            console.log("walang karga");
            geneartedOTP = number
        }
        console.log(geneartedOTP)



        res.json({ geneartedOTP })
    }
    catch (err) {
        console.error("error" + err);
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

route.get("/getSem", async (req, res) => {
    try {
        const sem = await queryDatabase("SELECT * FROM sem ORDER BY sem_end");
        console.table(sem);
        res.json({ sem });

    } catch {
        console.error("err");
    }
})

module.exports = route