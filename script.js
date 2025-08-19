const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const notFoundSection = document.querySelector('.not-found-city')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forcastItemContainer = document.querySelector('.forcast-item-container')

const apiKey='e2c800e6e211125875fd6cf7f79b13f6'

searchBtn.addEventListener('click',() => {
    if(cityInput.value.trim() !=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) =>{
    if (event.key == 'Enter' && cityInput.value.trim() !=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}

function getWeatherIcon(id){
    if(id >= 200 && id < 300) return 'thunderstorm.svg'
    if(id >= 300 && id < 400) return 'drizzle.svg'
    if(id >= 500 && id < 600) return 'rain.svg'
    if(id >= 600 && id < 700) return 'snow.svg'
    if(id >= 700 && id < 800) return 'atmosphere.svg'
    if(id === 800) return 'clear.svg'
    if(id > 800 && id < 900) return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)

    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return 
    }

    const{
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    currentDateTxt.textContent = getCurrentDate()

    await updateForcastsInfo(city)
    
    showDisplaySection(weatherInfoSection)
}

async function updateForcastsInfo(city){
    const forcastData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forcastItemContainer.innerHTML =  ''

    forcastData.list.forEach(forcastWeather =>{
        if(forcastWeather.dt_txt.includes(timeTaken) && !forcastWeather.dt_txt.includes(todayDate)){
            updateForcastItem(forcastWeather)
        }
    })
}

function updateForcastItem(weatherData){
    const{
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month:'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forcastItem = `
        <div class="forcast-item">
            <h5 class="forcast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forcast-item-img">
            <h5 class="forcast-item-temp">${Math.round(temp)}°C</h5>
        </div>
    `
    forcastItemContainer.insertAdjacentHTML('beforeend', forcastItem)

}

function showDisplaySection(sectionToShow){
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(sec => sec.style.display = 'none') 

    sectionToShow.style.display = 'flex' 
}