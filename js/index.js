document.addEventListener("DOMContentLoaded", () => {

    let running = false;
    let session = true;
    let time;
    let totalTime;

    let UI = {
        breakPlus: document.querySelector(".break-plus"),
        breakMinus: document.querySelector(".break-minus"),
        sessionPlus: document.querySelector(".session-plus"),
        sessionMinus: document.querySelector(".session-minus"),
        break: document.getElementById("break"),
        session: document.getElementById("session"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds"),
        play: document.getElementById("play"),
        stop: document.getElementById("stop"),
        bar: document.getElementById("bar"),
        controls: document.querySelectorAll(".controls"),
        type: document.getElementById("type")
    };

    if (Notification.permission !== "granted"){
        Notification.requestPermission();
    }

    UI.breakPlus.addEventListener("click", (e) => {
        e.preventDefault();
        if(!running){
            UI.break.textContent = Number(UI.break.textContent)+1;
        }
    });

    UI.breakMinus.addEventListener("click", (e) => {
        e.preventDefault();
        if(!running){
            UI.break.textContent = Number(UI.break.textContent)-1;
            if(Number(UI.break.textContent) <= 1) UI.break.textContent = 1;
        }
    });

    UI.sessionPlus.addEventListener("click", (e) => {
        e.preventDefault();
        if(!running){
            UI.session.textContent = Number(UI.session.textContent)+1;
            UI.minutes.textContent = UI.session.textContent < 10 ? "0" + UI.session.textContent : UI.session.textContent;
            time = Number(UI.session.textContent)*60;
            totalTime = time;
        }
    });

    UI.sessionMinus.addEventListener("click", (e) => {
        e.preventDefault();
        if(!running){
            UI.session.textContent = Number(UI.session.textContent)-1;
            if(Number(UI.session.textContent) <= 1) UI.session.textContent = 1;
            UI.minutes.textContent = UI.session.textContent < 10 ? "0" + UI.session.textContent : UI.session.textContent;
            time = Number(UI.session.textContent)*60;
            totalTime = time;
        }
    });


    let animation;
    time = Number(UI.session.textContent)*60;
    totalTime = time;
    UI.play.addEventListener("click", (e)=>{
        e.preventDefault();
        
        if(!running){
            UI.play.innerHTML = '<i class="fa fa-pause"></i>';
            animation = setInterval(()=>{
                if(Number(UI.seconds.textContent)===0){
                    UI.seconds.textContent = 59;
                    UI.minutes.textContent = Number(UI.minutes.textContent) - 1 < 10 ? "0" + (Number(UI.minutes.textContent) - 1).toString() : Number(UI.minutes.textContent) - 1;
                }else{
                    UI.seconds.textContent = Number(UI.seconds.textContent) - 1 < 10 ? "0" + (Number(UI.seconds.textContent) - 1).toString() : Number(UI.seconds.textContent) - 1;;
                }  
                time--;
                if(session){
                    document.title = UI.minutes.textContent +":"+ UI.seconds.textContent + " To next break...";
                }else{
                    document.title = UI.minutes.textContent +":"+ UI.seconds.textContent + " To next session...";
                }
                UI.bar.style.width = ((totalTime-time)/totalTime)*100 + "%";
                if(((totalTime-time)/totalTime)*100 >= 98){
                    UI.bar.style.borderRadius = "9px";
                }
                if(time <= 0){
                    let icon = "http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png";
                    if(!session){
                        UI.minutes.textContent = UI.session.textContent < 10 ? "0"+UI.session.textContent : UI.session.textContent;
                        time = Number(UI.session.textContent)*60;
                        UI.type.textContent = "Session";
                        UI.bar.style.backgroundColor = "green";
                        notify("my pomodoro", icon, "Starting new work session");
                    }else{
                        UI.minutes.textContent = UI.break.textContent < 10 ? "0"+UI.break.textContent : UI.break.textContent;
                        time = Number(UI.break.textContent)*60;
                        UI.type.textContent = "Break !";
                        UI.bar.style.backgroundColor = "red";
                        notify("my pomodoro", icon, "Starting new break");
                    }
                    totalTime = time;
                    session = !session;
                    UI.bar.style.borderRadius = "9px 0 0 9px";
                    UI.bar.style.width = "0";
                }
            }, 1000);
        }else{
            UI.play.innerHTML = '<i class="fa fa-play"></i>';
            clearInterval(animation);
        }
        running = !running;
    });

    UI.stop.addEventListener("click", (e)=>{
        time = Number(UI.session.textContent)*60;
        totalTime = time;
        clearInterval(animation);
        UI.minutes.textContent = UI.session.textContent < 10 ? "0" + UI.session.textContent : UI.session.textContent;
        UI.seconds.textContent = "00";
        UI.play.innerHTML = '<i class="fa fa-play"></i>';
        UI.bar.style.width = "0";
        running = false;
        session = true;
        UI.bar.style.borderRadius = "9px 0 0 9px";
        UI.bar.style.backgroundColor = "green";
        UI.type.textContent = "Session";
        document.title = "my pomodoro";
    });
});

function notify(title, icon, text){
    if(Notification.permission !== "granted"){
        Notification.requestPermission();
    }else{
        let notif = new Notification(title, {
            icon: icon,
            body: text,
        });
    }
}