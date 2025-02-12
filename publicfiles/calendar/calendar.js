

const calendar = document.getElementById('calendar-body');
const makeSched=new bootstrap.Modal(document.getElementById("makeSched"))
const calendarnav=document.getElementById("calendar-nav");
const mycalendar=document.getElementById("calendarMain");
const btnSched=document.getElementById("schedule_maker");
const ScheduleCreatorForm=document.getElementById("ScheduleCreatorForm");
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months=["January","February","March","April","May","June","July","August","September","October","November","December"]
let target_name;

const chedHolidays = [
  { month: 1, date: 1, name: "New Year's Day" },
  { month: 4, date: 9, name: "Araw ng Kagitingan" },
  { month: 5, date: 1, name: "Labor Day" },
  { month: 6, date: 12, name: "Independence Day" },
  { month: 8, date: "last Monday", name: "National Heroes Day" },
  { month: 11, date: 30, name: "Bonifacio Day" },
  { month: 12, date: 25, name: "Christmas Day" },
  { month: 12, date: 30, name: "Rizal Day" },
  { month: "movable", date: "movable", name: "Maundy Thursday" },
  { month: "movable", date: "movable", name: "Good Friday" },
  { month: "movable", date: "movable", name: "Chinese New Year" },
  { month: "movable", date: "movable", name: "Eid'l Fitr" },
  { month: "movable", date: "movable", name: "Eid'l Adha" },

];

//sql query
/*INSERT INTO chedHolidays (month, date, name) VALUES
(1, '1', 'New Year\'s Day'),
(4, '9', 'Araw ng Kagitingan'),
(5, '1', 'Labor Day'),
(6, '12', 'Independence Day'),
(8, 'last Monday', 'National Heroes Day'),
(11, '30', 'Bonifacio Day'),
(12, '25', 'Christmas Day'),
(12, '30', 'Rizal Day'),
('movable', 'movable', 'Maundy Thursday'),
('movable', 'movable', 'Good Friday'),
('movable', 'movable', 'Chinese New Year'),
('movable', 'movable', 'Eid\'l Fitr'),
('movable', 'movable', 'Eid\'l Adha'),
(9, '20', 'eyy');*/


const today = new Date();
const current=new Date(today.getFullYear() + today.getMonth(),1);

let currentMonth=today.getMonth();
let currentYear=today.getFullYear();


function generateCalendar(year, month, target) {
  calendar.innerHTML = ''; // Clear previous +

const datecurrent=document.getElementById("datecurrent")

  // Calculate the first day of the month
  const firstDay = new Date(year, month, 1).getDay();

  calendar.innerHTML += `<div class="calendar-head">Sun</div>
                           <div class="calendar-head">Mon</div>
                           <div class="calendar-head">Tue</div>
                           <div class="calendar-head">Wed</div>
                           <div class="calendar-head">Thu</div>
                           <div class="calendar-head">Fri</div>
                           <div class="calendar-head">Sat</div>`;
                           //mag fifill ng walang karga sa day ngcalendar
for(let i=0; i<firstDay;i++){
calendar.innerHTML+="<div></div>"
}
//mag fifill ng calendar

const currentDate=today.getDate()
let Daynumber;
for(let i=1; i<=daysInMonth[month];i++){
  if(currentDate===i&&today.getMonth()===month&&today.getFullYear()===year){
    Daynumber=new Date(year, month, i).getDay();
    if(Daynumber==0||Daynumber==6){
      calendar.innerHTML+=`<button class="day present weekend"id="date${i}">${i}</button>` 
    }else{
      calendar.innerHTML+=`<button class="day present"id="date${i}">${i}</button>`   
    }
   
  }else if(i<currentDate&&(month<=today.getMonth())){
   
     calendar.innerHTML+=`<button  class="day past"id="date${i}">${i}</button>`  
  }else{
    Daynumber=new Date(year, month, i).getDay();
    if(Daynumber==0||Daynumber==6){
      calendar.innerHTML+=`<button class="day future weekend " id="date${i}">${i}</button>` 
    }else{
      calendar.innerHTML+=`<button class="day " id="date${i}">${i}</button>`   
    } 
   
  } 
   Daynumber=new Date(year, month, i).getDay();
   const parameter={
    day: Daynumber,
    target_id:target,
    year:year
   }

  updateCaLendardata(i,month,parameter)
}
}
function getAMorPM() {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 12 ? 'PM' : 'AM';
}
 function updateCaLendardata(date,month,parameter){
  document.getElementById("ofcasLoad").style.display=""
  fetch(`/load/available?year=${parameter.year}&date=${date}&month=${month}&day=${parameter.day}&target_id=${parameter.target_id}`).then(response=>response.json()).then(async data=>{
    
if(daysInMonth[month]==date){
  
  document.getElementById("ofcasLoad").style.display="none"
}  responsive()
   const events=[{
      name:'founding Aniversary',
      date:25,      
      month:9,
    },{
      name:'founding Aniversary',
      date:26,
      month:9,
    }]
    let holiday=false,event=false,holitxt,eventtxt

  const datebtn=document.getElementById(`date${date}`)
  const container=document.createElement("div")


  chedHolidays.forEach(noClass=>{
  if(noClass.date==date&&noClass.month==month+1){
    holiday=true
    holitxt=noClass.name
  }
})
  events.forEach(schoolEvent=>{
    if(schoolEvent.date==date&&schoolEvent.month==month+1){
      event=true
      eventtxt=schoolEvent.name
    }
  })
let avtxt =0
if(data.slot){
  avtxt=data.slot
}else{
  avtxt=0
}

if(holiday==true){
    container.title=holitxt
    datebtn.classList.toggle("holiday")
}else if(event==true){
  container.title=eventtxt
  datebtn.classList.toggle("event")
}else if(data.status==true){

  if(month==today.getMonth()&&((today.getDate()==date)  ) ){
   
console.log(month+"/"+parameter.year+"/"+date +"//"+today.getDate())


const numSlot=data.slot

for (let i = 0; i < data.Allin.length; i++) {

  const diff = await dateDifference(`${parameter.year}-${month}-${date}`, new Date(), timeIN.timein)


if(diff.hours<2){

  numSlot=numSlot-1
}

 };
 alert(numSlot)
 if(numSlot==0){
  container.textContent="" 
 }else{
 container.textContent=`${numSlot} slot`
 datebtn.classList.toggle("available")
 datebtn.onclick=()=>SeeAvailableTime(date,month,parameter.day,parameter.target_id,parameter.year)
 }

}
 else if(month>today.getMonth()|| (today.getDate()<date)){
  container.textContent=`${avtxt} slot`
  datebtn.classList.toggle("available")
  datebtn.onclick=()=>SeeAvailableTime(date,month,parameter.day,parameter.target_id,parameter.year)
 }else if(parameter.year>today.getFullYear()){
  container.textContent=`${avtxt} slot`
  datebtn.classList.toggle("available")
  datebtn.onclick=()=>SeeAvailableTime(date,month,parameter.day,parameter.target_id,parameter.year)
 }
}else{
  container.textContent="" 

}

  container.classList.add("container-fluid")
  
  


datebtn.appendChild(container)

  }).catch((err)=>{
      console.log(err)
    })

}
function checkforopenslots(){
  
}




const myModal = new bootstrap.Modal(document.getElementById("AvailableTimeModal"));



 function SeeAvailableTime(date,month,day,target_id,year){

const rawdata={
  date:date,month:month,day:day,target_id:target_id,year:year
}

const data = JSON.stringify(rawdata);
fetch(`/load/availabletime?data=${encodeURIComponent(data)}`).then(response=>response.json()).then(data=>{
  const TimeContainer=document.getElementById("FacultyTimeContainer")   

  TimeContainer.innerHTML=""
   target_name=`${data.result2[0].last},${data.result2[0].first} ${data.result2[0].mid}`
   console.table(data.result3)
   console.log(data.result1)
  data.result1.forEach(element=>{
    console.log(element)
  if(data.result3.length>0) {
  
    data.result3.forEach(checker =>{
      if((element.day==day)&&(element.timein!=checker.time_in&&element.timeout!=checker.time_out)){
        btncreator(element,rawdata)
      
 }
})
}else{
  if(element.day==day){
 btncreator(element,rawdata)
}
}
})

  myModal.show()
}).catch((err)=>{
  console.log(err)
})

}
function btncreator(element,rawdata){
  const TimeContainer=document.getElementById("FacultyTimeContainer")   

  rawdata.timein=element.timein
  rawdata.timeout=element.timeout
  const data = JSON.stringify(rawdata);
fetch(`/load/conflict?data=${encodeURIComponent(data)}`).then((response)=>response.json()).then(data=>{

  
  const row=document.createElement("div")
  row.classList.add("row")
  const btn=document.createElement("button")
    const datas={
      timeidx:element.indx,
      timein:element.timein,
      timeout:element.timeout,
      month:rawdata.month+1,
      year:rawdata.year,
      date:rawdata.date,
    }
btn.classList.add("timeAvailable")

if(data.isConflict){
  btn.onclick=()=>conflict(element.indx,data.sched)
}else{
  btn.onclick=()=>setTime(datas)
}

  const Tin = element.timein;
  const Tout=element.timeout
  const formattedTimeIn = convertToAMPM(Tin,'in');
  const formattedTimeOut = convertToAMPM(Tout,'out');
  btn.id=`time${element.indx}`
btn.classList.add("btnTime")
  btn.textContent=`${formattedTimeIn} - ${formattedTimeOut}`
  row.appendChild(btn)
  TimeContainer.appendChild(row)

}).catch(err=>{
  console.error(err)
})
}
function conflict(id,data){
 
  const btn = document.getElementById(`time${id}`);

if(data.length==1){
  const midInit = data[0].mid.charAt(0);
      btn.textContent = `Conflict with your schedule with ${data[0].last}, ${data[0].first} ${midInit}.`;
    }else{
      btn.textContent = `Conflict with your schedule.`; 
    }
 
            
      }



function convertToAMPM(time,txt) { const [hours, minutes, seconds] = time.split(':'); let period; if (hours >= 1 && hours < 6) { period = 'PM'; } else if (hours >= 8 && hours < 12) { period = 'AM'; } else if (hours == 12) { period = 'PM'; } else { period = hours >= 12 ? 'PM' : 'AM'; } const formattedHours = hours % 12 || 12; return `${formattedHours}:${minutes} ${period}`; }
let timeidx,timein,timeout,month,year,date;

function setTime(datas){
 timeidx = datas.timeidx
 timein=datas.timein
 timeout = datas.timeout
 month = datas.month
 year = datas.year
 date = datas.date
 const selected=document.querySelectorAll(".btnTime")
 selected.forEach(el=>{
if(el.classList.contains("selected-time")){
  el.classList.remove("selected-time")
}
 })
  const btn=document.getElementById(`time${timeidx}`)
  btn.classList.add("selected-time")
 document.getElementById("submitscheduletime").disabled = false

}

function closeremove(){
  document.getElementById("submitscheduletime").disabled = true

}

function ScheduleTime()
{
  let time=document.getElementsByClassName("selected-time")[0].textContent
  const confirmation=confirm(`Are you sure on selected time ${time}`)

if(confirmation){
  myModal.hide()
 showThis(2)
  document.getElementById("PreferredDate").value = `${year}-${month}-${date}`
  document.getElementById("ScheduledNAME").value = target_name
 document.getElementById("ScheduledID").value = document.getElementById("target_id").value
 document.getElementById("PreferredTout").value = timeout
 document.getElementById("PreferredTin").value = timein
}

}
let isTrue=false
btnSched.addEventListener("click", function(){

  makeSched.show()
if(window.innerWidth>500){
document.getElementById("sidenavbar").style.zIndex=1
}
})

const monthtitle=document.getElementById("monthtitle") 
 const prv=document.getElementById("prev")
 const nxt=document.getElementById("next")
// Generate the initial calendar

document.addEventListener("DOMContentLoaded", function() {
  element('section2').style.display="none"
   element('section3').style.display="none"
  document.getElementById("submitscheduletime").disabled = true


});
function element(id){
  return document.getElementById(id)
}
function showThis(section){
for(let i=1;i<=3;i++){
  if(section==i){
  element(`section${i}`).style.display=""
  }else{
 element(`section${i}`).style.display="none"
  }
  console.log(`section${i}`)
}
}
const available=document.getElementById("availability")
available.addEventListener("click", function() {
makeSched.hide()
  sched_shower()
})

async function sched_shower(){
  let target

 if(element("forNameSearch").value!=""){
target=element("forNameSearch").value
 }else{
    target=document.getElementById("target_id").value; }
await fetch(`/check/id_number/${target}`).then(response=>response.json()).then(data=>{
 

  if(data.idL==1&&data.timeL>0){
    monthtitle.textContent=months[currentMonth]+" "+currentYear
    generateCalendar(currentYear,currentMonth,target);
    showThis(3)
  }else if(data.idL==0){
    alert("INVALID ID")
  }else{
    alert("NO AVAILABLE TIME")
  }
}).catch(err=>{
  console.log("Retrieve Data ERROR")
})
}


function prevWeekBtn() {
  const target=document.getElementById("target_id").value;
  currentMonth--;
  if(currentMonth<0){
    currentYear--
    currentMonth=11;
    generateCalendar(currentYear,currentMonth, target);
  }else{
     generateCalendar(currentYear,currentMonth, target);

  }  
monthtitle.textContent=months[currentMonth]+" "+currentYear
  
};

function nextWeekBtn ()  {
  const target=document.getElementById("target_id").value;
  currentMonth++;
  if(currentMonth==12){
    currentYear++
    currentMonth=0;
    generateCalendar(currentYear,currentMonth, target);
  }else{
     generateCalendar(currentYear,currentMonth, target);
  }  
  monthtitle.textContent=months[currentMonth]+" "+currentYear
};

