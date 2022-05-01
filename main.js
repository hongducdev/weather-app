const APP_ID = '49a54565ca13b25774df9f69638437ce';
const input = document.querySelector('#inputApp');
const temp = document.querySelector('.temp');
const weather = document.querySelector('.weather');
const nameLocal = document.querySelector('.nameLocal');
const visibility = document.querySelector('.visibility');
const wind = document.querySelector('.wind');
const cloud = document.querySelector('.cloud');
const time = document.querySelector('.time');
const changeUI = document.querySelector('.root');
const changeUI1 = document.querySelector('.main');
const record = document.querySelector('.record');

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;

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
        nameLocal.innerHTML = data.name || '---';
        weather.innerHTML = titleCase(data.weather[0].description) || '---';
        temp.innerHTML = `${Math.round(data.main.temp)}°C`|| '---';
        visibility.innerHTML = `${data.visibility} m`|| '---';
        wind.innerHTML = `${data.wind.speed} (m/s)`|| '---';
        cloud.innerHTML = `${data.clouds.all}%`|| '---';
        setInterval(() => {
          time.innerHTML = `${today} - ${new Date().toLocaleTimeString()}`;
        }, 1000);

        if(data.weather[0].main == 'Rain'){
          changeUI.style.backgroundImage = 'url(./img/rain.jpg)';
          changeUI1.style.backgroundImage = 'url(./img/rain.jpg)';
        }

        if(data.main.temp < 20){
          changeUI.style.backgroundImage = 'url(./img/cold.jpg)';
          changeUI1.style.backgroundImage = 'url(./img/cold.jpg)';
        }

        if(data.main.temp > 30){
            changeUI.style.backgroundImage = 'url(./img/hot.jpg)';
            changeUI1.style.backgroundImage = 'url(./img/hot.jpg)';
        }
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
        nameLocal.innerHTML = data.name || '---';
        weather.innerHTML = titleCase(data.weather[0].description) || '---';
        temp.innerHTML = `${Math.round(data.main.temp)}°C`|| '---';
        visibility.innerHTML = `${data.visibility} m`|| '---';
        wind.innerHTML = `${data.wind.speed} (m/s)`|| '---';
        cloud.innerHTML = `${data.clouds.all}%`|| '---';
        setInterval(() => {
            time.innerHTML = `${today} - ${new Date().toLocaleTimeString()}`;
        }, 1000);

        if(data.weather[0].main == 'Rain'){
            changeUI.style.backgroundImage = 'url(./img/rain.jpg)';
            changeUI1.style.backgroundImage = 'url(./img/rain.jpg)';
        }

        if(data.main.temp < 20){
            changeUI.style.backgroundImage = 'url(./img/cold.jpg)';
            changeUI1.style.backgroundImage = 'url(./img/cold.jpg)';
        }

        if(data.main.temp > 30){
            changeUI.style.backgroundImage = 'url(./img/hot.jpg)';
            changeUI1.style.backgroundImage = 'url(./img/hot.jpg)';
        }
    })
}
getLocation();

//tro ly ao

// var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

var recognition = new webkitSpeechRecognition() || new SpeechRecognition();
const synth = window.speechSynthesis;
recognition.lang = 'vi-VI';
recognition.continuous = false;

const microphone = document.querySelector('.microphone');

const speak = (text) => {
  if (synth.speaking) {
      console.error('Busy. Speaking...');
      return;
  }

  const utter = new SpeechSynthesisUtterance(text);

  utter.onend = () => {
      console.log('SpeechSynthesisUtterance.onend');
  }
  utter.onerror = (err) => {
      console.error('SpeechSynthesisUtterance.onerror', err);
  }

  synth.speak(utter);
};

const handleVoice = (text) => {
  console.log( text);

  // "thời tiết tại Đà Nẵng" => ["thời tiết tại", "Đà Nẵng"]
  const handledText = text.toLowerCase();

  if (handledText.includes('thời tiết tại')) {
      const location = handledText.split('tại')[1].trim();

      console.log('location', location);
      input.value = location;
      const changeEvent = new Event('change');
      input.dispatchEvent(changeEvent);
      return;
  } else {
    input.value = handledText;
    const changeEvent = new Event('change');
    input.dispatchEvent(changeEvent);
    return;
  }
}

microphone.addEventListener('click', (e) => {
  e.preventDefault();

  recognition.start();
  microphone.style.display = 'none';
  record.style.display = 'block';
})

recognition.onspeechend = () => {
  recognition.stop();
  microphone.style.display = 'block';
  record.style.display = 'none';
}

recognition.onerror = (err) => {
  console.error(err);
  microphone.style.display = 'block';
  record.style.display = 'none';
}

recognition.onerror = function(event) {
  console.log('Speech recognition error detected: ' + event.error);
}

recognition.onresult = (e) => {
  console.log('onresult', e);
  const text = e.results[0][0].transcript;
  handleVoice(text);
}
