import { getLocation } from "./location.js";

//console.log(getLocation);

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

const values = Object.values(weatherCodes);

values.forEach((values) =>{
  getInformation(values);
});

function getInformation(values){
  fetch(url)
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
}


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

/*
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30
};

const values = Object.values(person);

values.forEach(value => console.log(value)); 
*/