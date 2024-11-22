
const OTPmodal = new bootstrap.Modal(document.getElementById("OTPmodal"));
document.querySelectorAll(".otp-input").forEach(function(el) {
    el.addEventListener("keydown",function(e){
        const otpid = el.id;
        const lastChar = parseInt(otpid.charAt(otpid.length - 1));
        const id = lastChar - 1;
        const nextInput = document.getElementById(`otp${id}`); 
        if(e.keyCode==8){
            if(el.value==''){
            nextInput.focus();}
        } 
           
    })
    el.addEventListener("input", function(e) {
        const otpid = el.id;
        const lastChar = parseInt(otpid.charAt(otpid.length - 1));
        const id = lastChar + 1;
        if (el.value !== null && el.value !== '') {
            el.value = el.value.slice(-1);
             }
        if (el.value > 0 && el.value < 10) {
            const nextInput = document.getElementById(`otp${id}`);
            if (nextInput) {
                nextInput.focus();
            }else{
                document.getElementById("OTP_confirm").focus()
            }
        }
        
    });
});

const Resend_botton=document.getElementById("Resend_botton")
Resend_botton.addEventListener("click", function(e) {
    sendOTP('send');
    OTPmodal.hide()
})
function sendOTP(status)
{
    document.getElementById('ofcasLoad').style.display = "";
    fetch(`/OTP?OTP_STATUS=${status}`).then(response => response.json()
      ).then(data=>{
        document.getElementById('ofcasLoad').style.display = "none";
        if(data.success==true){
          OTPmodal.show()  
          Resend_botton.onclick=sendOTP('resend')
        }else{
          startTimer(data.seconds)
        }
        
        
    }).catch(err=>{
        console.error("ERROR OTP", err);
    })
}

function startTimer(duration) {
    const login=document.getElementById("loginBTN");
    let timer = duration;
    const interval = setInterval(function() {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        Resend_botton.style.textDecoration='none'
        Resend_botton.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        Resend_botton.onclick='none'
        if(login){
        login.textContent=`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        login.type='button'}
        if (--timer < 0) {
            clearInterval(interval);
                Resend_botton.style.textDecoration='underline'
                    Resend_botton.onclick=function() {
                        sendOTP('send');
                    };
           if(login) { login.type='submit'
            login.textContent = "Login"; }// Timer ends
            Resend_botton.textContent = "Resend OTP"; // Timer ends
        }
    }, 1000);
}
