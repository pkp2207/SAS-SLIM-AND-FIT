let analyticsElement = document.querySelector("#analytics");
let dashboardElement = document.querySelector("#dashboard");
let messagebroadcast = document.querySelector("#messagebroadcast");
let overview = document.querySelector(".overview");
let analyticsdiv = document.querySelector(".activity");
let messagediv = document.querySelector(".messagebroadcastdiv")

analyticsdiv.classList.add("hide");
messagediv.classList.add("hide");

dashboardElement.addEventListener("click",()=>{
    overview.classList.remove("hide");
    analyticsdiv.classList.add("hide");
    messagediv.classList.add("hide");

})

analyticsElement.addEventListener("click",()=>{
    overview.classList.add("hide");
    analyticsdiv.classList.remove("hide");
    messagediv.classList.add("hide");

})

messagebroadcast.addEventListener("click",()=>{
    overview.classList.add("hide");
    analyticsdiv.classList.add("hide");
    messagediv.classList.remove("hide");
})

let date = new Date();
let span = document.querySelectorAll("#clock");
date=date.toString();
date = date.slice(0,15);
console.log(span);
span[0].innerHTML= date;
span[1].value= date;