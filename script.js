const userTab = document.querySelector("[data-userWheather]")
const searchTab = document.querySelector("[data-searchWheather]")
const userContainer = document.querySelector(".wheather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchFrom]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")
const messageText = document.querySelector("[data-messageText]");
const apiErrorContainer = document.querySelector(".api-error-container");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");

// const searchTab = document.querySelector("[]")

// initially Variable
const API_key = "3725ce39cdd0b8f15460baf661091a68";
let oldTab = userTab;
oldTab.classList.add("current-tab");
getFromSessionStorage();

// anything is pending
function switchTab(newTab){
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // is search from container is invisible, if yes make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main phele search wale tab pr tha, ab your wheather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active")
            // grantAccessContainer.classList.remove("active")
            // now i comed to your wheather tab so i want to display wheather also so lets check local storage first for coordinates, if we haved saved them there 
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    // pass clicked tab as input
      switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    // pass clicked tab as input
      switchTab(searchTab);
});


// check if cordinates are already present in session storage
function getFromSessionStorage(){
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if(!localCoordinates){
            // if local coordinate is not present
            grantAccessContainer.classList.add("active");
        }
        else{
            const coordinates = JSON.parse(localCoordinates);
             fetchUserWeatherInfo(coordinates);
        }
}

async function fetchUserWeatherInfo(coordinates){
       const {lat,lon} = coordinates;
    //    Make Grant Container invisible
    grantAccessContainer.classList.remove("active");
    // make loader Visible
    loadingScreen.classList.add("active")

    // API Call
    try{
        const response  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (error) {
        // console.log("User - Api Fetch Error", error.message);
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${error?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
      }
}

function renderWeatherInfo(weatherInfo) {
                        //   Firstly we have to fetch the element
             const cityname = document.querySelector("[data-cityName]");
             const countryIcon = document.querySelector("[data-countryIcon]"); 
             const desc = document.querySelector("[data-wheatherDesc]");    
             const weatherIcon = document.querySelector("[data-WheatherIcon]");
             const temp = document.querySelector("[data-temp]");
             const windspeed = document.querySelector("[data-windspeed]");
             const humidity = document.querySelector("[data-humidity]");
             const cloudiness = document.querySelector("[data-cloudiness]");
            //  fetch values from weatheInfo object and put it UI elements

            cityname.innerText = weatherInfo?.name;
            countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
            desc.innerText = weatherInfo?.weather?.[0]?.description;
            weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
            temp.innerText = `${weatherInfo?.main?.temp} °C`;
            windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
            humidity.innerText = `${weatherInfo?.main?.humidity}% `;
            cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
            
 
}
function getLocation(){
    if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        grantAccessBtn.style.display = "none";
        messageText.innerText = "Geolocation is not supported by this browser.";
    }
}


// Handle any errors
function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation)

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    
     if(cityName === "")
      return;
   else
     fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove('active');
  grantAccessContainer.classList.remove("active");

  try{
    const response  = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
 catch (error) {
  // console.log("Search - Api Fetch Error", error.message);
  loadingScreen.classList.remove("active");
  apiErrorContainer.classList.add("active");
  apiErrorMessage.innerText = `${error?.message}`;
  apiErrorBtn.style.display = "none";
}
}