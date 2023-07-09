const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12?'PM':'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes) + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){
    let {temp, humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
    <img src="http://openweathermap.org/img/wn//${data.current.weather[0].icon}@2x.png" alt="weather icon" class="w-icon center">
    </div>
    <div class="weather-item">
        <div><h1 class = "center">${temp}&#176;C</h1></div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}hPa</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed &nbsp;</div>
        <div>${wind_speed}km/h</div>
    </div>

    <div class="weather-item">
        <div>Sunrise </div>
        <div>${window.moment(sunrise * 1000).format('HH:mm:ss')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm:ss')}</div>
    </div>
    
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Get references to HTML elements
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');

// Add event listener to the search button
searchButton.addEventListener('click', searchWeather);

// Function to fetch weather data and display it
function searchWeather() {
  const cityName = cityInput.value.trim();

  if (cityName !== '') {
    const url = `${apiUrl}?q=${cityName}&appid=${API_KEY}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const temperature = Math.round(data.main.temp - 273.15);
        const humidity = data.main.humidity;
        const realFeel = Math.round(data.main.feels_like - 273.15);
        const chanceOfRain = data.clouds.all;
        const pressure = data.main.pressure;

        weatherInfo.innerHTML =
                                 `<strong><h1></strong> ${temperature}°C</h1>
                                  <p><strong>City:</strong> ${data.name}</p>
                                  <p><strong>Humidity:</strong> ${humidity}%</p>
                                  <p><strong>Real Feel:</strong> ${realFeel}°C</p>
                                  <p><strong>Chance of Rain:</strong> ${chanceOfRain}%</p>
                                  <p><strong>Pressure:</strong> ${pressure} hPa</p>`;
      })
      .catch(error => {
        weatherInfo.innerHTML = `<p class="error">Error: ${error.message}</p>`;
      });
  } else {
    weatherInfo.innerHTML = '<p class="error">Please enter a city name.</p>';
  }
}
