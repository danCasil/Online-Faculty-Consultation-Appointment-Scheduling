var ids=[];
const mainPrint=document.getElementById("mainPrint");
mainPrint.disabled=true;

function checkbxClicked(value,id){
  if(ids.length>0){
    mainPrint.disabled=false;
  }
  if(value==true){
    ids.push({id:id});
  }else{
    const itemIndex = ids.findIndex(item => item.id === id); // Find index of the object with the matching id
    if (itemIndex > -1) {
        ids.splice(itemIndex, 1); // Remove the object from the array
    }
  }
  console.table(ids);
}

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
    Targetcollege=college;
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
      // Create a wrapper div for form control and checkbox (acts as the button)
      const form_control = document.createElement("div");
      form_control.style.marginTop = "2.5px";
      form_control.style.display = "flex"; // Use flexbox for layout
      form_control.style.alignItems = "center"; // Align checkbox and text vertically
      form_control.style.justifyContent = "start"; // Align checkbox and text inside the button
      form_control.classList.add("form-control", "mybtn");
  
      // Attach the show() function to the button click
      form_control.onclick = () => show(element.id_number);
  
      // Create the column div
      const col_sm = document.createElement("div");
      col_sm.classList.add("col-sm-3");
  
      // Create and style the checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.marginRight = "10px"; // Adjust spacing between checkbox and text
      checkbox.style.cursor = "pointer";
  
      // Prevent the button click when the checkbox is clicked
      checkbox.addEventListener("click",function(e){ 
        checkbxClicked(this.checked, element.id_number, element.index)
        e.stopPropagation()
      })
  
      // Add unique ID or name for the checkbox if needed
      checkbox.id = `checkbox-${element.id_number}`;
      checkbox.name = `select-${element.id_number}`;
  
      // Add text content inside the button
      const textContent = document.createElement("span");
      textContent.innerHTML = `${element.id_number} <br> ${element.last}, ${element.first}`;
      checkbox.style.transform = "scale(1)"; // Makes the checkbox 2x larger
      checkbox.style.width = "25px"; // Explicit width
      checkbox.style.height = "25px"; // Explicit height
      // Append checkbox and text content to the button
      form_control.appendChild(checkbox); // Checkbox inside the button
      form_control.appendChild(textContent);
  
      // Append everything to the column div and row
      col_sm.appendChild(form_control);
      row.appendChild(col_sm);
  });
  
  
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
<button type=button id="back" class="form-control btn-primary" onclick="showThis(1)"><img src="../img/Back.png" class="mybtn-icon" alt="">Back</button>
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
  getSem()
    showThis(3)
    forDate.show()
  }
})
function getSem(){
  fetch("/getSem")
  .then(response=>response.json())
  .then(data=>{
    const holder=document.getElementById("sem-holder")
    holder.innerHTML=""
    data.sem.forEach(item=>{
    const row=document.createElement("div")
    const control=document.createElement("button")
    control.textContent=item.sem_name
    control.type="button"
    control.classList.add("form-control")
    row.style.marginBottom="5px"
    row.classList.add("row")
    row.onclick=()=>{
      graph(item.sem_id)
    }
    row.appendChild(control)
    holder.appendChild(row)
  })
  }).catch(err=>{
    console.log("err")
  })
}
function graph(id){
 
   document.getElementById("ofcasLoad").style.display = ""


       s3.innerHTML+=`<button type="button" id="back"class="form-control btn-primary" onclick="showThis(1)">
       <img src="../img/Back.png" class="mybtn-icon" alt="">Back
       </button>`;


  fetch(`/load/graphdata?id=${id}`).then(response=>response.json()).then(data=>{
    document.getElementById("ofcasLoad").style.display = "none"

    createGraph(data.yroles,data.xroles,data.xValues, data.yValues,data.sem_name,data.count2)
 document.getElementById("ofcasLoad").style.display = "none"
  }).catch(err=>{
    console.log(err)
  })
}
document.getElementById("logout").addEventListener("click",(e)=>{

  fetch("/dean_logout").then(response=>response.json()).then((data)=>{
if(data.logout==true){
  window.location.href="/"
}
  }).catch(err=>{

  })
})


function createGraph(yroles,xroles,xValues, yValues,sem_name,count2){
  
  const barColors = [];
  if(xValues.length == 0){
  xValues=["No Record"]
  yValues=[1]
  barColors.push("Gray")
  }else{
  forDate.hide()

  xValues.forEach(x=>{

    switch(x){
      case "consulted":
        barColors.push("green")
        break
      case "missed":
        barColors.push("red")
        break
      case "declined":
        barColors.push("blue")
        break
      case "cancelled":
        barColors.push("orange")
        break
    }
   
  })
}
  new Chart("myChart", {
    type: "pie",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
            
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' 
            },
            title: {
                display: true,
                text: `${sem_name} Consultation Status`,
                font: {
                    size: 18,
                    weight: 'bold'
                }
            }
        }
    }
});

new Chart("myCharts", {
  type: "pie",
  data: {
      labels: xroles,
      datasets: [{
          backgroundColor: ["green","blue"],
          data: yroles
          
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: {
              display: true,
              position: 'top' 
          },
          title: {
              display: true,
              text: `Student and Teacher Engagement for this Month`,
              font: {
                  size: 18,
                  weight: 'bold'
              }
          }
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
const sorted=document.getElementById("sorter")
const ordered=document.getElementById("order")
sorted.addEventListener("change", (e)=>{
  sorter(e.target.value,ordered.value)
})
ordered.addEventListener("change", (e)=>{

  sorter(sorted.value,e.target.value)
})
function sorter(a,b){
console.log(a+""+b)
fetch(`/sort?param1=${a}&&param2=${b}`)
.then(response=>response.json())
.then(respo=>{

}).catch(err=>{

})
}
function print(){
  const jsonString = JSON.stringify(ids);
  
    fetch(`/createPDF?idNum=${jsonString}`).then(response=>response.json()).then(data=>{

    }).catch(err=>{

    })
}
