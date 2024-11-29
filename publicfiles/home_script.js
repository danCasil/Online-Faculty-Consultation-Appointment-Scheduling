

const yesORnoModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
const editTxt=document.getElementById("msgForConfirm")





document.addEventListener("DOMContentLoaded", function (e) {
  
  if(document.getElementById('loginRole').value!='faculty'){
    document.getElementById("targets").textContent="faculty member's"
  }else{
 document.getElementById("targets").textContent="Student's"
  }
  refreshschedule()
  document.querySelectorAll(".mod_item").forEach(item => {
    item.style.display = "none";
  });

  document.getElementById("resched_status").value=''
})

document.getElementById("labelForid").addEventListener('click',function (e) {
  document.getElementById("target_id").focus()
})
function setStyle(id){
  return document.getElementById(id).style
}

document.getElementById("target_id").addEventListener('focus',function (e) {
setStyle('labelForid').fontSize='12px'
setStyle('labelForid').top="24%"
setStyle('labelForid').transition="font-size .5s,top .5s"
})
document.getElementById("target_id").addEventListener('focusout',function (e) {
  if(this.value==''){
  setStyle('labelForid').fontSize='12px'
  setStyle('labelForid').top="48%"
  setStyle('labelForid').transition="font-size .5s,top .5s"}
  })


function refreshschedule() {


  fetch(`/load/schedule`).then(response => response.json()).then(data => {
      document.getElementById("ofcasLoad").style.display ="none"
    document.getElementById("noData").style.display = "";
    if(data.result&&data.result.length>0){
      document.getElementById("noData").style.display = "none";
      loadschedule(data.result, data.pg_role, data.rec_id,data.id)
    }else{
      document.getElementById("noData").style.display = "";
    }
  
    
  })
    .catch(err => {
      console.error('Error fetching account data:', err);
    });
}

async function loadschedule(datas, role, rec,curr_id) {

  const tbody = document.getElementById("tablebd");
  tbody.innerHTML = "";
  datas.forEach(async (data, index) => {
    

const diff=await dateDifference(data.date ,new Date())
const toastBd = document.getElementById('toastbody')
  const toastTime= document.getElementById("toasttime")
const toastLiveExample = document.getElementById('liveToast')
const toastTt= document.getElementById("toasttitle")
 const Formattedtimein = formatTime(data.time_in)
 const Formattedtimeout = formatTime(data.time_out)
if (diff.days < 3 && diff.days>0 &&data.remark=='accepted') {
      toastTime.textContent = diff.days
toastBd.textContent=`You've got an upcoming meeting with  ${data.last}, ${data.first}  from ${Formattedtimein} to ${Formattedtimeout} on ${months[currentDate.getMonth()]} ${currentDate.getDate()}/${currentDate.getFullYear()}`
  



  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
    

    }
   const rawdate=new Date(data.date)
    let month, day, year
    if (!rawdate.getMonth() > 9) {
      month = rawdate.getMonth() + 1;
      month = "0" + month;
    } else {
      month = rawdate.getMonth() + 1;
    }
    if (!rawdate.getDate() > 9) {
      day = "0" + rawdate.getDate();
    } else {
      day = rawdate.getDate();
    }

    year = rawdate.getFullYear();

    const finaldate = month + "/" + day + "/" + year
    const declinebtn = document.createElement("button");
    const acceptbtn = document.createElement("button");
    const row = document.createElement("tr")
    const col1 = document.createElement("td")
    const col2 = document.createElement("td")
    const col3 = document.createElement("td")
    let col4 = document.createElement("td")
    const col_6A=document.createElement("div")
    const col_6B=document.createElement("div")
    const newRow=document.createElement("div")
    newRow.classList.add("row")
  let over

   col4.style.textAlign = "center"
   col4.style.fontSize="13px"
    col1.textContent = data.first + " " + data.last
    row.appendChild(col1)

    col2.textContent = formatTime(data.time_in) + " - " + formatTime(data.time_out)
    row.appendChild(col2)

    col3.textContent = finaldate
    row.appendChild(col3)
  
    const schedinfo = {
      id: data.sched_id,
      scheduler: data.nagsched,
      scheduled: data.nasched,
      timeIn: data.time_in,
      timeOut: data.time_out,
      schedDate: year + "-" + month + "-" + day,
      scheduler_role:data.scheduler_role
    }

col_6A.classList.add('col-sm-6')
col_6B.classList.add('col-sm-6')
const A=create_Button("Accept")
const B=create_Button("Declined")
console.table(diff)
if(data.remark=='new'){

  if(diff.days<=2){
    if(data.nagsched==curr_id){
     
      if(role=="faculty"){
        col4.appendChild(create_Button("Resched"))
      }else{
        col4.textContent='WAITING FOR CONFIRMATION'
      }
  }else{
    if(role=='faculty'){
  
      col_6A.appendChild(A)
      col_6B.appendChild(B)
      A.onclick=()=>{
      acceptSched(data.sched_id)
      }
      B.onclick=()=>{
      declineSched(schedinfo)
      }
      newRow.appendChild(col_6A)
      newRow.appendChild(col_6B)
      col4.appendChild(newRow)
    }else{
      
    }
  }


  
}else{
 
  over=overLay(`overlay${data.sched_id}`,'Missed')

  fetch(`/update/missed?id=${data.sched_id}`,{method:"PATCH"})

  col4.textContent="MISSED"
}

}else if(data.remark=='missed'){
  over=overLay(`overlay${data.sched_id}`,'Missed')
col4.textContent = "Missed"
}else if(data.remark=='declined'){
  over=overLay(`overlay${data.sched_id}`,'Declined')
col4.textContent = "Declined"
}else if(data.remark=='accepted'){
if(loginDate>currentDate){
  if(data.nagsched==curr_id){
  const f=create_Button('Finish')
  f.onclick=()=>{
    insertcomplete(data)
   }
   if(window.innerWidth<500){
    f.style.width="100%"
   }
  col4.appendChild(f)}else{
col4.textContent="Waiting for Confirmation"
  }
}else {
  if(data.nagsched!=curr_id){
  const c=create_Button('Cancel')
  c.onclick=()=>{
   cancelSched(schedinfo)
  }
  c.style.width='50%'
  if(window.innerWidth<500){
  c.style.width='100%'
 
}
c.style.marginLeft='auto'
  c.style.marginRight='auto'
  col4.appendChild(c)
}else{
  col4.textContent="Accepted"
}
}
}else if(data.remark=="cancelled"){
  over=overLay(`overlay${data.sched_id}`,'Cancelled')
 col4.textContent="Cancelled"
}
else{
  over=overLay(`overlay${data.sched_id}`,'Finished')
  over.classList.add("Finish")
  col4.textContent="Finished"
}
 
    row.appendChild(col4)
    if(over){
    row.appendChild(over)}
    tbody.appendChild(row)
  })
  const overLays = document.querySelectorAll('.overLay'); 
  overLays.forEach(overLay => { overLay.addEventListener('click', function(e) {  overLays.forEach(el => el.classList.remove('show'));
    this.classList.add('show');
    
   });})

  
}
function create_Button(txt){
 const btn=document.createElement("button")
  if(txt=='Finish'){
    btn.classList.add("btn-success")
    btn.style.width='50%'
   
    if(window.innerWidth<500){
 btn.style.width='80%'
    }
   
    btn.style.marginLeft='auto'
      btn.style.marginRight='auto'
  }else if(txt=='Accept'){
    btn.classList.add("btn-primary")
  }else{
    btn.classList.add("btn-danger")
    if(window.innerWidth<500){
      btn.style.marginTop="10px"
    }
  }
  btn.style.textAlign = "center"
  btn.style.fontSize = "13px"
  btn.classList.add("form-control")
  btn.textContent=txt
  btn.type="button"
  return btn
}

function overLay(id,text){
  const overlay=document.createElement("div")
  overlay.textContent=text
  overlay.id=id
  overlay.classList.add("overLay")
 
  return overlay
}

function acceptSched(id){
  const confirmed=confirm("Are you sure you want to accept this schedule?" )
  if(confirmed){
fetch(`/update/schedule/accept?id=${encodeURI(id)}`,{method:'PATCH'}).then(response => response.json())
.then(data => {
  window.location.reload()
  console.log('Success:',data);

})
.catch(error => {
  console.error('Error:', error);
});
  }
}

//old
function insertcomplete(senddata) {
  console.table(senddata)

  const dataString=JSON.stringify(senddata)
  fetch(`/update/record?data=${encodeURI(dataString)}&&type=${'consulted'}`, {
    method: 'PATCH',

  })
    .then(response => response.json())
    .then(data => {

  window.location.reload()
    })
    .catch(error => {

      console.error('Error:', error);
    });
}
//old
function acceptsched(params) {
  const data = JSON.stringify(params);
  const confirmation = confirm("Are you sure to accept this schedule?")
  if (confirmation) {
    fetch(`/update/accept?data=${encodeURIComponent(data)}`, { method: "PATCH" }).then(response => response.json()).then(data => {
      if (data.status == true) {
        window.location.reload()
      }
    }).catch((err) => {
      console.log(err)
    })
  }
}
async function cancelSched(params) {
  editTxt.innerHTML='You are about to <b>cancel</b> a schedule. Are you sure you want to continue?'
  document.getElementById('noBtn').textContent=`No`
   
  
    yesORnoModal.show();
  const data = JSON.stringify(params);
  const confirmation = await yesORno()
  if (confirmation) {

    fetch(`/update/cancel?data=${encodeURIComponent(data)}`, { method: "PATCH" }).then((response) => response.json()).then(data=>{
if(data.status == true){
  window.location.reload()
}
    }).catch(err=>{
console.log('Cancel Fail')
    })
  }else{
    yesORnoModal.hide()
  }
}

async function declineSched(rawdata) {
  editTxt.innerHTML='You are about to <b>decline</b> a schedule. Are you sure you want to continue?'
document.getElementById('noBtn').textContent=`No, I'll reschedule `
 

  yesORnoModal.show();

  const confirmation = await yesORno()
  yesORnoModal.hide()
  if (confirmation == true) {
    
    const myModal = new bootstrap.Modal(document.getElementById("declineForm"));
    myModal.show()

    const txt = document.getElementById("reason")
    const result = await waitForConfirmation();
    if (result == true) {
      rawdata.txtmsg = txt.value
      const data = JSON.stringify(rawdata);
      alert("Confirmed")
      window.location.reload()
      fetch(`/load/declineSched?data=${encodeURIComponent(data)}`)
      .then(response => response.json())
        .then(data => {
     
          if (data.success == true) {

            
          }
        })
        .catch(err => {
          console.error('Error fetching notification data:', err);

        })
    } else {
      yesORnoModal.hide()
        
      document.querySelectorAll(".mod_item").forEach(item => {
        item.style.display = "none";
      });

    }
  }else{
   
    document.getElementById("resched_status").value=rawdata.id

  reSched(rawdata)
  }
}

 function  reSched(rawdata) {
  document.getElementById('target_id').value=rawdata.scheduler
  sched_shower()
}



const confirmBtn = document.getElementById("confirmbtn");
const cancelBtn = document.getElementById("cancelbtn");
function waitForConfirmation() {
  return new Promise(resolve => {
    confirmBtn.addEventListener("click", () => {

      resolve(true); // Resolve with true when the button is clicked
    });
    cancelBtn.addEventListener("click", () => {
      resolve(false); // Resolve with true when the button is clicked
    });
  });
}

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
function yesORno() {
  return new Promise(resolve => {
    yesBtn.addEventListener("click", () => {
      resolve(true); // Resolve with true when the button is clicked
  });
  noBtn.addEventListener("click", () => {
      resolve(false); // Resolve with true when the button is clicked
     });
  })
}



document.getElementById("ScheduleCreatorForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch("/createSchedule", {
    method: "POST",
    body: formData,
  }).then(response => response.json())
    .then(data => {
      if (data.status == true) {
        if(document.getElementById("resched_status").value != ""){
          alert("Rescheduled Successfully")
        }else{
        alert("Schedule Successfully Added")}
        window.location.reload();
      }else{
        alert("Sorry it seems that someone has already scheduled this time a second ago please try another slot. Thank you for understanding")
      }
    }).catch((err) => {
      console.log(err);
    })
});
document.getElementById("target_id").addEventListener("input", function (e) {
  document.getElementById("forNameSearch").value=''
  const target=document.getElementById("target_id").value;

  fetch(`/load/create_suggestion?target=${target}`).then(response=>response.json()).then(data=>{
    const list=document.getElementById("list_id_number")
    list.innerHTML=""
    console.table(data.results)
    data.results.forEach(fragment=>{
  const opt=document.createElement("option")
  console.log(data.type+"dasd")
 
  opt.value=fragment.id_number
  opt.textContent=`${fragment.last}, ${fragment.first}`



  list.appendChild(opt)

    })
  }).catch(err=>{
    console.log(err);
  })
})
function formatTime(time) { 
  const [hours, minutes, seconds] = time.split(':');
   let period; 
  if (hours >= 1 && hours < 6) {
     period = 'PM';
     } 
else if (hours >= 8 && hours < 12) { 
  period = 'AM'; 
} 
else if (hours == 12) { 
  period = 'PM';
 } else { 
  period = hours >= 12 ? 'PM' : 'AM'; 
}
 const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`; 
}

function dateDifference(dateStr, date2) { 
  const [yy, mm, dd] = dateStr.split('-');
  const date1=new Date(yy,mm-1,dd);
  const diffTime = date1 - date2
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
   const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);
  return { days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds  
  };
 }

