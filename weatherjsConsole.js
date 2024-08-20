let url;
let longitude;
let latitude;

getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    par.textContent = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  latitude = latitude.toFixed(2);
  longitude = longitude.toFixed(2);
  url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=`;
  fetchWeatherData(url);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      par.textContent = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      par.textContent = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      par.textContent = "The request to get user location timed out.";
      break;
    default:
      par.textContent = "An unknown error occurred.";
  }
}

function fetchWeatherData(url) {
  const weatherCodes = [
    "temperature_2m",
    "relative_humidity_2m",
    "dew_point_2m",
    "cloud_cover",
    "wind_speed_10m",
    "shortwave_radiation",
    "snowfall",
    "rain",
    "visibility"
  ];

  weatherCodes.forEach((element) => {
    let finalUrl = url + element;
    getInformation(finalUrl);
  });
}

let dataArr = [];

function getInformation(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.hasOwnProperty("error")) {
        console.error("Error:", data.error);
      } else {
        const weatherData = data.hourly;
        dataArr.push(weatherData);
        if (dataArr.length === 9) {
          // Call warnUser only when all data is fetched
          warnUser(dataArr);
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function warnUser(dataArr) {
  // Separate temperature data from other data
  const temperatureData = dataArr.find(obj => obj.hasOwnProperty('temperature_2m'));
  const otherData = dataArr.filter(obj => !obj.hasOwnProperty('temperature_2m'));

  // Process temperature data first
  if (temperatureData) {
    let tempData = temperatureData.temperature_2m;
    tempData.forEach((element, countTemp) => {
      if (element > 30) {
        let now = new Date();
        now.setHours(now.getHours() + countTemp);
        console.log(`The temperature might be extremely high on ${now}`);
      } else if (element < 0) {
        let now = new Date();
        now.setHours(now.getHours() + countTemp);
        console.log(`The temperature might be extremely low on ${now}: below freezing point!`);
      }
    });
  }

  // Process other data
  otherData.forEach((obj) => {
    if (obj.hasOwnProperty('relative_humidity_2m')) {
      let humidData = obj.relative_humidity_2m;
      humidData.forEach((element, countHumid) => {
        if (element > 70) {
          let now = new Date();
          now.setHours(now.getHours() + countHumid);
          console.log(`The humidity might be extremely high on ${now}: above 70%!`);
        } else if (element < 20) {
          let now = new Date();
          now.setHours(now.getHours() + countHumid);
          console.log(`The humidity might be extremely low on ${now}: below 20% expect dehydration!`);
        }
      });
    } else if (obj.hasOwnProperty('dew_point_2m')) {
      let dewData = obj.dew_point_2m;
      dewData.forEach((element, countDew) => {
        if (element > 20) {
          let now = new Date();
          now.setHours(now.getHours() + countDew);
          console.log(`The dew might be extremely high on ${now}. Be weary of slippery fields!`);
        }
      });
    } else if (obj.hasOwnProperty('cloud_cover')) {
      let cloudcoverData = obj.cloud_cover;
      cloudcoverData.forEach((element, cloudcoverCount) => {
        if (element > 90) {
          let now = new Date();
          now.setHours(now.getHours() + cloudcoverCount);
          console.log(`The sky visibility might be low on ${now}: (90% - 100%) planes should keep watch!`);
        }
      });
    } else if (obj.hasOwnProperty('wind_speed_10m')) {
      let windspeedData = obj.wind_speed_10m;
      windspeedData.forEach((element, windspeedCount) => {
        if (element > 40) {
          let now = new Date();
          now.setHours(now.getHours() + windspeedCount);
          console.log(`The wind speed/strength might be extremely high on ${now}: (40km/hr) Expect turbulences!`);
        }
      });
    } else if (obj.hasOwnProperty('shortwave_radiation')) {
      let radiData = obj.shortwave_radiation;
      radiData.forEach((element, radiCount) => {
        if (element > 400) {
          let now = new Date();
          now.setHours(now.getHours() + radiCount);
          console.log(`The shortwave radiation might be dangerous on ${now}: (400W/m2) Nothing you can really do about it but you're pretty much at risk!`);
        }
      });
    } else if (obj.hasOwnProperty('snowfall')) {
      let snowData = obj.snowfall;
      console.log(snowData);
      snowData.forEach((element, snowCount) => {
        if (element > 7.6) {
          let now = new Date();
          now.setHours(now.getHours() + snowCount);
          console.log(`The snow might be thick on ${now}. Be careful of snow falling from rooftops and not to get stuck in it. Carry high boots!`);
        }
      });
    } else if (obj.hasOwnProperty('rain')) {
      let rainData = obj.rain;
      rainData.forEach((element, rainCount) => {
        if (element > 7.6) {
          let now = new Date();
          now.setHours(now.getHours() + rainCount);
          console.log(`Expect heavy rains on: ${now}. Adviced to stay indoors.`);
        } else if (element > 2.5 && element < 7.6) {
          let now = new Date();
          now.setHours(now.getHours() + rainCount);
          console.log(`Medium rain expected: just carry umbrellas.`);
        } else if (element < 2.5) {
          let now = new Date();
          now.setHours(now.getHours() + rainCount);
          console.log(`Light rain expected: just carry umbrellas.`);
        }
      });
    } else if (obj.hasOwnProperty('visibility')) {
      let visibilityData = obj.visibility;
      visibilityData.forEach((element, visibilityCount) => {
        if (element > 2000) {
          let now = new Date();
          now.setHours(now.getHours() + visibilityCount);
          console.log(`The visibility might be extremely low on ${now}. Drivers are advised to drive slowly and carefully!`);
        }
      });
    }
  });
}

/*let headDiv = document.querySelector(".headDiv");

document.getElementById("toggleDarkMode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  //console.log("Dark mode toggled");
});

let carousel;

function initializeCarousel(carouselId) {
  carousel = document.getElementById(carouselId);
  const prevButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");
  const track = carousel.querySelector(".carousel-track");
  const cards = Array.from(track.children);
  const cardWidth = cards[0].getBoundingClientRect().width;
  let currentIndex = 0;

  nextButton.addEventListener("click", () => {
    moveToNextSlide();
  });

  prevButton.addEventListener("click", () => {
    moveToPrevSlide();
  });

  function moveToNextSlide() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to the first slide
    }
    track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
    //console.log("Moved to next slide", currentIndex);
  }

  function moveToPrevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = cards.length - 1; // Loop back to the last slide
    }
    track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
    //console.log("Moved to prev slide", currentIndex);
  }

  // Automatic carousel sliding
 // Change slide every 3 seconds
 setInterval(() => {
  moveToNextSlide();
}, 3000);
}

//console.log("Carousels initialized");

///

let url;
let longitude;
let latitude;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    par.textContent = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  latitude = latitude.toFixed(2);
  longitude = longitude.toFixed(2);
  url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=`;
  fetchWeatherData(url);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      par.textContent = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      par.textContent = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      par.textContent = "The request to get user location timed out.";
      break;
    default:
      par.textContent = "An unknown error occurred.";
  }
}

function fetchWeatherData(url) {
  const weatherCodes = ["temperature_2m", "snowfall", "rain", "is_day"];

  weatherCodes.forEach((element) => {
    let finalUrl = url + element;
    getInformation(finalUrl);
  });
}

let dataArr = [];

function getInformation(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.hasOwnProperty("error")) {
        console.error("Error:", data.error);
      } else {
        const weatherData = data.hourly;
        dataArr.push(weatherData);
        if (dataArr.length === 3) {
          warnUser(dataArr);
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

let averagetTemp;
let averageRain;
let averageSnow;

function warnUser(dataArr) {
  // Separate temperature data from other data
  const temperatureData = dataArr.find((obj) => obj.hasOwnProperty("temperature_2m"));
  const otherData = dataArr.filter((obj) => !obj.hasOwnProperty("temperature_2m"));

  let tempData;
  let snowData;
  let rainData;
  let is_day_bool;
  let is_day_arr;

  // Process temperature data first
  if (temperatureData) {
    tempData = temperatureData.temperature_2m;
    //console.log(tempData);
    let totaltemp = 0;
    let hours = 24 - new Date().getHours();
    for (let i = 0; i < hours; i++) {
      totaltemp += tempData[i];
    }
    averagetTemp = totaltemp / hours;
    //console.log(averagetTemp);
  }
  // Process other data
  otherData.forEach((obj) => {
    if (obj.hasOwnProperty("snowfall")) {
      snowData = obj.snowfall;
      let totalsnow = 0;
      let hours = 24 - new Date().getHours();
      snowData.forEach((element) => {
        for (let i = 0; i < hours; i++) {
          totalsnow += element;
        }
      });
      averageSnow = totalsnow / hours;
      //console.log(averageSnow);
      
    } else if (obj.hasOwnProperty("rain")) {
      rainData = obj.rain;
      let totalrain = 0;
      let hours = 24 - new Date().getHours();
      for (let i = 0; i < hours; i++) {
        totalrain += rainData[i];
      }
      averageRain = totalrain / hours;
    } else if (obj.hasOwnProperty("is_day")){
      is_day_arr = obj.is_day;
      is_day_bool = is_day_arr[0];
    }
  });
  displayUI(averagetTemp, averageRain, averageSnow, is_day_bool, tempData, rainData, snowData, is_day_arr);
}

function displayUI(averagetTemp, averageRain, averageSnow, is_day_bool, tempData, rainData, snowData, is_day_arr){
  let card1 = document.createElement("div");
  let imageWeather = document.createElement("img");
  let par1 = document.createElement("p");
  let par2 = document.createElement("p");
  let par3 = document.createElement("p");

  card1.setAttribute("class", "card");

  //console.log(is_day_bool);
  
  if (averageRain > 2.5) {
    imageWeather.src = `./utils/storm.png`;
    par1.innerHTML = `Strom`;
  } else if (averageRain < 2.5 && averageRain > 0.25){
    imageWeather.src = `./utils/cloudy.png`;
    par1.innerHTML = `Cloudy`;
  } else if (averageRain < 2.5 && averageRain > 0.25 && !(is_day_bool)){
    imageWeather.src = `./utils/moonclouds.png`;
    par1.innerHTML = `Cloudy`;
  } else if (averageRain < 2.5 && is_day_bool){
    imageWeather.src = `./utils/sun.png`;
    par1.innerHTML = `Sun`;
  } else if (averageRain < 2.5 && !(is_day_bool)){
    imageWeather.src = `./utils/moon.png`;
    par1.innerHTML = `Moon`;
  } else if (averageSnow > 0.5){
    imageWeather.src = `./utils/snowflake.png`;
    par1.innerHTML = `Snow`;
  }

  let now = new Date();

  par2.innerHTML = `${Math.round(averagetTemp)}°C`;
  par3.innerHTML = `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`

  card1.appendChild(imageWeather);
  card1.appendChild(par1);
  card1.appendChild(par2);
  card1.appendChild(par3);

  headDiv.appendChild(card1);

  displayUISmall(tempData, rainData, snowData, is_day_arr);
}

function displayUISmall(tempData, rainData, snowData, is_day_arr) {
  //console.log(tempData);
  let arrCount = 0;

  tempData.forEach((element) => {
    let smaller_card = document.createElement("div");
    let headh1 = document.createElement("h1");
    let imageWeather = document.createElement("img");
    let par1 = document.createElement("p");
    let par2 = document.createElement("p");
    let par3 = document.createElement("p");
    let now = new Date();

    smaller_card.setAttribute("class", "smaller_card");
    headh1.innerHTML = "Weather App";
    par2.innerHTML = `${Math.random(element)}°C`;
    par3.innerHTML = `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`;

    if (rainData[arrCount] > 2.5) {
      imageWeather.src = `./utils/storm.png`;
      par1.innerHTML = `Strom`;
    } else if (rainData[arrCount] < 2.5 && rainData[arrCount] > 0.25 && is_day_arr[arrCount]){
      imageWeather.src = `./utils/cloudy.png`;
      par1.innerHTML = `Cloudy`;
    } else if (rainData[arrCount] < 2.5 && rainData[arrCount] > 0.25 && !(is_day_arr[arrCount])){
      imageWeather.src = `./utils/moonclouds.png`;
      par1.innerHTML = `Cloudy`;
    } else if (rainData[arrCount] < 2.5 && is_day_arr[arrCount]){
      imageWeather.src = `./utils/sun.png`;
      par1.innerHTML = `Sun`;
    } else if (rainData[arrCount] < 2.5 && !(is_day_arr[arrCount])){
      imageWeather.src = `./utils/moon.png`;
      par1.innerHTML = `Moon`;
    } else if (snowData[arrCount] > 0.5){
      imageWeather.src = `./utils/snowflake.png`;
      par1.innerHTML = `Snow`;
    }

    smaller_card.appendChild(headh1);
    smaller_card.appendChild(imageWeather);
    smaller_card.appendChild(par1);
    smaller_card.appendChild(par2);
    smaller_card.appendChild(par3);
    track.appendChild(smaller_card);
    arrCount++;
  })
  initializeCarousel("current-weather-carousel");
  initializeCarousel("other-days-carousel");
}

window.addEventListener("load", getLocation);*/