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




const select = document.getElementById('country');

    // Add options to the select element
    countries.forEach(country => {
      const option = document.createElement('option');
      option.textContent = country;
      select.appendChild(option);
    });