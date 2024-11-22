

 document.addEventListener('DOMContentLoaded', function (e) {
  document.getElementById("removebutt").disabled=true
    document.getElementById("ofcasLoad").style.display = ""
    getsched()
  })
document.getElementById("editScheduleF").addEventListener("submit", function (e) {
e.preventDefault()
const editForm=new FormData(this)
const num1 = editForm.get("timein").replace(/:/g, ''); 
const num2 = editForm.get("timeout").replace(/:/g, '')
const total=num2-num1

if(total==100){


fetch("/editSchedule",{
  method: "POST",
  body:editForm
}).then(response=>response.json()).then(data=>{
window.location.reload()
})
}else{
  window.location.reload()
}
})


  function tablecreator(datas) {

    const monday = document.getElementById('mond')
    const tuesday = document.getElementById('tues')
    const wednesday = document.getElementById('wedn')
    const thursday = document.getElementById('thur')
    const friday = document.getElementById('frid')
    const days = ['','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


    monday.innerHTML = "Monday";
    tuesday.innerHTML = "Tuesday";
    wednesday.innerHTML = "Wednesday";
    thursday.innerHTML = "Thursday";
    friday.innerHTML = "Friday";

    const tablebody = document.getElementById('tbodys')
tablebody.innerHTML=""
console.table(datas)
console.log('hakc')
console.table(datas)
    datas.forEach(data => {
        const selectedday=document.getElementById("daychooser")
    
      const row = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
const newStr=formatTime(data.timein)
const newStrs=formatTime(data.timeout)
      const rowclass = document.createElement('div');
      const colclass = document.createElement('div');
      const divs = document.createElement('button');
      //para pag na click pwede e delit yung na click
      divs.onclick =  function() {
        editExistingSchedule(data.indx);
    };

      const daynum=data.day
      rowclass.classList.add('row');
      switch (daynum) {
        case '1':
         
          divs.classList.add("form-control");
          divs.textContent = newStr + ' - ' + newStrs;

          divs.style.fontSize = "14px";
          colclass.appendChild(divs);
        rowclass.appendChild(colclass);
          monday.appendChild(rowclass);
          break;
        case '2':
            divs.classList.add("form-control");
          divs.textContent = newStr + ' - ' + newStrs;
        
          divs.style.fontSize = "14px";
          colclass.appendChild(divs);
          rowclass.appendChild(colclass);
          tuesday.appendChild(rowclass);
          break;
        case '3':
            divs.classList.add("form-control");
          divs.textContent = newStr + ' - ' + newStrs;

     
          divs.style.fontSize = "14px";
          colclass.appendChild(divs);
          rowclass.appendChild(colclass);
          wednesday.appendChild(rowclass);
          break;
        case '4':
            divs.classList.add("form-control");
          divs.textContent = newStr + ' - ' + newStrs;
   
          divs.style.fontSize = "14px";
          colclass.appendChild(divs);
          rowclass.appendChild(colclass);
          thursday.appendChild(rowclass);
          break;
        case '5':
            divs.classList.add("form-control");
          divs.textContent = newStr + ' - ' + newStrs;
  
          divs.style.fontSize = "14px";
          colclass.appendChild(divs);
          rowclass.appendChild(colclass);
          friday.appendChild(rowclass);
          break;
      }
      divs.style.marginTop = "15px";
    
        
        td1.textContent = days[data.day];
        row.appendChild(td1);
  
        td2.textContent = newStr + ' - ' + newStrs;
        row.appendChild(td2);
  
  
  
   
       
        //size ng font
        td1.style.fontSize = 'small'
        td2.style.fontSize = 'small'
     
        //para gitna mga text
        td1.style.textAlign = 'center'
        td2.style.textAlign = 'center'

        tablebody.appendChild(row);
      
     
    })
    checkconflict()
  }

  const am_options = ['8:30', '9:00', '9:30', '10:00', '10:30', '11:00','11:30','12:00','pm']
  
  const pm_options = ['1:00', '2:00','3:00','4:00','5:00']
  const btn1 = document.getElementById('time1am')
  const btn2 = document.getElementById('time2am')
  const btn3 = document.getElementById('daychooser')
  let day = btn3.value

  createoptionAM(6)
  function checkconflict(){
    const day=document.getElementById("daychooser").value
    let timein
    let timeout

  if(document.getElementById("time1am").value=='pm'){
    timein="1:00:00"
    timeout="2:00:00"
  }else if(document.getElementById("time1am").value=='am'){
     timein="8:30:00"
    timeout="9:30:00"
  }
  else if(convertToTime(document.getElementById("time1am").value)>convertToTime('5:00')){
    timein=`${document.getElementById("time1am").value}:00`
    timeout=`${am_options[document.getElementById("time1am").selectedIndex+2]}:00`
  
  }else{
timein=`${document.getElementById("time1am").value}:00`
timeout=`${pm_options[document.getElementById("time1am").selectedIndex+1]}:00`
  }

    fetch(`/load/checkConflict?tin=${timein}&tout=${timeout}&Day=${day}`)
    .then(response => response.json())
    .then(data => {
      
      console.log(data.datas)
      if(data.conflict){
      let isConflict=false
     if(data.datas&&data.datas.length>0) {
      data.datas.forEach(frag => {
        const tin1=convertToTime(timein)
        const tin2=convertToTime(frag.timein)
        const tout1=convertToTime(timeout)
        const tout2=convertToTime(frag.timeout)
        if ((tin2 < tout1 && tout2 > tin1) || (tin2 < tin1 && tout2 > tout1) || (tin2 >= tin1 && tout2 <= tout1)) {
         isConflict=true

        } 
      })
    }
   
   
if(isConflict){  document.getElementById("saveChanges").textContent="Conflicted Time"
   document.getElementById("saveChanges").disabled=true}
   else{
    document.getElementById("saveChanges").textContent="Save changes"
    document.getElementById("saveChanges").disabled=false
   }
}else{
  document.getElementById("saveChanges").textContent="Save changes"
  document.getElementById("saveChanges").disabled=false
}
    })
    .catch(err => {
      console.error('Error fetching account data:', err);
    });
  }

 

function  changepm(){
  for (let i = 0; i <= pm_options.length-2; i++) {
    const newOption = new Option(pm_options[i], pm_options[i]);
    btn1.add(newOption);
  }
  const newOptions = new Option('AM', 'am');
    btn1.add(newOptions);
  }
  function  changeam(){
    for (let i = 0; i <= am_options.length-4; i++) {
      const newOption = new Option(am_options[i], am_options[i]);
      btn1.add(newOption);
    }
    const newOptions = new Option('PM', 'pm');
      btn1.add(newOptions);
    }
  btn1.addEventListener('change', function () {
    let timechange
    if (btn1.value.includes(':')){ 
      let [hours, minutes] = btn1.value.split(':').map(Number);
    if ((hours >= 1 && hours <= 5)) {
        timechange= 'PM';
    } else if ((hours >= 8 && hours <= 11)) {
        timechange='AM';
    } }

    const selected = btn1.selectedIndex;
   
    if(btn1.value=='pm'){
    btn1.innerHTML=''
    changepm()
    resetoption()
    createoptionPM(1)
  }else if(btn1.value=='am'){
       btn1.innerHTML='' 
        changeam()
    resetoption()
    createoptionAM(1)
  }else if(timechange=='AM'){
   resetoption()

    createoptionAM(selected + 1)
  }else{
    
    resetoption()
    createoptionPM(selected+1)
  }
  })

 function editExistingSchedule(index){
  document.getElementById("removebutt").disabled=false
document.getElementById("removebutt").onclick =()=>removethis(index)
 }

function removethis(index){
  const confirmed=confirm("Are you sure?")
  if(confirmed){fetch(`/RemoveThis?id=${index}`).then(response=>response.json()).then(data=>{
   
    window.location.reload()
  }).catch((err)=>{
    console.log(err)
  }) 
  document.getElementById("removebutt").disabled=true
  document.getElementById("removebutt").onclick =""}
}
  
function resetoption(num) {
    if (num) {
      btn2.innerHTML = '';
      btn1.innerHTML = ''
    } else {
      btn2.innerHTML = '';
    }

  }
  function createoptionAM(num1) {

    const newOption = new Option(am_options[num1+1], am_options[num1+1]);
    btn2.add(newOption);
      
  }

  function createoptionPM(num1) {
   /* for (let i = num1; i <= pm_options.length; i++) {
      const newOption = new Option(pm_options[i], pm_options[i]);
      btn2.add(newOption);
    }*/
      const newOption = new Option(pm_options[num1], pm_options[num1]);
      btn2.add(newOption);
  }

  document.getElementById("daychooser").addEventListener("change", function () {
   getsched()
  })

  function getsched(){

    const modalscrollbody = document.getElementById('scrowablebodya')
 
 
 
     fetch(`/load/change_sched`)
       .then(response => response.json())
       .then(data => {
         document.getElementById("ofcasLoad").style.display = "none"
         if (data.msg != null) {
          console.table(data.result)
           tablecreator(data.result)

         } else {
           modalscrollbody.innerHTML = `<p>No Records found</p>`
         }
       })
       .catch(err => {
         console.error('Error fetching account data:', err);
       });

  }
  function formatTime(time) { const [hours, minutes, seconds] = time.split(':'); let period; if (hours >= 1 && hours < 6) { period = 'PM'; } else if (hours >= 8 && hours < 12) { period = 'AM'; } else if (hours == 12) { period = 'PM'; } else { period = hours >= 12 ? 'PM' : 'AM'; } const formattedHours = hours % 12 || 12; return `${formattedHours}:${minutes} ${period}`; }

    function convertToTime(timeStr) { 
      const thetime = new Date(); const [hours, minutes, seconds] = timeStr.split(':'); // Set the time parts 
      thetime.setHours(hours); 
      thetime.setMinutes(minutes); 
      thetime.setSeconds(seconds || 0); 
      return thetime;}