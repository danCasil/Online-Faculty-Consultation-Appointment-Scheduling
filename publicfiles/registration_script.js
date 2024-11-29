


const idnum=document.getElementById("idnum")
const mail=document.getElementById("email")
const user=document.getElementById("user")
const NextBTN=document.getElementById("NextBTN")
const Lbtn=document.getElementById("Lbtn")
const pagerole=document.getElementById("role").value;
const section1=document.getElementById("section1")
const section2=document.getElementById("section2")
const section3=document.getElementById("section3")
const section4=document.getElementById("section4")

const l1=document.getElementById("l1")
const l2=document.getElementById("l2")
const l3=document.getElementById("l3")
const l4=document.getElementById("l4")

let finishsection=['','','','','']
let currentsection=1

document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {checkbox.style.opacity='50%'
    checkbox.addEventListener("click", function(e) {
        
        if (e.target.checked) {
            e.target.checked = false;
        } else {
            e.target.checked = true;
        }
    });
});

document.addEventListener("DOMContentLoaded",function(){

    document.getElementById("pass").disabled=true
   document.getElementById("passstatus").style.display="none"
    document.getElementById("passstatus1").style.display="none"
    const welcome=document.getElementById("welcome")
    if(pagerole=="faculty"){
        welcome.textContent="Welcome To Faculty Registration"
    }else{
   welcome.textContent="Welcome To Student Registration"
    }
    showOtherForm(1,'nav')
    getElement('ofcasLoad').style.display="none"
})  
let sec_num=1
function showOtherForm(section,type){
if(type=='next'){
    if(sec_num==4){
        sec_num=4
    }else{
        sec_num+=section
      
    }
   
}else{
    sec_num=section
}
 finishsection[sec_num-1]='f' 
console.table(finishsection)

document.querySelectorAll(".line").forEach(function(el){
    const str=el.id
    const id = parseInt(str.charAt(str.length - 1));
    el.style.transition = 'background-color 0.5s ease';
  
    if(finishsection[id]=='f'){
            el.style.backgroundColor="#b6d8a0"
            el.onclick=()=>{ showOtherForm(id,'nav')
            }
        
    }else{

        el.style.backgroundColor="white"
        el.onclick=''
        
  
    }
    if(id==sec_num){
        el.style.backgroundColor="#375623"
      }
 if(id==4){
    getElement('user').disabled=true
 }
    
})

document.querySelectorAll(".input_section").forEach(function(sect){
    const str=sect.id
    const id = parseInt(str.charAt(str.length - 1));
    if(id==sec_num){
        
        sect.style.display=""
       
    }else{

        sect.style.display="none"
    }

   if(sec_num==4){
    NextBTN.disabled=true
    NextBTN.innerHTML='Submit'
    NextBTN.type='submit'
   }else{
  NextBTN.innerHTML=`   <img src="../img/download.png"width="30px"height="40px"   alt=""></img>`
       NextBTN.type='button'
   }
   
})
    if(pagerole=="faculty"){
        document.querySelectorAll(".student").forEach(element=>{
            element.style.display="none"
    })
    }else{
        document.querySelectorAll(".faculty").forEach(element=>{
            element.style.display="none"
    })
    document.getElementById("college").style.display="none" 
    }
}
sec1Items=['first','mid','last']

sec2ItemsF=['idnum','collegesel']
sec2ItemsS=['idnum','course','year','section']
sec3Items=['email','user']
NextBTN.addEventListener("click",function(){
if(section1.style.display!="none"){
   
        if(valueGet('first')!=''&&valueGet("mid")!=""&&valueGet("last")!=""){
        showOtherForm(1,'next')
        sec1Items.forEach(function(item){
        
                removeRequire(item)
      
            }) 
        }else{
            sec1Items.forEach(function(item){
                if(valueGet(item)==''){
                    createRequire(item)
                }else{
                    removeRequire(item)
                }
                
                }) 
        }
}else if(section2.style.display!='none'){
    
  if(pagerole=='faculty')  {
    if(valueGet("idnum")!=""&&valueGet("collegesel")){
        sec2ItemsF.forEach(function(item){
                removeRequire(item)
            }) 
            checkduplicate(valueGet('idnum'), 'idnum')
                   
                  
    }else{
    sec2ItemsF.forEach(function(item){
        if(valueGet(item)==''){
            createRequire(item)
        }else{
            removeRequire(item)
        }
        }) 
    }
}
    else{
        if(valueGet("idnum")!=""&&valueGet("course")&&valueGet("year")!=""&&valueGet('section')!=""){
            sec2ItemsS.forEach(function(item){
                removeRequire(item)
            }) 
            checkduplicate(valueGet('idnum'), 'idnum')
                   
    }else{sec2ItemsS.forEach(function(item){
        if(valueGet(item)==''){
    
            createRequire(item)
        }else{
            removeRequire(item)
        }
        }) 
    }
}
}else if(section3.style.display!='none'){
    if(valueGet("user")!=""&&valueGet("email")){
        sec3Items.forEach(function(item){
            removeRequire(item)
            }) 
    checkduplicate(valueGet('user'), 'user')
    }else{
    sec3Items.forEach(function(item){
        if(valueGet(item)==''){
            createRequire(item)
        }else{
            removeRequire(item)
        }
        }) 
    }
}
})






function checkduplicate(inputFieldvalue,type){
    getElement('ofcasLoad').style.display=""
fetch(`/load/checkduplicate?inputvalue=${inputFieldvalue}&checktype=${type}`)
.then(response=>response.json()
  )
.then(data=>{
    getElement('ofcasLoad').style.display = "none";

    switch(type){
        case "idnum":
        if(data.dupli==true){
            createRequire(type)
        }else{
                removeDupli(type)
                showOtherForm(1,'next')
            }
        break;
        case "email":
            if(data.dupli==true){
                createRequire(type)
            }else{
                VerifyEmailOTP(mail.value)
                    removeDupli(type)
              
                }

        break;
        case "user":
            if(data.dupli==true){
                createRequire(type)
            }else{
                    removeDupli(type)
                    showOtherForm(1,'next')
                }
        break;
}    


}).catch(err=>{
    console.log(err)
})
}
function removeDupli(id){
    const created = id + 'Duplicate';
    const labels = document.getElementById(created);
    
    if (labels){
        getElement(id).style.borderColor = "";
getElement(id).parentNode.removeChild(labels);}

}
function removeRequire(id){
    const created = id + 'RequiredLabel';
        const labels = document.getElementById(created);
        
        if (labels){
            getElement(id).style.borderColor = "";
    getElement(id).parentNode.removeChild(labels);}

}
    function createRequire(id) {
       if (getElement(id).value==''){
   
        const created = id + 'RequiredLabel';
        const labels = document.getElementById(created);
        
        if (!labels) {
            
            // Create a new label element
           const  label = document.createElement('label');
           label.classList.add("requiredItems");
           label.style.position = "absolute";
           label.style.top="100%";
           label.style.width='fit-content'
            switch(id){
                case "first":
                    label.style.left='2%'
                    break
                case "mid":
                    label.style.left='35%'
                    break
                case "last":
                    label.style.left='70%'
                    break
               
                case "gender":
                    label.style.left='20%'
                    if(window.innerWidth<500){
                        label.style.top='100%' 
                        label.style.left='24%'  
                    }
                    break
                case "civil":
                    label.style.left='33%'
                    label.style.top='70px'
                    if(window.innerWidth<500){
                        label.style.top='108px'  
                        label.style.left='35%'  
                    }
                    break;
                case 'collegesel':
                    label.style.left='31%'
                  
                    label.style.top='73%'
                    if(window.innerWidth<500){
                        label.style.top='69%'  
                    }
                    break;
                case "idnum":
                     label.style.left='33%'
                    label.style.top='43px'
                    if(window.innerWidth<500){
                        label.style.top='100%'  
                    }
                    break
                case "year":
                        label.style.left='58%'
                       label.style.top='43px'
                       if(window.innerWidth<500){
                            label.style.left='50%'
                            label.style.top='100%' 
                       }
                       break
                    case "section":
                        label.style.left='75%'
                       label.style.top='43px'
                       if(window.innerWidth<500){
                        label.style.left='75%'
                        label.style.top='100%'  
                       }
                       break
                       case "email":
                        label.style.left='3%'
                       break
                       case "user":
                        label.style.left='3%'
                       break

            }
            label.id = created;
            label.textContent = 'Required';
            getElement(id).style.borderColor = "red";
            getElement(id).parentNode.insertBefore(label,getElement(id).nextSibling);

            
        }
       }else{

        const created = id + 'Duplicate';
        const labels = document.getElementById(created);
        
        if (!labels) {
            
            // Create a new label element
           const  label = document.createElement('label');
           label.classList.add("requiredItems");
           label.style.position = "absolute";
           label.style.top="100%";
           label.style.width='fit-content'
            switch(id){
                case "idnum":
                     label.style.left='20%'
                    label.style.top='43px'
                    if(window.innerWidth<500){
                        label.style.top='42px'  
                    }
                    label.textContent = 'This ID is already registered to an account.';
                    break
                       case "email":
                        label.style.left='3%'
                         label.textContent = 'This email is already registered to an account.';
                       break
                       case "user":
                        label.style.left='3%'
                        label.textContent = 'This username is already registered to an account.';
                       break

            }
            label.id = created;
         
            getElement(id).style.borderColor = "red";
            getElement(id).parentNode.insertBefore(label,getElement(id).nextSibling);

            
        }
       }
    
  
}
function valueGet(id){
    return document.getElementById(id).value
}
function getElement(id){
    return document.getElementById(id)
}


document.getElementById("registrationForm").
addEventListener("submit", function(e){
     e.preventDefault() 
    
  

getElement("ninja").value=valueGet('user')
    const formdata=new FormData(this)

    getElement('ofcasLoad').style.display=''
    fetch(`/${pagerole}/reg/new`,{
        method:"POST",
        body: formdata,
    }).then(
        response=>response.json())
    .then(data=>{
       getElement('ofcasLoad').style.display='none'
       alert("Your Account has Successfully Created. You will be redirected to OFCAS Homepage")
    window.location.href="/"
    }).catch(err=>{
        console.log(err)
    })
})




    function updateLabel(input, top, fontSize,id,focustype) {
        if(id.value==''){
            const inputlabel = document.getElementById(input);
            inputlabel.style.transition = "top .25s, font-size .25s";
            inputlabel.style.position = "absolute";
            inputlabel.style.top = top;
            inputlabel.style.fontSize = fontSize;
        }
        
    }
    
  
    document.getElementById("first").addEventListener("focus", function() {
        updateLabel("n1", "-1px", "11px",this,'out');
    });
    
    document.getElementById("first").addEventListener("focusout", function() {
        updateLabel("n1", "12px", "15px",this,'out');
    });
    document.getElementById("mid").addEventListener("focus", function() {
        updateLabel("n2", "-1px", "11px",this,'out');
    });
    
    document.getElementById("mid").addEventListener("focusout", function() {
        updateLabel("n2", "12px", "15px",this,'out');
    });
    document.getElementById("last").addEventListener("focus", function() {
        updateLabel("n3", "-1px", "11px",this,'out');
    });
    
    document.getElementById("last").addEventListener("focusout", function() {
        updateLabel("n3", "12px", "15px",this,'out');
    });

    document.getElementById("idnum").addEventListener("focus",function(){
        updateLabel("inputLabelidnum", "-1px", "11px",this,'out');
    })
    document.getElementById("idnum").addEventListener("focusout",function(){
        updateLabel("inputLabelidnum", "12px", "15px",this,'out');
        })
        document.getElementById("course").addEventListener("focus",function(){
            updateLabel("course1", "-1px", "11px",this,'out');
        })
    document.getElementById("course").addEventListener("focusout",function(){
            updateLabel("course1", "12px", "15px",this,'out');
            })   

            document.getElementById("year").addEventListener("focus",function(){
                updateLabel("course2", "-1px", "11px",this,'out');
            })
        document.getElementById("year").addEventListener("focusout",function(){
                updateLabel("course2", "12px", "15px",this,'out');
                })   

         document.getElementById("section").addEventListener("focus",function(){
                    updateLabel("course3", "-1px", "11px",this,'out');
                })
        document.getElementById("section").addEventListener("focusout",function(){
                    updateLabel("course3", "12px", "15px",this,'out');
                    })   
        document.getElementById("email").addEventListener("focus",function(){
                        updateLabel("emaillabel", "-1px", "11px",this,'out');
                    })
        document.getElementById("email").addEventListener("focusout",function(){
                        updateLabel("emaillabel", "12px", "15px",this,'out');
                        })   
        document.getElementById("user").addEventListener("focus",function(){
                            updateLabel("usernamelabel", "-1px", "11px",this,'out');
                        })
document.getElementById("user").addEventListener("focusout",function(){
 updateLabel("usernamelabel", "12px", "15px",this,'out');
})   

document.getElementById("passcheck").addEventListener("focus",function(){
updateLabel("labelpass", "-1px", "11px",this,'out')

})


document.getElementById("passcheck").addEventListener("input",function(){
    const chk1= document.getElementById("chk1")
    const chk2= document.getElementById("chk2")

    const userpass=this.value
if(this.value!=''){
 document.getElementById("passstatus").style.display=""
  document.getElementById("passstatus").style.display=""
}else{
document.getElementById("passstatus").style.display="none"
}
   const passcharacter= document.getElementById("passcharacter")
   const passlength= document.getElementById("passlength")

   let streght=0,threshold1,threshold2
if(userpass.length>=8){
    
    passlength.checked=true;
    passlength.style.opacity='100%';
    chk1.style.color = '#538135';
    threshold1=1
}else{
    threshold1=0
    passlength.checked=false;
    chk1.style.color = 'black';
    passlength.style.opacity='50%';
}


if (validatePassword(userpass)) {
    threshold2=1
    passcharacter.checked = true;
    chk2.style.color = '#538135';
    passcharacter.style.opacity = '100%';
} else {
    threshold2 = 0
    passcharacter.checked = false;
    chk2.style.color = 'black';
    passcharacter.style.opacity = '50%';
}
streght=threshold1+threshold2
const labelstr=document.getElementById("labelstrenght")
const oldclass=labelstr.className;
let newclass
if(this.value!=''){
if(streght==2){
   newclass='str'
   labelstr.textContent='good'
   document.getElementById("pass").disabled=false
   chk1.style.color = '#538135';
}else if(streght==1){
  newclass='avg'
  labelstr.textContent='still weak'

  chk1.style.color = 'black';
}else{
    chk1.style.color = 'black';
     newclass='weak'
     labelstr.textContent='too weak'

     chk1.style.color = 'black';
}
labelstr.classList.replace(oldclass, newclass);

}else{
    labelstr.classList.replace(oldclass, 'default');
}
})

function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    
    const count = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;
    return count >= 2;
}
document.getElementById("passcheck").addEventListener("focusout",function(){
updateLabel("labelpass", "12px", "15px",this,'out');
  })   
  document.getElementById("pass").addEventListener("focus",function(){
    updateLabel("labelconfpass", "-1px", "11px",this,'out');


    })
    document.getElementById("pass").addEventListener("focusout",function(){
    updateLabel("labelconfpass", "12px", "15px",this,'out');
      })           
    

      function  focuson(id){
        document.getElementById(id).focus();
      }
      let ishow=true
document.getElementById('passstatus').addEventListener('click',function(){
    this.classList.toggle('show')

    if(ishow){
        document.getElementById("passcheck").type='text'
    }else{
           document.getElementById("passcheck").type='password'
    }
    ishow = !ishow; 
    
})
let ishow1=true
document.getElementById('passstatus1').addEventListener('click',function(){
    this.classList.toggle('show')
 
if(ishow1){
        document.getElementById("pass").type='text'
    }else{
           document.getElementById("pass").type='password'
    }
    ishow1 = !ishow1; 
})
document.getElementById("pass").addEventListener("input",function(){
    const eye=document.getElementById("passstatus1")
    const pass1=document.getElementById("passcheck").value
    const note=document.getElementById("note")
    const pass2=this.value
    if(pass2==''){
        eye.style.display="none"
        note.classList.replace('show','hide')
        
    }else{
        note.classList.replace('hide','show')
        eye.style.display=""
    }
    if(pass1==pass2){
        note.style.color='#538135'
        this.classList.remove("similar")
        document.getElementById("NextBTN").disabled=false
    }else{
        note.style.color='red'
        if(!this.classList.contains("similar")){{this.classList.add("similar")}}
        
    }



})

mail.addEventListener('input', function(e) {
    let button = document.getElementById('mailButton');// Check if the button already exists
  if(VerifyEmail()) { 
    if (!button) {
        // Create a new button element
        button = document.createElement('button');
        button.id = 'mailButton';
        button.style.animation="beat 1s infinite"
        button.textContent = 'Verify';
        button.type = 'button';
        button.onclick = function(){
         checkduplicate(valueGet('email'),'email')
        }
        
        // Append the button below the input
        mail.parentNode.insertBefore(button, mail.nextSibling);
    }

}else{
    if (button) {
    mail.parentNode.removeChild(button);}
}
})
function VerifyEmailOTP(mail){
    const datatosend={
        email:mail,
        stat:'send'
    }
  
   const stringed=JSON.stringify(datatosend)
   sendOTP(stringed)
}
function VerifyEmail() {
    const mail = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailPattern.test(mail)) {
        return true
    } else {
      return false
    }
}
document.getElementById('Email_Verify').addEventListener('submit',function(e) {
e.preventDefault()
const formD=new FormData(this);
fetch("/OTP/Authenticate",{
    method:"POST",
    body: formD
}).then(response=>response.json())
.then(data=>{
if(data.success== true){
    this.reset()
    getElement('mailButton').textContent="Verified"
    getElement('mailButton').disabled=true
    getElement('mailButton').style.animation=""
    getElement("mailButton").style.transform="scale(1)"
    mail.style.borderColor='#b6d8a0'
    getElement("mailButton").style.color="green"
    user.disabled=false
    focuson('user')
    OTPmodal.hide()
}else{
    document.getElementById("msg_otp").textContent="You entered an incorrect OTP. Please verify your input and try again."
    document.getElementById("msg_otp").style.color='red'

    document.querySelectorAll(".otp-input").forEach(function(el) {
        el.value=''
    })
}
}).catch(err=>{
    console.log('Server ERROR')
})

})