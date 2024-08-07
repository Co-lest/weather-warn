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