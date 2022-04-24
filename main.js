const APP_ID = '49a54565ca13b25774df9f69638437ce';
const input = document.querySelector('#inputApp');
const nameCity = document.querySelector('.name-city');
const temp = document.querySelector('.temp');
const weather = document.querySelector('.weather');
const icon = document.querySelector('.weather-icon');
const tempMin = document.querySelector('.temp_min');
const tempMax = document.querySelector('.temp_max');


function titleCase(string) {
    let sentence = string.toLowerCase().split(" ");
    for(var i = 0; i< sentence.length; i++){
       sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
}

input.addEventListener('change', (e) => {
    console.log(e.target.value);
    const url_check = `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&lang=vi&units=metric&appid=${APP_ID}`;
    fetch(url_check)
    .then(async res => {
        const data = await res.json();
        nameCity.innerHTML = data.name || '---';
        weather.innerHTML = titleCase(data.weather[0].description) || '---';
        icon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        temp.innerHTML = `${Math.round(data.main.temp)}°C`|| '---';
        tempMin.innerHTML = Math.round(data.main.temp_min) || '---';
        tempMax.innerHTML = Math.round(data.main.temp_max) || '---';
    })
})


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  
  const url_location = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=metric&lang=vi`;
  console.log(url_location);

  fetch(url_location)
    .then(async res => {
        const data = await res.json();
        nameCity.innerHTML = data.name || '---';
        weather.innerHTML = titleCase(data.weather[0].description) || '---';
        icon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        temp.innerHTML = `${Math.round(data.main.temp)}°C`|| '---';
        tempMin.innerHTML = Math.round(data.main.temp_min) || '---';
        tempMax.innerHTML = Math.round(data.main.temp_max) || '---';
    })
}
getLocation();

