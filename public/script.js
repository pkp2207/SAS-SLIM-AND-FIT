let analyticsElement = document.querySelector("#analytics");
let dashboardElement = document.querySelector("#dashboard");
let overview = document.querySelector(".overview");
let analyticsdiv = document.querySelector(".activity");

analyticsdiv.classList.add("hide");

analyticsElement.addEventListener("click",()=>{
    overview.classList.add("hide");
    analyticsdiv.classList.remove("hide");
})

dashboardElement.addEventListener("click",()=>{
    overview.classList.remove("hide");
    analyticsdiv.classList.add("hide");
})



const select = document.getElementById('country');

    // Add options to the select element
    countries.forEach(country => {
      const option = document.createElement('option');
      option.textContent = country;
      select.appendChild(option);
    });