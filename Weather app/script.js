const searchTab = document.querySelector("[data-searchWeather]");
const userTab = document.querySelector("[data-userWeather]");
const userConatiner = document.querySelector(".weather-container");

const grantAccess = document.querySelector(".grant-location-cont");
const searchForm = document.querySelector(".search-cont");
const loadingScreen = document.querySelector(".loading-cont");
const userInfocont = document.querySelector(".user-info-cont");
const grantAccessBtn = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");


//initially variable
let currTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currTab){
        currTab.classList.remove("current-tab");
        currTab = clickedTab;
        currTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active")){
        userInfocont.classList.remove("active");
        grantAccess.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        //main pehle search tab pe tha ab weather tab pe hu
        searchForm.classList.remove("active");
        userInfocont.classList.remove("active");
        getFromSessionStorage();
    }
}

userTab.addEventListener("click", ()=>{
    //pass the clicked tab as an input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    //pass the clicked tab as an input parameter
    switchTab(searchTab);
});

//checks if coordinates are already prsent in session storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nhi mile
        grantAccess.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//grnat access to get your current coordinates
grantAccessBtn.addEventListener("click", getLocation);

//function to find the location with coordinates 
async function fetchUserWeatherInfo(coordinates){
    const {lat, long} = coordinates;
    //grant access wale ko invisible kardo
    grantAccess.classList.remove("active");
    //make loading screen visible
    loadingScreen.classList.add("active");

    //api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfocont.classList.add("active");
        renderWeatherinfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        // userInfocont.classList.remove("active");
        // alert ("Error : No data found");

    }
}

function renderWeatherinfo(weatherData){
    //firstly we will fetch all the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon= document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");

    //fetch value from weather data and put it into ui 
    cityName.innerText = weatherData?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherData?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherData?.main?.temp} °C`;
    windSpeed.innerText = `${weatherData?.wind?.speed} m/s`;
    humidity.innerText = `${weatherData?.main?.humidity}%`;
    cloud.innerText = `${weatherData?.clouds?.all}%`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        long: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
 
//search form function
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(searchInput.value === "") return;
    fetchsearchWeatherInfo(searchInput.value);
    searchInput.value = "";
});

async function fetchsearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfocont.classList.remove("active");
    grantAccess.classList.remove("active");

    try{
        const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await resp.json();
        loadingScreen.classList.remove("active");
        userInfocont.classList.add("active");
        renderWeatherinfo(data);
    }
    catch(err){
        // loadingScreen.classList.remove("active");
        // userInfocont.classList.remove("active");
        alert("City Not found");
    }
};

