export default function getLocation() {
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
  
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=`;

    return url;
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

  /*
  async function getWeatherData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relative_humidity_2m`;  


  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return  
 null;
  }
}
  */