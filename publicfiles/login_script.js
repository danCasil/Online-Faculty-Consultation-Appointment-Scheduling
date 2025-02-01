
styleElement('ofcasLoad').display= "";

document.addEventListener("DOMContentLoaded", () => {
    styleElement('ofcasLoad').display= "none";
    styleElement('loginErr').display="none";
})

document.getElementById("login_form").addEventListener("submit",function(e){
    styleElement('ofcasLoad').display= "";
    
e.preventDefault();


const formData=new FormData(this);
fetch('/User_login', {
    method: 'POST',
    body: formData
}) 
    .then(response => response.json())
    .then(data => {

   if(data.success==true){
    styleElement('loginErr').display='none'
    sendOTP('send',data.m,data.u)
   }else{
    styleElement('ofcasLoad').display = "none";
    styleElement('loginErr').display="";
   }
 
    })
    .catch(err => {
        console.error('Error fetching account data:', err);
    });

})
function styleElement(id){
 return document.getElementById(id).style
}
const myModal = new bootstrap.Modal(document.getElementById("modalId"));


document.getElementById("register").addEventListener("click",function(e){
   myModal.show()
})

document.getElementById("namelabel").addEventListener('click',function(e){
    document.getElementById('user_name').focus()
})
elementSelector('.inputslabel',1).addEventListener('click',function(e){
    document.getElementById('user_pass').focus()
})
document.getElementById('user_name').addEventListener('focus',function(e){
   elementSelector('.inputslabel',0).style.top="0"
   elementSelector('.inputslabel',0).style.fontSize="10px"
   elementSelector('.inputslabel',0).style.transition="top .5s,font-size .5s"
})
document.getElementById('user_name').addEventListener('focusout',function(e){
    if(this.value==''){ elementSelector('.inputslabel',0).style.top='26%';
    elementSelector('.inputslabel',0).style.fontSize="15px"
     elementSelector('.inputslabel',0).style.transition="top .5s,font-size .5s"}
 })
 document.getElementById('user_pass').addEventListener('focus',function(e){
    elementSelector('.inputslabel',1).style.top="0"
    elementSelector('.inputslabel',1).style.fontSize="10px"
    elementSelector('.inputslabel',1).style.transition="top .5s,font-size .5s"
 })
 document.getElementById('user_pass').addEventListener('focusout',function(e){
    if(this.value==''){ elementSelector('.inputslabel',1).style.top='26%';
     elementSelector('.inputslabel',1).style.fontSize="15px"
      elementSelector('.inputslabel',1).style.transition="top .5s,font-size .5s"}

  })

function elementSelector(clas,i){
  return  document.querySelectorAll(clas)[i]
}
let eyeshow=false
const eye=document.getElementById('eyeimg')
document.getElementById('user_pass').addEventListener('input',function(e){
if(this.value!=''){ 
   getElement('user_pass').type="password"
    eye.src='../img/passhide.png'
    eyeshow=false
}else{
    eye.src=""
}
})

eye.addEventListener("click", function(e) {
    eyeshow = !eyeshow;
    if (eyeshow) {
      
        getElement('user_pass').type='text'
        eye.src = '../img/passshow.png'; 
    } else {
        getElement('user_pass').type="password"
        eye.src = '../img/passhide.png';
    }
});
function getElement(id){
    return document.getElementById(id)
}
document.getElementById("OTP_FORM").addEventListener("submit",function(e){
    e.preventDefault();

    const formdata=new FormData(this);
        fetch(`/OTP/Authenticate`,{
            method: "POST",
            body: formdata
        }).then(response=>response.json())
        .then(data=>{
            if(data.success==false){
                document.getElementById("msg_otp").textContent="You entered an incorrect OTP. Please verify your input and try again."
                document.getElementById("msg_otp").style.color='red'

                document.querySelectorAll(".otp-input").forEach(function(el) {
                    el.value=''
                })
            }else{
            
                window.location.href='/grouper'
            }
        }).catch(err=>{
            console.error(err)
        })
    })

document.getElementById("forgot").addEventListener("click",function(e){
    const forgotModal = new bootstrap.Modal(document.getElementById("forgotModal"));
forgotModal.show()
    
})
document.getElementById("forgotForm").addEventListener("submit",function(e){
    e.preventDefault()
    const id=document.getElementById('id_number').value
    const url=window.location.href
   
    fetch(`/forgot?id=${id}&url=${url}`).then(response=>response.json()).then(data=>{
        if(data=="success"){
            alert("We sent a email to your gmail account.")
        }else{
            alert(data)
        }
    }).catch(err=>{

    })
})