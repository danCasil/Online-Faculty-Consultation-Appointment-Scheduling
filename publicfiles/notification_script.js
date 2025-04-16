
function formatDate(dateString) {
    const date = new Date(dateString);

    // Options for formatting the date
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric', 
        timeZoneName: 'short'
    };

    // Convert to a readable format
    return date.toLocaleDateString('en-US', options);
}



document.addEventListener("DOMContentLoaded",function(e){
    fetch("/load/pg_role").then(response=>response.json()).then(respo=>{
     
        if(respo.role!='faculty'){
            document.getElementById("System").style.display="none"
            
        }
    }).catch(err=>{

    })
    loadNotification()
})
function vote(voted_id,vote){

    fetch(`/vote?voted=${voted_id}&vote=${vote}`,{
        method:"PATCH"
    })
    .then(response=>response.json())
    .then(data=>{

        window.location.reload()
    
    }
    ).catch(err=>{
        console.error("", err);
    })

}

function loadNotification(){
fetch(`/load/notification`).then(response => response.json())
.then(status => {
      document.getElementById("ofcasLoad").style.display = "none"
    const sysNotif=status.SYSTEMnotif
    const systemAccordion=document.getElementById("System")
   
  
    if(sysNotif&&sysNotif.length>0){
        const currentDate = new Date()
        var column;
     
       
          sysNotif.forEach(system=>{   
            column={col1:"col-4",col2:"col-8"}
         
            const databaseDate =new Date(system.dateandtime)
            const row=document.createElement("div")
            row.innerHTML=`<div class="accordion-item" style="margin-bottom:20px;">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button collapsed ${system.status} row" style="margin:0"id="notif_id${system.notif_id}" type="button" data-bs-toggle="collapse" data-bs-target="#notif${system.notif_id}" aria-expanded="false" aria-controls="notif${system.notif_id}"
               ">

         <div class="row"> 
      <div class="col-4">
${system.sender_id} 
      </div>
      <div class="col-8">
<p class="accordiontime">${timeDifference(currentDate,databaseDate)}</p>
      </div>
  </div>
                </button>
            </h2>
            <div id="notif${system.notif_id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body"> Is
                  ${system.last}, ${system.first} the current Dean of ${system.college}?\n <button class='systemButtonYesNo Yes' onclick="vote('${system.notif_text}','y')" type='button'>Yes</button><button class='systemButtonYesNo No' onclick="vote('${system.notif_text}','n')" type='button'>No</button>
                </div>
            </div>
        </div>`
  
        systemAccordion.appendChild(row);
          })
   
        }
    if(status.result.length==0&&sysNotif&&sysNotif.length==0){
        document.getElementById("noData").style.display=""
    }else{
        document.getElementById("noData").style.display="none"
    }
    
create_notif_table(status.result)

})
.catch(err => {
    console.error('Error fetching notification data:', err);

})
}

const MainContent=document.getElementById("accordionExample");
function create_notif_table(data){
    let msg
    const currentDate = new Date()
    var column;

        column={col1:"col-8",col2:"col-4"}
     
   
    data.forEach((datas)=> {
        const databaseDate =new Date(datas.dateandtime)
        switch(datas.type){
            case "notif":
                msg = "Notified You"
                break;
            case "Schedule":
                msg = " Set A Schedule For Consultation"
                break;
            case "accepted":
                msg = "Accepted Your set schedule"
                break;
            case "declined":
                msg = " Declined Your set schedule"
                break;
            case "cancelled":
            msg = " Cancelled Your set schedule"
            break;
            case "resched":
            msg = " Reschedule Your set schedule"
            break;
        }

      
  
        const row=document.createElement("div");
 
   
     
        row.innerHTML=`<div class="accordion-item" style="margin-bottom:20px">
              <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button collapsed ${datas.status} row" id="notif_id${datas.notif_id}" type="button" 
                  style="margin:0"
                  data-bs-toggle="collapse" data-bs-target="#notif${datas.notif_id}" aria-expanded="false" aria-controls="notif${datas.notif_id}"
                  onclick="change_status(${datas.notif_id})">
    <div class="row"style="width="100%">
        <div class="${column.col1}">
            ${datas.first}  ${datas.last}  ${msg}
        </div>
    <div class="${column.col2}">
            <p class="accordiontime">${timeDifference(currentDate,databaseDate)}</p>
    </div>
    </div>
                  </button>
              </h2>
              <div id="notif${datas.notif_id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    ${datas.notif_text}
                  </div>
              </div>
          </div>`
    
        MainContent.appendChild(row);
  
});
}
async function DeleteNotif(id) {

    try {
        
        fetch(`/update/remove_notif?id=${id}`, { method: "PATCH" })
        .then(response=>response.json())
        .then(stats=>{
            if(stats.status=='success'){
            
            const selectFilter=document.getElementById("selectFilter").value;
         
          
                filter(selectFilter)
            
        const toastLiveExample = document.getElementById('liveToast');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        menu.style.zIndex=0 
        if(window.innerWidth<500){
        toastLiveExample.style.zIndex=1000
    } 
         toastBootstrap.show();
            }

        }).catch(err=>{


    })
        
    } catch (err) {
        console.error("", err);
    }
}



function change_status(id){

notifDel.disabled=false
notifDel.onclick=()=>DeleteNotif(id)
fetch(`/update/notification?id=${id}`,{method:"PATCH"}).then(response=>response.json()).then(data=>{
if(data.update=='updated'){
    const notif=document.getElementById(`notif_id${id}`)
    notif.classList.remove("new")
    notif.classList.add("old")
    loadnewnotif()

}
}).catch((err)=>{
    console.error("", err);
})



}

function loadnewnotif(){
    fetch("/load/new_notification").then(response=>response.json()).then(data=>{
        const new_notif=data.result[0].new_notif
     
        notif_new_item(new_notif)
      
    }).catch((err)=>{
        console.log(err)
    })
}

function timeDifference(current, previous) {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

  
function filter(token){
    document.getElementById("ofcasLoad").style.display = ""
    fetch(`/load/notif/filter?token=${token}`)
    .then(response=>response.json())
    .then(status=>{
        document.getElementById("ofcasLoad").style.display = "none"
        const sysNotif=status.SYSTEMnotif
        const systemAccordion=document.getElementById("System")
       
      
        if(sysNotif&&sysNotif.length>0){
            const currentDate = new Date()
            var column;
         
           
              sysNotif.forEach(system=>{   
                column={col1:"col-4",col2:"col-8"}
             
                const databaseDate =new Date(system.dateandtime)
                const row=document.createElement("div")
                row.innerHTML=`<div class="accordion-item" style="margin-bottom:20px;">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed ${system.status} row" style="margin:0"id="notif_id${system.notif_id}" type="button" data-bs-toggle="collapse" data-bs-target="#notif${system.notif_id}" aria-expanded="false" aria-controls="notif${system.notif_id}"
                   ">
    
             <div class="row"> 
          <div class="col-4">
    ${system.sender_id} 
          </div>
          <div class="col-8">
    <p class="accordiontime">${timeDifference(currentDate,databaseDate)}</p>
          </div>
      </div>
                    </button>
                </h2>
                <div id="notif${system.notif_id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body"> Is
                      ${system.last}, ${system.first} the current Dean of ${system.college}?\n <button class='systemButtonYesNo Yes' onclick="vote('${system.notif_text}','y')" type='button'>Yes</button><button class='systemButtonYesNo No' onclick="vote('${system.notif_text}','n')" type='button'>No</button>
                    </div>
                </div>
            </div>`
      
            systemAccordion.appendChild(row);
              })
       
            }
        if(status.result.length==0&&sysNotif&&sysNotif.length==0){
            document.getElementById("noData").style.display=""
        }else{
            document.getElementById("noData").style.display="none"
        }
        MainContent.innerHTML=""
    create_notif_table(status.result)
    
    }).catch(err=>{
    console.log("Failed to Retrieve Data from the database");
    })

}