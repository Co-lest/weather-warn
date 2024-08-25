let headDiv = document.querySelector(".headDiv");
let track = document.querySelector("#current-weather-carousel .carousel-track");
let track2 = document.querySelector("#other-days-carousel .carousel-track");

document.getElementById("toggleDarkMode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

let carousel;

function initializeCarousel(carouselId) {
  carousel = document.getElementById(carouselId);
  const track = carousel.querySelector(".carousel-track");
  const cards = Array.from(track.children);

  if (cards.length === 0) {
    console.error("No cards found in the carousel.");
    return;
  }

  const prevButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");
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
  }

  function moveToPrevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = cards.length - 1; // Loop back to the last slide
    }
    track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
  }

  // Automatic carousel sliding
  setInterval(() => {
    moveToNextSlide();
  }, 3000);
}

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
  const weatherCodes = ["temperature_2m", "snowfall", "rain", "cloud_cover"];

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
        if (dataArr.length === 4) {
          // Adjusted to 4 as there are four weather codes
          warnUser(dataArr);
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

let averagetTemp;
let averageRain;
let averageSnow;
let averageCloud;

function warnUser(dataArr) {
  // Separate temperature data from other data
  const temperatureData = dataArr.find((obj) =>
    obj.hasOwnProperty("temperature_2m")
  );
  const otherData = dataArr.filter(
    (obj) => !obj.hasOwnProperty("temperature_2m")
  );

  let tempData;
  let snowData;
  let rainData;
  let cloudcoverData;

  // Process temperature data first
  if (temperatureData) {
    tempData = temperatureData.temperature_2m;
    let totaltemp = 0;
    let hours = 24 - new Date().getHours();
    for (let i = 0; i < hours; i++) {
      totaltemp += tempData[i];
    }
    averagetTemp = totaltemp / hours;
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
    } else if (obj.hasOwnProperty("rain")) {
      rainData = obj.rain;
      let totalrain = 0;
      let hours = 24 - new Date().getHours();
      for (let i = 0; i < hours; i++) {
        totalrain += rainData[i];
      }
      averageRain = totalrain / hours;
    } else {
      cloudcoverData = obj.cloud_cover;
      let totalcoud = 0;
      let hours = 24 - new Date().getHours();
      for (let i = 0; i < hours; i++) {
        totalcoud += cloudcoverData[i];
      }
      averageCloud = totalcoud / hours;
    }
  });
  //is_day_bool
  displayUI(averagetTemp,averageRain, averageSnow, tempData, rainData, snowData, cloudcoverData,averageCloud);
  displayDays(averagetTemp, averageRain, averageSnow,averageCloud, tempData, rainData, snowData, cloudcoverData);
}

function displayUI(averagetTemp, averageRain, averageSnow, tempData, rainData, snowData, cloudcoverData, averageCloud) {
  let card1 = document.createElement("div");
  let card2 = document.createElement("div");
  let imageWeather = document.createElement("img");
  let par1 = document.createElement("p");
  let par2 = document.createElement("p");
  let par3 = document.createElement("p");
  let par4 = document.createElement("p"); 

  card1.setAttribute("class", "card");
  card2.setAttribute("class", "card");

  let now = new Date();

  if (averageRain > 2.5) {
    par4.innerHTML = `Expect heavy rains today (check hourly data for clarification)`;
  } else if (averageRain >= 0.25 && averageRain <= 2.5) {
    par4.innerHTML = `Expect light rains today (check hourly data for clarification)`;
  } else if (averageCloud <= 60) {
    par1.innerHTML = `Today will be sunny. Have a nice day!`;
  } else if (averageCloud > 60) {
    par4.innerHTML = `Today will just be cloudy. No rain expected today. Have a nice day!`;
  } else if (averageSnow > 0.5) {
    par1.innerHTML = `Expect high snow inches! Snow falling from roofs are dangerous!`;
  }

  if (averageRain > 2.5) {
    imageWeather.src = `./utils/storm.png`;
    par1.innerHTML = `Storm`;
  } else if (averageRain >= 0.25 && averageRain <= 2.5) {
    imageWeather.src = `./utils/rain.png`;
    par1.innerHTML = `Rain`;
  } else if (averageCloud <= 60) {
    imageWeather.src = `./utils/sun.png`;
    par1.innerHTML = `Sun`;
  } else if (averageCloud > 60) {
    imageWeather.src = `./utils/cloudy.png`;
    par1.innerHTML = `Cloudy`;
  } else if (averageSnow > 0.5) {
    imageWeather.src = `./utils/snowflake.png`;
    par1.innerHTML = `Snow`;
  }

  par2.innerHTML = `${Math.round(averagetTemp)}°C`;
  par3.innerHTML = `${now.getDate()} / ${
    now.getMonth() + 1
  } / ${now.getFullYear()}`;

  card1.appendChild(imageWeather);
  card1.appendChild(par1);
  card1.appendChild(par2);
  card1.appendChild(par3);
  card2.appendChild(par4);

  headDiv.appendChild(card1);
  headDiv.appendChild(card2);

  displayUISmall(tempData, rainData, snowData, cloudcoverData);
}

function displayUISmall(tempData, rainData, snowData, cloudcoverData) {
  let arrCount = 0;

  if (!track) {
    console.error("Track element not found.");
    return;
  }

  tempData.forEach((element) => {
    let smaller_card = document.createElement("div");
    let headh1 = document.createElement("h1");
    let imageWeather = document.createElement("img");
    let par1 = document.createElement("p");
    let par2 = document.createElement("p");
    let par3 = document.createElement("p");
    let par4 = document.createElement("p");
    let now = new Date();

    smaller_card.setAttribute("class", "card");
    headh1.innerHTML = "Weather App";
    now.setHours(now.getHours() + arrCount);
    let logic = "AM";
    if (now.getHours() > 11) {
      logic = "PM";
    }
    let is_day_boolTruth;
    if (now.getHours() < 7) {
      is_day_boolTruth = 0;
    } else if (now.getHours() < 18) {
      is_day_boolTruth = 1;
    } else {
      is_day_boolTruth = 0;
    }
    par2.innerHTML = `${Math.round(element)}°C`;
    par3.innerHTML = `${now.getDate()} / ${
      now.getMonth() + 1
    } / ${now.getFullYear()}`;
    par4.innerHTML = `${now.getHours()}:00 ${logic}`;
  
    if (rainData[arrCount] > 0.3) {
      imageWeather.src = `./utils/storm.png`;
      par1.innerHTML = `Storm`;
    } else if (rainData[arrCount] >= 0.1 && rainData[arrCount] <= 0.29 && is_day_boolTruth) {
      imageWeather.src = `./utils/rain.png`;
      par1.innerHTML = `Rain`;
    } else if (rainData[arrCount] >= 0.1 && rainData[arrCount] <= 0.29 && !is_day_boolTruth) {
      imageWeather.src = `./utils/moonrain.png`;
      par1.innerHTML = `Rainy night`;
    } else if (cloudcoverData[arrCount] < 65 && is_day_boolTruth) {
      imageWeather.src = `./utils/sun.png`;
      par1.innerHTML = `Sun`;
    } else if (cloudcoverData[arrCount] >= 65 && is_day_boolTruth) {
      imageWeather.src = `./utils/cloudy.png`;
      par1.innerHTML = `Cloudy`;
    } else if (cloudcoverData[arrCount] < 65 && !is_day_boolTruth) {
      imageWeather.src = `./utils/moon.png`;
      par1.innerHTML = `Moon`;
    } else if (cloudcoverData[arrCount] >= 65 && !is_day_boolTruth) {
      imageWeather.src = `./utils/moonclouds.png`;
      par1.innerHTML = `Cloudy night`;
    }else if (snowData[arrCount] > 0.5) {
      imageWeather.src = `./utils/snowflake.png`;
      par1.innerHTML = `Snow`;
    }

    smaller_card.appendChild(headh1);
    smaller_card.appendChild(imageWeather);
    smaller_card.appendChild(par1);
    smaller_card.appendChild(par2);
    smaller_card.appendChild(par4);
    smaller_card.appendChild(par3);
    track.appendChild(smaller_card);

    arrCount++;
  });

  // Initialize the carousels only after the smaller cards have been added
  initializeCarousel("current-weather-carousel");
}

function displayDays(averagetTemp, averageRain, averageSnow, averageCloud, tempData, rainData, snowData, cloudcoverData) {
  console.log(cloudcoverData);
  let arrCount = 0;
  let now = new Date();
  let hours = 24 - new Date().getHours();
  let dayCount = 0;

  for (let index = 0; index < 7; index++) {
    if (arrCount === 0) {
      let card2 = document.createElement("div");
      let imageWeather = document.createElement("img");
      let par1 = document.createElement("p");
      let par2 = document.createElement("p");
      let par3 = document.createElement("p");
      let par4 = document.createElement("h1");

      par4.innerHTML = "Weather App";
      par4.setAttribute("class", "heading");

      card2.setAttribute("class", "smaller-card");
      //console.log(averageCloud);

      if (averageRain > 2.5) {
        imageWeather.src = `./utils/storm.png`;
        par1.innerHTML = `Storm`;
      } else if (averageRain > 0.25 && averageRain <= 2.5) {
        imageWeather.src = `./utils/rain.png`;
        par1.innerHTML = `Rain`;
      } else if (averageCloud <= 65) {
        imageWeather.src = `./utils/sun.png`;
        par1.innerHTML = `Sun`;
      } else if (averageCloud > 65) {
        imageWeather.src = `./utils/cloudy.png`;
        par1.innerHTML = `Cloudy`;
      } else if (averageSnow > 0.5) {
        imageWeather.src = `./utils/snowflake.png`;
        par1.innerHTML = `Snow`;
      }

      par2.innerHTML = `${Math.round(averagetTemp)}°C`;
      now.setDate(new Date().getDate() + dayCount);
      par3.innerHTML = `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`;

      card2.appendChild(par4);
      card2.appendChild(imageWeather);
      card2.appendChild(par1);
      card2.appendChild(par2);
      card2.appendChild(par3);

      track2.appendChild(card2);
      arrCount += hours;
      dayCount++
    } else if (arrCount + 24 < tempData.length - 1) {
      let averageTempActual = 0;
      let averageSnowActual = 0;
      let averageRainActual = 0;
      let averageCloudActual = 0;
      let actualArrCount = arrCount;
      arrCount += 24;

      for (let i = actualArrCount; i < arrCount - 1; i++) {
        averageTempActual += tempData[i];
        averageSnowActual += snowData[i];
        averageRainActual += rainData[i];
        averageCloudActual += cloudcoverData[i];
      }

      averageTempActual = averageTempActual / (arrCount - actualArrCount);
      averageSnowActual = averageSnowActual / (arrCount - actualArrCount);
      averageCloudActual = averageCloudActual / (arrCount - actualArrCount);
      averageRainActual = averageRainActual / (arrCount - actualArrCount);

      let card2 = document.createElement("div");
      let imageWeather = document.createElement("img");
      let par1 = document.createElement("p");
      let par2 = document.createElement("p");
      let par3 = document.createElement("p");
      let par4 = document.createElement("h1");

      par4.innerHTML = "Weather App";
      par4.setAttribute("class", "heading");

      card2.setAttribute("class", "smaller-card");

      if (averageRainActual > 2.5) {
        imageWeather.src = `./utils/storm.png`;
        par1.innerHTML = `Storm`;
      } else if (averageRainActual >= 0.25 && averageRainActual <= 2.5) {
        imageWeather.src = `./utils/rain.png`;
        par1.innerHTML = `Rain`;
      } else if (averageCloudActual <= 65) {
        imageWeather.src = `./utils/sun.png`;
        par1.innerHTML = `Sun`;
      } else if (averageCloudActual > 65) {
        imageWeather.src = `./utils/cloudy.png`;
        par1.innerHTML = `Cloudy`;
      } else if (averageSnowActual > 0.5) {
        imageWeather.src = `./utils/snowflake.png`;
        par1.innerHTML = `Snow`;
      }

      par2.innerHTML = `${Math.round(averageTempActual)}°C`;
      now.setDate(new Date().getDate() + dayCount);
      par3.innerHTML = `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`;

      card2.appendChild(par4);
      card2.appendChild(imageWeather);
      card2.appendChild(par1);
      card2.appendChild(par2);
      card2.appendChild(par3);

      track2.appendChild(card2);
      dayCount++;
    } else {
      let averageTempActual = 0;
      let averageSnowActual = 0;
      let averageRainActual = 0;
      let averageCloudActual = 0;
      let actualArrCount = arrCount;

      for (let i = arrCount; i < tempData.length - 1; i++) {
        averageTempActual += tempData[i];
        averageSnowActual += snowData[i];
        averageRainActual += rainData[i];
        averageCloudActual += cloudcoverData[i];
      }
      averageTempActual = averageTempActual / (tempData.length - actualArrCount);
      averageSnowActual = averageSnowActual / (tempData.length - actualArrCount);
      averageCloudActual = averageCloudActual / (tempData.length - actualArrCount);
      averageRainActual = averageRainActual / (tempData.length - actualArrCount);

      let card2 = document.createElement("div");
      let imageWeather = document.createElement("img");
      let par1 = document.createElement("p");
      let par2 = document.createElement("p");
      let par3 = document.createElement("p");
      let par4 = document.createElement("h1");

      par4.innerHTML = "Weather App";
      par4.setAttribute("class", "heading");

      card2.setAttribute("class", "smaller-card");
      console.log(averageCloudActual);

      if (averageRainActual > 2.5) {
        imageWeather.src = `./utils/storm.png`;
        par1.innerHTML = `Storm`;
      } else if (averageRainActual >= 0.25 && averageRainActual <= 2.5) {
        imageWeather.src = `./utils/rain.png`;
        par1.innerHTML = `Rain`;
      } else if (averageCloudActual <= 65) {
        imageWeather.src = `./utils/sun.png`;
        par1.innerHTML = `Sun`;
      } else if (averageCloudActual > 65) {
        imageWeather.src = `./utils/cloudy.png`;
        par1.innerHTML = `Cloudy`;
      } else if (averageSnowActual > 0.5) {
        imageWeather.src = `./utils/snowflake.png`;
        par1.innerHTML = `Snow`;
      }

      par2.innerHTML = `${Math.round(averageTempActual)}°C`;
      now.setDate(new Date().getDate() + dayCount);
      par3.innerHTML = `${now.getDate()} / ${now.getMonth() + 1} / ${now.getFullYear()}`;

      card2.appendChild(par4);
      card2.appendChild(imageWeather);
      card2.appendChild(par1);
      card2.appendChild(par2);
      card2.appendChild(par3);

      track2.appendChild(card2);
    }
  }
  initializeCarousel("other-days-carousel");
}

window.addEventListener("load", getLocation);
