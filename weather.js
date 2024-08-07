const btn = document.querySelector("#btn");
const par = document.querySelector("#par");

const weatherCodes = {
  temperature: "temperature_2m",
  humidity: "relative_humidity_2m",
  dewpoint: "dew_point_2m",
  apparenttemperature: "apparent_temperature",
  atmosphericpressure: "pressure_msl",
  cloudcover: "cloud_cover",
  windspeed: "wind_speed_10m",
  shortwaveradiation: "shortwave_radiation",
  snowfall: "snowfall",
  rain: "rain",
  snowdepth: "snow_depth",
  visibility: "visibility"
}

/*const values = Object.values(weatherCodes);

values.forEach((values) =>{
  getInformation(values);
});*/

let url;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    par.textContent = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  //par.textContent = "Latitude: " + latitude + "<br>Longitude: " + longitude;

  latitude = latitude.toFixed(2);
  longitude = longitude.toFixed(2);

  //console.log(`Latitude: ${latitude} and Longitude: ${longitude}`);

  url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=d`;
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
getLocation();

function getInformation(){
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.hasOwnProperty("error")) {
        console.error("Error:", data.error);
      } else {
        const temperatures = data.hourly.temperature_2m;

        // Loop through temperatures and build the content string
        let content = "";
        temperatures.forEach((element) => {
          content += element + "°C, ";
        });

        content = content.slice(0, -2);

        par.textContent = content;

        const maxTemp = Math.max(...temperatures);
        const minTemp = Math.min(...temperatures);

        const now = new Date().getDate();

        if (maxTemp > 39) {
          console.log(`There is very high temperature: ${maxTemp}°C`);
        } else if (minTemp < -29) {
          console.log(`There is Very low temperature: ${minTemp}°C`);
        } else {
          console.log(`The weather seems to be all good: ${temperatures[0]}`);
        }
        //console.log("Maximum temperature:", maxTemp, "°C");
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}
getInformation();

/*
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30
};

const values = Object.values(person);

values.forEach(value => console.log(value)); 
*/

/*
fetch(url + values)
    .then((response) => response.json())
    .then((data) => {
      if (data.hasOwnProperty("error")) {
        console.error("Error:", data.error);
      } else {
        const temperatures = data.hourly.values;

        // Loop through temperatures and build the content string
        let content = "";
        temperatures.forEach((element) => {
          content += element + "°C, ";
        });

        content = content.slice(0, -2);

        par.textContent = content;

        const maxTemp = Math.max(...temperatures);
        const minTemp = Math.min(...temperatures);

        if (maxTemp > 39) {
          console.log(`There is very high temperature: ${maxTemp}°C`);
        } else if (minTemp < 29) {
          console.log(`There is Very low temperature: ${minTemp}°C`);
        } else {
          console.log(`The weather seems to be all good.`);
        }
        //console.log("Maximum temperature:", maxTemp, "°C");
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
*/

btn.addEventListener("click", () => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.hasOwnProperty("error")) {
        console.error("Error:", data.error);
      } else {
        const temperatures = data.hourly.temperature_2m;

        // Loop through temperatures and build the content string
        let content = "";
        temperatures.forEach((element) => {
          content += element + "°C, ";
        });

        content = content.slice(0, -2);

        par.textContent = content;

        const maxTemp = Math.max(...temperatures);
        const minTemp = Math.min(...temperatures);

        if (maxTemp > 39) {
          console.log(`There is very high temperature: ${maxTemp}°C`);
        } else if (minTemp < 29) {
          console.log(`There is Very low temperature: ${minTemp}°C`);
        } else {
          console.log(`The weather seems to be all good.`);
        }
        //console.log("Maximum temperature:", maxTemp, "°C");
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
});


fetch('https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relative_humidity_2m')
  .then(async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Check for API-specific error message (optional)
    if (data.hasOwnProperty("error")) {
      console.error("Error:", data.error);
      return; // Handle or return early if API indicates an error
    }

    // Access hourly data based on API structure (adjust the path as needed)
    const hourlyData = data.hourly.data; // Assuming "data" is the outer object with hourly data

    let content = "";
    hourlyData.forEach((element) => {
      const humidity = element.relativehumidity_2m; // Assuming relative humidity is in "relativehumidity_2m" property
      content += `${humidity}%, `;
    });

    content = content.slice(0, -2); // Remove trailing comma and space
    par.textContent = content;

    const maxHumidity = Math.max(...hourlyData.map(item => item.relativehumidity_2m));
    const minHumidity = Math.min(...hourlyData.map(item => item.relativehumidity_2m));

    if (maxHumidity > 70) {
      console.log(`Very high humidity: ${maxHumidity}%`);
    } else if (minHumidity < 30) {
      console.log(`Very low humidity: ${minHumidity}%`);
    } else {
      console.log(`Humidity seems to be moderate.`);
    }
  })
  .catch((error) => console.error("Error fetching data:", error));
