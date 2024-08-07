document.getElementById("toggleDarkMode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  //console.log("Dark mode toggled");
});

function initializeCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
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
  setInterval(() => {
    moveToNextSlide();
  }, 3000); // Change slide every 3 seconds
}

initializeCarousel("current-weather-carousel");
initializeCarousel("other-days-carousel");
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
  const weatherCodes = ["temperature_2m", "snowfall", "rain"];

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

  // Process temperature data first
  if (temperatureData) {
    let tempData = temperatureData.temperature_2m;
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
      let snowData = obj.snowfall;
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
      let rainData = obj.rain;
      let totalrain = 0;
      let hours = 24 - new Date().getHours();
      rainData.forEach((element) => {
        for (let i = 0; i < hours; i++) {
          totalrain += element;
        }
      });
      averageRain = totalrain / hours;
      //console.log(averageRain);
    }
  });
  displayUI(averagetTemp, averageRain, averageSnow);
}

function displayUI(averagetTemp, averageRain, averageSnow){
  let card = document.crea
}

window.addEventListener("load", getLocation);

export default displayUI
/*
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
    */
