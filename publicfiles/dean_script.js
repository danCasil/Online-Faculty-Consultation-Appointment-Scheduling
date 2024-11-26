
const collegeNameList={
  CCSICT:'College of Computing Studies, Information and Communication Technology',
  CAS:'College of Arts and Sciences',
  CED:"College of Education",
  CCJE:"College of Criminal Justice Education"}
const facultydetail=document.getElementById("facultydetail")
const container=document.getElementById("facultyList")
const showgraph=document.getElementById("showgraph")
document.addEventListener("DOMContentLoaded",function(e){
      facultydetail.style.display="none"
    getfaculty()
})
function getfaculty(){
   fetch("/getfaculty").then(response=>response.json()).then(data=>{
        document.getElementById("collegeName").textContent="College of Computing Studies, Information and Communication Technology"
    document.getElementById("collegeName").style.display=""
         const row=document.createElement("div")
         row.classList.add("row")
  for(let i=0;i<20;i++){    
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
   }

container.appendChild(row)
     })
   }


function show(id){
   container.style.display="none"
   showgraph.style.display="none"
      facultydetail.style.display=""
 
fetch(`/load/record?id=${id}`).then(response=>response.json()).then(data=>{
  console.table(data)
const countdata=data.counts
const userD=data.user_data[0]
document.getElementById("collegeName").style.display="none"
facultydetail.innerHTML=`<div class="row" style="margin-top:30px;width:55%">
<h5>${userD.last}, ${userD.first} ${userD.mid}</h5>
<h6>${userD.id_number}</h6>
</div>
<hr>
<div class="row">
<div class="col-3">
  <h6>Consulted</h6>
  <div id="consulted">
${countdata.consulted}
  </div>
</div>

<div class="col-3">
  <h6>Cancelled</h6>
  <div id="cancelled">
${countdata.cancelled}
  </div>
</div>
<div class="col-3">
<h6>Declined</h6>
<div id="declined">
${countdata.declined}
</div>
</div>
<div class="col-3">
<h6>Missed</h6>
<div id="missed">
${countdata.missed}
</div>
</div>
</div>
<hr>
<div class="container-fluid">
<div  id="studentList">
<div class="row" style="position: sticky;top: 0;backdrop-filter: blur(5px);">
  <div class="col-4">
    Name
  </div>
  <div class="col-4">
   Purpose
  </div>
   <div class="col-4">
    Consulted Date
  </div>
</div>
</div>
</div>
<button type=button id="back" class="form-control btn-primary" onclick="window.location.reload()"><img src="../img/Back.png" class="mybtn-icon" alt="">back</button>
`
const studentList=document.getElementById("studentList")

data.studentdata.forEach(element=>{
  const row=document.createElement("div")
  const row2=document.createElement("div")
  const formC=document.createElement("div")
  row.classList.add("row")
  row2.classList.add("row")
  row.style.marginTop="5px"
  formC.classList.add("form-control")
  const name=document.createElement("div")
  name.classList.add("col-4")
  const purpose=document.createElement("div")
  purpose.classList.add("col-4")
  const date=document.createElement("div")
  date.classList.add("col-4")
  const D=new Date(element.consulted_date)
  const dd=D.getDate()
  const mm=D.getMonth()+1
  const yyyy=D.getFullYear()
  purpose.textContent=element.consultation_purpose
  date.textContent=` ${convertTime((element.consulted_time_in))} - ${convertTime((element.consulted_time_out))} ${dd}-${mm}-${yyyy} `
  name.textContent=`${element.last}, ${element.first} ${element.mid}`
  row2.appendChild(name)
  row2.appendChild(purpose)
  row2.appendChild(date)
  formC.appendChild(row2)
  row.appendChild(formC)
  studentList.appendChild(row)
})}
).catch((err)=>{
   console.log(err)
})
}

showgraph.addEventListener("click",(e)=>{
  if(showgraph.textContent=='Back'){
    showgraph.onclick=window.location.reload()
  }else{
    graph()
  }
})
function graph(){
  showgraph.textContent="Back"

     container.style.display="none"
  fetch('/load/graphdata').then(response=>response.json()).then(data=>{
    createGraph(data.xValues, data.yValues)

  }).catch(err=>{
    console.log(err)
  })
}
document.getElementById("logout").addEventListener("click",(e)=>{

  fetch("/dean_logout").then(response=>response.json()).then((data)=>{
if(data.logout==true){
  window.location.href="/secret"
}
  }).catch(err=>{

  })
})

function createGraph(xValues, yValues){
  const btnFROM=document.createElement("input")
  const btnTo=document.createElement("input")
  btnFROM.type="date"
  btnFROM.id="FROMID"
  btnFROM.classList.add("form-control")


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
        text: "Consultation Frequency by CCSICT Faculty"
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,  
            callback: function(value) {
              if (value % 1 === 0) {
                return value;
              }
              return '';  // Don't display non-whole numbers
            }
          }
        }]
      }
      
      
    }
  });
}


function convertTime(time) { // Split the time string into hours, minutes, and seconds 
  let [hours, minutes, seconds] = time.split(':'); // Convert hours to a number
   hours = parseInt(hours); // Determine AM or PM suffix
    const suffix = hours >= 12 ? 'PM' : 'AM'; // Adjust hours for 12-hour format
     hours = hours % 12 || 12; // Return the formatted time 
     return `${hours}:${minutes} ${suffix}`; }