

const Loading=document.getElementById("ofcasLoad");
const maincontent=document.getElementById("content")
const sidenavbar=document.getElementById("sidenavbar")
const notif=document.getElementById("notif")
const nav=document.getElementById("navbar")
const menu=document.getElementById('menu')
const toast=document.getElementById("liveToast")

document.addEventListener("loadstart",function(e){
    Loading.style.display=""
    
})

document.addEventListener("DOMContentLoaded",function(e){ 
   
   

    
    if(toast){
        toast.style.zIndex=0
    }

menu.style.zIndex=1
    responsive()

     const page=window.location.pathname;
    const currentpg=document.getElementById("currentpg");
    const sched=document.getElementById("sched")
    const report=document.getElementById("report")
    
    const change=document.getElementById("change")
  
const imgsrc=['',"../img/home","../img/notification","../img/change"]
const activeicon='_active.png'
const normalicon='_normal.png'

     switch(page){
         case "/report":
       currentpg.textContent="OFCAS - Reports";
        report.classList.toggle("active")
        break;
        case "/home":
            document.getElementById("icon1").src=`${imgsrc[1]}${activeicon}`
            document.getElementById("icon2").src=`${imgsrc[2]}${normalicon}`
            document.getElementById("icon3").src=`${imgsrc[3]}${normalicon}`

        currentpg.textContent="OFCAS - Home";
        sched.classList.toggle("active")
        break;
        case "/notification":
            
            document.getElementById("icon1").src=`${imgsrc[1]}${normalicon}`
            document.getElementById("icon2").src=`${imgsrc[2]}${activeicon}`
            document.getElementById("icon3").src=`${imgsrc[3]}${normalicon}`
            
        currentpg.textContent="OFCAS - Notification";
        notif.classList.toggle("active")
        
        break;
        case "/change":
        document.getElementById("icon1").src=`${imgsrc[1]}${normalicon}`
        document.getElementById("icon2").src=`${imgsrc[2]}${normalicon}`
        document.getElementById("icon3").src=`${imgsrc[3]}${activeicon}`
        currentpg.textContent="OFCAS - Change Consult Hr";
        change.classList.toggle("active")
        break;

     }


 

})


window.addEventListener("resize", function(e) {
   responsive()
 
  });

document.getElementById("student_notifier").addEventListener("click",function zIndex(){
    sidenavbar.style.zIndex="1"
})
function notif_close(){
    sidenavbar.style.zIndex="50000000"
}
function getElement(id){
    return document.getElementById(id)
}
let isshown=false
function menu_nav(){
    isshown=!isshown
  
        if(isshown){
    sidenavbar.style.display=''
   
    getElement('menuBTN').src='../img/close_menu.png'
    sidenavbar.style.position="absolute"
    sidenavbar.style.backgroundColor='white'
    sidenavbar.style.width="100%"
    sidenavbar.style.height="100%"
    sidenavbar.style.margin=""
    sidenavbar.style.zIndex="50000000"
    }else{
    sidenavbar.style.display='none'
    getElement('menuBTN').src='../img/open_menu.png'

    }
}
 document.getElementById('menu').addEventListener("click",function(e) {
    menu_nav()
 }) 
function responsive(){   
   
fetch("/load/new_notification").then(response=>response.json()).then(data=>{
    const new_notif=data.result[0].new_notif
 
    notif_new_item(new_notif)
  
}).catch((err)=>{
    console.log(err)
})

     if(window.innerWidth<500){
        nav.classList.remove("form-control")
        maincontent.classList.remove("col-10")
        maincontent.classList.remove("col-12")
        sidenavbar.classList.remove("col-2")
        sidenavbar.style.display="none"


     }
    const main=document.getElementById("maincontent")
    const editBtn=document.getElementById("editbutt")
    const calendar = document.getElementById('calendar-body');
    if(calendar){
        let column_witdh, col_day
        if(window.innerWidth<=500) {
            const theW=main.offsetWidth-48

            column_witdh=theW/7
            col_day =document.querySelectorAll('.day')
             calendar.style.gridTemplateColumns=`repeat(7,${column_witdh}px)`
        }else{
            column_witdh=calendar.offsetWidth/7
            col_day=document.querySelectorAll('.day')
        calendar.style.gridTemplateColumns=`repeat(7,${column_witdh}px)`}
    col_day.forEach(days=>{
       days.style.width=column_witdh+"px"  
    })
    }

    if(editBtn){
editBtn.style.marginTop=innerHeight-230+"px"
    }
    if(window.innerWidth>500){
    
    main.style.minHeight=innerHeight-75+"px"
   main.style.maxHeight=innerHeight-75+"px"
  }else{

     main.style.height=80+"vh"
  
  }

}
var myModalEl = document.getElementById('Notifmodal');
var notifModal =new bootstrap.Modal(myModalEl);
document.getElementById("student_notifier").addEventListener("click", ()=>{
    notifModal.show()
})

  document.getElementById("notif_sender").addEventListener("submit",function(e){
    e.preventDefault()
    
    const data=new FormData(this)
    fetch("/notify",{
        method: "POST",
        body: data,
    }).then(response => response.json())
    .then(respond => {
   
  

    if(respond.results=='success'){
        
        if (notifModal) {
            this.reset();
            notifModal.hide();
   
        }
    }else{
        alert("error")
    }
    })
    .catch(err => {
        console.error('Error fetching notification data:', err);
    
    })
    })

    function notif_new_item(new_notif){
       let iconImage="",status=""
        if(window.location.pathname=="/notification"){
            iconImage="../img/notification_active.png"
            status="active"
        }else{
iconImage="../img/notification_normal.png"
  status="normal"
        }

        
             if(new_notif>=1){
     
      
            notif.innerHTML = `<img src="${iconImage}"class="navbaricon" alt="">Notification <sup class="new ${status}">${new_notif}</sup>`;

        }else{
             notif.innerHTML = `<img src="${iconImage}"class="navbaricon" alt="">Notification<sup class="${status}" >0</sup>`
        }
    }
   function Elget(id){
    return document.getElementById(id)
   }

    document.getElementById("receiver_id").addEventListener("input", function (e) {
       
        const target=this.value;
      
        fetch(`/load/create_suggestion?target=${target}`).then(response=>response.json()).then(data=>{
            var createList
        if(!Elget('studentList')){
         createList=document.createElement('datalist')
        createList.id="studentList"
        document.body.appendChild(createList)
    }else{
         createList=Elget('studentList')
    }
    createList.innerHTML=""
        data.results.forEach(fragment=>{
        const opt=document.createElement("option")
        opt.value=fragment.id_number
        opt.textContent=`${fragment.last}, ${fragment.first}`
        createList.appendChild(opt)
          })
        }).catch(err=>{
          console.log(err);
        })
      })
