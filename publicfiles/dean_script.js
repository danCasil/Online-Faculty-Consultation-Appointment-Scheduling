 document.getElementById("ofcasLoad").style.display = ""
const collegeNameList={
  CCSICT:'College of Computing Studies, Information and Communication Technology',
  CAS:'College of Arts and Sciences',
  CED:"College of Education",
  CCJE:"College of Criminal Justice Education"}
const facultydetail=document.getElementById("facultydetail")
const container=document.getElementById("facultyList")

const showgraph=document.getElementById("showgraph")
const s1=document.getElementById("section1")
const s2=document.getElementById("section2")
const s3=document.getElementById("section3")
document.addEventListener("DOMContentLoaded",function(e){
  
  showThis(1)
    getfaculty()
 
    
})
function getfaculty(){
   document.getElementById("ofcasLoad").style.display = ""
   fetch("/getfaculty").then(response=>response.json()).then(data=>{
      document.getElementById("ofcasLoad").style.display = "none"
    const college=data.result[0].college
    switch(college){
      case "CCSICT":
        document.getElementById("collegeName").textContent=collegeNameList.CCSICT
        break;
      case "CED":
        document.getElementById("collegeName").textContent=collegeNameList.CED
        break;
      case "CAS":
        document.getElementById("collegeName").textContent=collegeNameList.CAS
        break;
      case "CCJE":
        document.getElementById("collegeName").textContent=collegeNameList.CAS
        break;
    }
  
 
         const row=document.createElement("div")
         row.classList.add("row")
  //for(let i=0;i<20;i++){    
      data.result.forEach(element => {
        const form_control=document.createElement("div")
        form_control.style.marginTop="2.5px"
      const col_sm=document.createElement("div")
      col_sm.classList.add("col-sm-3")
      col_sm.onclick=()=>show(element.id_number)
      form_control.classList.add("form-control","mybtn")
   
      form_control.innerHTML=` ${element.id_number} <br> ${element.last}, ${element.first}`
      col_sm.appendChild(form_control)
      row.appendChild(col_sm)

    })
   //}

container.appendChild(row)
     })
   }
function showThis(id){

for(let i=1;i<=3;i++){

  if(id==i){
    document.getElementById(`section${i}`).style.display=""
    
  }else{
    document.getElementById(`section${i}`).style.display="none"
  }
}
}

function show(id){
 showThis(2)
    
  document.getElementById("ofcasLoad").style.display = ""
fetch(`/load/record?id=${id}`).then(response=>response.json()).then(data=>{
     document.getElementById("ofcasLoad").style.display = "none"
  console.table(data)
const countdata=data.counts
const userD=data.user_data[0]

facultydetail.innerHTML=`<div class="row" style="margin-top:30px;width:55%">
<h5>${userD.last}, ${userD.first} ${userD.mid}</h5>
<h6 id="id_holder">${userD.id_number}</h6>
</div>
<hr>
<div class="row">
<div class="col-sm-6">
<div class="row" >
<div class="col-6"><input type="checkbox" style="display:inline"checked id="co"onclick="filterData()"><h6 style="display:inline">Consulted</h6>
  <div id="consulted">
${countdata.consulted}
  </div>
</div>

<div class="col-6">
<input type="checkbox" style="display:inline" checked id="ca"onclick="filterData()"><h6 style="display:inline">Cancelled</h6>
  <div id="cancelled">
${countdata.cancelled}
  </div>
</div>
</div>
</div>

<div class="col-sm-6">
<div class="row">
<div class="col-6"><input type="checkbox" style="display:inline"checked id="de"onclick="filterData()"><h6 style="display:inline">Declined</h6>
<div id="declined">
${countdata.declined}
</div>
</div>
      <div class="col-6">
        <input type="checkbox" style="display:inline"checked id="mi"onclick="filterData()"><h6                 style="display:inline">Missed</h6>
        <div id="missed">
            ${countdata.missed}
        </div>
      </div>
    </div>
  </div>
</div></div>
<hr>
<div class="container-fluid">
<div  id="studentList">
<div class="row" style="position: sticky;top: 0;backdrop-filter: blur(5px);font-weight:bold">
  <div class="col-3">
    Name
  </div>
  <div class="col-3">
   Purpose
  </div>
   <div class="col-3">
    Consulted Date
  </div>
  <div class="col-3" >
    Remark
  </div>
</div>
<div id="LIST">

</div>
</div>

</div>
<button type=button id="back" class="form-control btn-primary" onclick="showThis(1)"><img src="../img/Back.png" class="mybtn-icon" alt="">back</button>
`
const studentList=document.getElementById("LIST")

data.studentdata.forEach(element=>{
  const row=document.createElement("div")
  const row2=document.createElement("div")
  row2.style.fontSize="13.5px"
  row2.style.fontWeight="500"
  const formC=document.createElement("div")
  row.classList.add("row")
  row2.classList.add("row")
  row.style.marginTop="5px"
  formC.classList.add("form-control")
  const name=document.createElement("div")
  name.classList.add("col-3")
  const purpose=document.createElement("div")
  purpose.classList.add("col-3")
  const date=document.createElement("div")
  date.classList.add("col-3")
  const remark=document.createElement("div")
  remark.classList.add("col-3")
  var word = element.type
   var firstLetter = word.charAt(0).toUpperCase();
    var restOfWord = word.slice(1);
  remark.textContent=`${firstLetter}${restOfWord}`
  const dandtROW=document.createElement("div")
  dandtROW.classList.add("row")
 

  const d=document.createElement("div")
  d.classList.add("col-sm-6")
  const t=document.createElement("div")
  t.classList.add("col-sm-6")
  purpose.textContent=element.consultation_purpose
d.textContent=dateFormat(element.consulted_date)
t.textContent= `${convertTime((element.consulted_time_in))} - ${convertTime((element.consulted_time_out))}`
dandtROW.appendChild(d)
dandtROW.appendChild(t)
  date.appendChild(dandtROW)
  name.textContent=`${element.last}, ${element.first} ${element.mid}`

  row2.appendChild(name)
  row2.appendChild(purpose)
  row2.appendChild(date)
  row2.appendChild(remark)
  formC.appendChild(row2)
  row.appendChild(formC)
  studentList.appendChild(row)
})}
).catch((err)=>{
   console.log(err)
})
}
var myModalEl = document.getElementById('forDate');
var forDate =new bootstrap.Modal(myModalEl,{backdrop: 'static', keyboard: false});

showgraph.addEventListener("click",(e)=>{
  if(showgraph.textContent=='Back'){
    showgraph.onclick=window.location.reload()
  }else{
  
    showThis(3)
    forDate.show()
  }
})
function graph(){
  const date1=document.getElementById("date1").value
  const date2=document.getElementById("date2").value
  if((date1&&date2!=null)&&(date1<date2)){
    forDate.hide()

   document.getElementById("ofcasLoad").style.display = ""


       s3.innerHTML+=`<button type="button" id="back"class="form-control btn-primary" onclick="showThis(1)">
       <img src="../img/Back.png" class="mybtn-icon" alt="">back
       </button>`;
const dates={
  d1:date1,
  d2:date2
}
const toString=JSON.stringify(dates)
  fetch(`/load/graphdata?dates=${toString}`).then(response=>response.json()).then(data=>{
    
    createGraph(data.xValues, data.yValues,data.dates)
 document.getElementById("ofcasLoad").style.display = "none"
  }).catch(err=>{
    console.log(err)
  })
}else{
  alert("Invalid Date")
}
}
document.getElementById("logout").addEventListener("click",(e)=>{

  fetch("/dean_logout").then(response=>response.json()).then((data)=>{
if(data.logout==true){
  window.location.href="/secret"
}
  }).catch(err=>{

  })
})


function createGraph(xValues, yValues,dates){
 
  const btnFROM=document.createElement("input")
  const btnTo=document.createElement("input")
  btnFROM.type="date"
  btnFROM.id="FROMID"
  btnFROM.classList.add("form-control")

  const date1 = new Date(  dates.d1); 
  const options = { month: 'short' };
   const monthName1 = new Intl.DateTimeFormat('en-US', options).format(date1); 
   const formattedDate1 = `${monthName1} ${date1.getDate()}, ${date1.getFullYear()}`
   const date2 = new Date(dates.d2); 
     const monthName2 = new Intl.DateTimeFormat('en-US', options).format(date2); 
    const formattedDate2 = `${monthName2} ${date2.getDate()}, ${date2.getFullYear()}`
  const barColors = ["red", "green","blue","orange","brown"];
  
  new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      legend: {display: false},
      title: {
        display: true,
        text: `Faculty Consultation Activity: Number of Consultations per Faculty Member from ${formattedDate1} to ${formattedDate2}`
      },
      scales: {
        xAxes: [{ 
          scaleLabel: { 
          display: true, 
          labelString: 'Faculty Members',
           fontWeight: 'bolder', 
            fontSize: 14,
            fontColor: "#375623 ",
           },
            ticks: { 
              autoSkip: false 
            } }],
          yAxes: [{
          ticks: {
            beginAtZero: true,  
            callback: function(value) {
              if (value % 1 === 0) {
                return value;
              }
              return '';  // Don't display non-whole numbers
            }
          }, scaleLabel: { 
            display: true, 
            labelString: 'Number of Consultations',
            fontWeight: "bold",
            fontSize: 14,
            fontColor:"#375623 "
          
          }
        }]

      }
      
      
    }
  });
}

function filterData(){
  
const checkbox={
dec:  getE('de').checked,
can:getE('ca').checked,
con:getE('co').checked,
mis:getE('mi').checked,
id:id_holder.textContent
}
const check =JSON.stringify(checkbox);
fetch(`/filter/data?checkbox=${check}`)
.then(response=>response.json())
.then(data=>{
  const studentList=document.getElementById("LIST")
  studentList.innerHTML="";
  data.filtered.forEach(element=>{
    const row=document.createElement("div")
    const row2=document.createElement("div")
    row2.style.fontSize="13.5px"
    row2.style.fontWeight="500"
    const formC=document.createElement("div")
    row.classList.add("row")
    row2.classList.add("row")
    row.style.marginTop="5px"
    formC.classList.add("form-control")
    const name=document.createElement("div")
    name.classList.add("col-3")
    const purpose=document.createElement("div")
    purpose.classList.add("col-3")
    const date=document.createElement("div")
    date.classList.add("col-3")
    const remark=document.createElement("div")
    remark.classList.add("col-3")
    var word = element.type
     var firstLetter = word.charAt(0).toUpperCase();
      var restOfWord = word.slice(1);
    remark.textContent=`${firstLetter}${restOfWord}`
    const dandtROW=document.createElement("div")
    dandtROW.classList.add("row")
   
  
    const d=document.createElement("div")
    d.classList.add("col-sm-6")
    const t=document.createElement("div")
    t.classList.add("col-sm-6")
    purpose.textContent=element.consultation_purpose
  d.textContent=dateFormat(element.consulted_date)
  t.textContent= `${convertTime((element.consulted_time_in))} - ${convertTime((element.consulted_time_out))}`
  dandtROW.appendChild(d)
  dandtROW.appendChild(t)
    date.appendChild(dandtROW)
    name.textContent=`${element.last}, ${element.first} ${element.mid}`
  
    row2.appendChild(name)
    row2.appendChild(purpose)
    row2.appendChild(date)
    row2.appendChild(remark)
    formC.appendChild(row2)
    row.appendChild(formC)
    studentList.appendChild(row)
  })
}).catch(err=>{
  console.log(err);
})
}
function getE(id){
 return document.getElementById(id)
}
function convertTime(time) { // Split the time string into hours, minutes, and seconds 
  let [hours, minutes, seconds] = time.split(':'); // Convert hours to a number
   hours = parseInt(hours);
   let suffix 
   if(hours>7){
    suffix= 'AM'
  } 
    else{
      suffix= 'PM'} 
    
     return `${hours}:${minutes} ${suffix}`; }

function dateFormat(date){

const [year, month, day] = date.split("-");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formattedDate = `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;

return formattedDate

}
