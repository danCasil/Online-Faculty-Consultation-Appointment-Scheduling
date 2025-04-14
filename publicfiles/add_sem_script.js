
const semAdd=document.getElementById("semAdd");
const sem_scope=document.getElementById("sem-scope");
const semBtn=document.getElementById("addSemBTN");
const sem_Container=document.getElementById("sem_Container");
const semFrom=document.getElementById("semFromDate");
const semTo=document.getElementById("semToDate");
const currentDate=new Date();
const sem_names=document.getElementById("sem_names");
var isEdit=false;
var semDetails=[]
var semToYearData="";

document.addEventListener("DOMContentLoaded",function(e){
   document.getElementById("onCp").style.display="none"
   checkScreen(false)
  semBtn.disabled=true
  fetch("/getSem")
  .then(response=>response.json())
  .then(data=>{
    semListGenerator(data.sem)
  })
})

semFrom.addEventListener("change",function(e){
  if(!IsValidDate(this.value)){
    this.style.borderColor="red"
    semBtn.disabled=true
  }else if(IsValidDate(this.value)&&IsValidDate(semTo.value)&&(this.value<semTo.value)){
    semBtn.disabled=false
  }else{
   this.style.borderColor="green"
  }
})

semTo.addEventListener("change",function(e){
  if(!IsValidDate(this.value)){
    this.style.borderColor="red"
    semBtn.disabled=true
  }else if(IsValidDate(this.value)&&IsValidDate(semFrom.value)&&(this.value>semFrom.value)){
    semBtn.disabled=false
  }else{
   this.style.borderColor="green"
  }
})

function IsValidDate(date) {
    const minDate = new Date('2000-01-01');
    const maxDate = new Date('9999-12-30');
  
    const selectedDate = new Date(date);
  
    if (selectedDate >= minDate && selectedDate <= maxDate) {
      return true; 
    } else {
      return false; 
    }
  }
  
  document.getElementById("semAdderForm").addEventListener("submit",function(e){
    
  
    e.preventDefault();
    const formData=new FormData(this);
    fetch("/sem/add",{
      method: "POST",
      body:formData
    })
    .then(response=>response.json())
    .then(data=>{
      semListGenerator(data.sem) }) 
      semBtn.disabled=true
      document.getElementById("semAdderForm").reset()  
    .catch(e=>{

    })
  })
  function formatThis(d){
    const originalDate = new Date(d); 
    const options = { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric' 
    }; 

   return  formattedDate = originalDate.toLocaleDateString('en-US', options);
}
function editSem(data){

  isEdit = (isEdit==true)?false:true;
  const thisEdit=document.getElementById(`semEdit${data.id}`)
  if(isEdit){
  thisEdit.innerHTML="CANCEL";

  for(var i=0;i<data.L;i++){
    const temSem=document.querySelectorAll(".semsEDIT")[i]
   
    if(temSem.id!=thisEdit.id){
      temSem.disabled=true;
    }
   } 

   if(data.firstLet=="F"){
      document.getElementById("semName").selectedIndex=0;
   }else{
    document.getElementById("semName").selectedIndex=1;
   }  
   const startDate=new Date(data.start);
   const endDate=new Date(data.end);
    semFrom.value=`${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`
    semTo.value=`${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`
    semBtn.disabled=false
    semBtn.textContent="SAVE"
       semBtn.type="button"
      const semDATA=new FormData (document.getElementById("semAdderForm"))
      semDATA.append("id", data.id);

   semBtn.onclick=function(){
    semBtn.textContent ="ADD";
    semBtn.disabled=true;
    document.getElementById("semAdderForm").reset()

  fetch(`/sem/edit`,{
    method:"POST",
    body:semDATA,
  }).then(response=>response.json())
  .then(data=>{
    semListGenerator(data.sem)
  }).catch(err=>console.log(err))
   }

  }else{
    for(var i=0;i<data.L;i++){
      const temSem=document.querySelectorAll(".semsEDIT")[i]
     
      if(temSem.id!=thisEdit.id){
        temSem.disabled=false;
      }
     } 
    thisEdit.innerHTML="EDIT";
      semBtn.disabled=true
      document.getElementById("semAdderForm").reset()
    semBtn.textContent="ADD"
    semBtn.type="submit"
    semBtn.onclick = function(){
      document.getElementById("semAdderForm").submit(preventDefault())
    }
  }
 
}


function semListGenerator(data){

  sem_names.innerHTML=""
  sem_Container.innerHTML="";
  if(data.length>0){
    data.forEach(element => {
      const datas={id:element.sem_id,
        L:data.length,
        firstLet:element.sem_name.charAt(0),
        start:element.sem_start,
        end:element.sem_end,
      }
      const semData=JSON.stringify(datas)
    const div=document.createElement("div");
    div.classList.add("form-control");
    div.style.marginBottom="10px";
    div.style.height="50px";
    div.innerHTML=`
    <div class="row" >
<div class="col-8">
    <div class="row"  style="  margin-top: 5px;">
        <div class="col-6">
            ${element.sem_name}   
        </div>
        <div class="col-6">
            ${formatThis(element.sem_start)} - ${formatThis(element.sem_end)}
        </div>
    </div>
</div>
<div class="col-2">
 <center>
     <button class="btn btn-primary semsEDIT"onclick='editSem(${semData})'id='semEdit${element.sem_id}' >EDIT</button>
 </center>
</div>
<div class="col-2">
  <center>
      <button class="btn btn-danger" style="margin-left:15px" onclick='deleteThisSem(${JSON.stringify(datas)})'>DELETE</button>
  </center>
</div>
</div>`
const opt=document.createElement("option");
opt.value=element.sem_id
opt.textContent=element.sem_name

sem_names.appendChild(opt)
sem_Container.appendChild(div)
    });
   

  }else{
    sem_Container.innerHTML="No Data";
  }
}
function deleteThisSem(data){
  const Stringed=JSON.stringify(data)
 const confirmed=confirm("Are you sure?")
 if(confirmed) { fetch(`/sem/delete?data=${Stringed}`,{method:"POST"})
  .then(response=>response.json())
  .then(data=>{
    semListGenerator(data.sem)
  }).catch(err=>{
    console.log(err);
  })
}
}
window.addEventListener("resize", function(e) {
  checkScreen(true)
});
function checkScreen(stats){ 
  const windowWidth=window.innerWidth
  const windowHeight=window.innerHeight
  if(stats){if(windowWidth<988){
  document.getElementById("onCp").style.display=""
  document.getElementById("onPc").innerHTML=""

}else{
  document.getElementById("onCp").style.display="none"
  this.location.reload()
}}else{if(windowWidth<988){
  document.getElementById("onCp").style.display=""
  document.getElementById("onPc").innerHTML=""}}

}