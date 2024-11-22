document.addEventListener("DOMContentLoaded",function(e){
    document.getElementById("loginErr").style.display="none";
})

document.getElementById("login_form").addEventListener("submit",function(e){
   
e.preventDefault();
const formData=new FormData(this);
    fetch('/secret/login', {
        method: 'POST',
        body: formData
    }) 
        .then(response => response.json())
        .then(status => {
       if(status.success==true){
        window.location.href="/home/dean";
        document.getElementById("loginErr").style.display="none";
       }else{
      document.getElementById("loginErr").style.display="";
       }

        })
        .catch(err => {
            console.error('Error fetching account data:', err);
        });

})

document.getElementById("deanReg").addEventListener("submit",function(e){
   
    e.preventDefault();
    const formData=new FormData(this);
        fetch('/secret/reg', {
            method: 'POST',
            body: formData
        }) 
            .then(response => response.json())
            .then(status => {
          
            alert(status);
           
    
            })
            .catch(err => {
                console.error('Error fetching account data:', err);
            });
    
    })

const myModal = new bootstrap.Modal(document.getElementById("modalId"));
document.getElementById("register").addEventListener("click",function(e){
   myModal.show()
})

document.getElementById("namelabel").addEventListener('click',function(e){
    document.getElementById('id').focus()
})
elementSelector('.inputslabel',1).addEventListener('click',function(e){
    document.getElementById('pass').focus()
})
document.getElementById('id').addEventListener('focus',function(e){
   elementSelector('.inputslabel',0).style.top="0"
   elementSelector('.inputslabel',0).style.fontSize="10px"
   elementSelector('.inputslabel',0).style.transition="top .5s,font-size .5s"
})
document.getElementById('id').addEventListener('focusout',function(e){
    if(this.value==''){ elementSelector('.inputslabel',0).style.top='26%';
    elementSelector('.inputslabel',0).style.fontSize="15px"
     elementSelector('.inputslabel',0).style.transition="top .5s,font-size .5s"}
 })
 document.getElementById('pass').addEventListener('focus',function(e){
    elementSelector('.inputslabel',1).style.top="0"
    elementSelector('.inputslabel',1).style.fontSize="10px"
    elementSelector('.inputslabel',1).style.transition="top .5s,font-size .5s"
 })
 document.getElementById('pass').addEventListener('focusout',function(e){
    if(this.value==''){ elementSelector('.inputslabel',1).style.top='26%';
     elementSelector('.inputslabel',1).style.fontSize="15px"
      elementSelector('.inputslabel',1).style.transition="top .5s,font-size .5s"}

  })

function elementSelector(clas,i){
  return  document.querySelectorAll(clas)[i]
}
let eyeshow=false
const eye=document.getElementById('eyeimg')
document.getElementById('pass').addEventListener('input',function(e){
if(this.value!=''){ 
   getElement('pass').type="password"
    eye.src='../img/passhide.png'
    eyeshow=false
}else{
    eye.src=""
}
})

eye.addEventListener("click", function(e) {
    eyeshow = !eyeshow;
    if (eyeshow) {
      
        getElement('pass').type='text'
        eye.src = '../img/passshow.png'; 
    } else {
        getElement('pass').type="password"
        eye.src = '../img/passhide.png';
    }
});
function getElement(id){
    return document.getElementById(id)
}

