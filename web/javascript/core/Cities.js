import View from './base/View.js';

export default class Cities extends View {

    static TEMPLATE() {
        return `
            <div class="cities">
            </div>
        `;
    }

    static CITY_TEMPLATE(cityName, weather) {
        return `
            <div class="animate__animated animate__zoomIn">
                
                <div class="weather ${weather.currentPeriod}">
                    <div class="name">${weather.name}</div>
                    <div class="icon ${weather.icon}"></div>
                    
                    <div class="description">${weather.description}</div>
                    <div class="current-temp">${weather.temperature}</div>
                    <div class="stats">
                        
                        <div class="label">Feels like:</div>
                        <div>${weather.feels_like}</div>

                        <div class="label">Min - Max:</div>
                        <div>${weather.temperature_minimum} - ${weather.temperature_maximum}</div>
                        
                        <div class="label">Humidity:</div>
                        <div>${weather.humidity} %</div>

                        <div class="label">Pressure:</div>
                        <div>${weather.pressure} hPa</div>

                    </div>
                </div>

                <div class="city-image">
                    <a href="https://pixabay.com/images/search/${encodeURIComponent(weather.name)}/" target="_blank">
                        <img src="${weather.city_image}" />
                    </a>
                </div>

                <div class="information">
                    <div>
                        <img src="https://www.countryflags.io/${weather.country_code}/flat/64.png">
                    </div>
                    <div class="clock">
                        <a href="https://time.is/${encodeURIComponent(weather.name.replace(/\s/g, '_'))}" target="_blank">
                            ${weather.currentTime}
                        </a>
                    </div>
                </div>

                <div>
                    <a href="https://www.google.com/maps/@${weather.latitude},${weather.longitude},15z" target="_blank">
                        <img src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${weather.longitude},${weather.latitude},10.25,0,20/350x350?access_token=pk.eyJ1IjoiZGFuaWVsYXJhbmRhIiwiYSI6ImNrcmNncWQzbDFncG0yb25qamJ2bWhtdXcifQ.fy3iFGx-LRS0CSbuSS5Qyg" />
                    </a>
                </div>

            </div>
        `;
    }

    static factory(openWeatherAPI) {
        return new Cities(openWeatherAPI);
    }

    constructor(openWeatherAPI) {
        super();

        this.openWeatherAPI = openWeatherAPI;
        this.cities = [];
        this.currentWeather = {};

        this.currentMetric = 'celsius';
        //this.currentMetric = 'farenheit';

    }

    setProjectId(cityId) {
        this.cityId = cityId;
    }

    getTemplate() {
        return Cities.TEMPLATE();
    }

    setBinds() {

        this.openWeatherAPI.on(`NEW_CITY`, this.newCityHandler.bind(this));

    }

    async newCityHandler(){

        await this.loadCities();

    }

    cityClickHanlder(event) {

        const cityId = event.currentTarget.getAttribute('data-id');

    }

    async loadCities() {

        this.cities = await this.openWeatherAPI.getCities();

        for (let cityIndex in this.cities){

            const cityName = this.cities[cityIndex];
            this.currentWeather[cityName] = await this.openWeatherAPI.getCurrentWeather(cityName);

            const imagesList = await this.openWeatherAPI.getImagesForCity(this.currentWeather[cityName].name);

            const randomImageIndex = Math.round( Math.random() * (imagesList.hits.length - 1) );

            this.currentWeather[cityName].city_image = imagesList.hits[randomImageIndex].webformatURL;

        }

        console.log( JSON.stringify(this.currentWeather) );

        // this.currentWeather = await this.openWeatherAPI.getFecth(`data/test_weather.json`);

        // console.log( this.currentWeather );

        this.render();

    }

    render() {

        let citiesHtml = ``;

        this.cities.forEach((cityName) => {

            const weather = this.mapTemperature( this.currentWeather[cityName] );

            if( weather.cod != '404' ){
                citiesHtml += Cities.CITY_TEMPLATE(cityName, weather);
            }
            
        });

        this.find(`.cities`).innerHTML = citiesHtml;

    }

    mapTemperature(weather){
        
        return Cities.mapTemperature(weather, this.currentMetric);

    }

    static getTemperature(temperature, metric, showMetric){

        if( metric == 'farenheit' ){
            temperature = (temperature * 9) / 5 + 32;
        }

        temperature = Math.floor(temperature) + `°`;

        if( showMetric ){
            temperature += ` c`;
        }

        return  temperature;
    }

    static mapTemperature(weather, metric){

        const weatherCondition = weather.weather[0];
        const weatherType = weatherCondition.main;
        const weatherIcon = Cities.mainToIcon(weatherType);

        const time = new Date();

        time.setSeconds( time.getSeconds() + weather.timezone );

        const newWeather = {
            name: weather.name,
            description: weatherCondition.description,
            city_image: weather.city_image,
            icon: weatherIcon,
            offset: weather.timezone,
            currentTime: Cities.getClockTime(time),
            currentPeriod: Cities.dayPeriod(time),
            temperature: Cities.getTemperature(weather.main.temp, metric, true),
            feels_like: Cities.getTemperature(weather.main.feels_like, metric),
            humidity: weather.main.humidity,
            pressure: new Intl.NumberFormat('en-IN').format(weather.main.pressure),
            temperature_maximum: Cities.getTemperature(weather.main.temp_max, metric),
            temperature_minimum: Cities.getTemperature(weather.main.temp_min, metric),
            country_code: weather.sys.country.toLowerCase(),
            latitude: weather.coord.lat,
            longitude: weather.coord.lon
        };
        
        return newWeather;
    }

    // Check this for reference on main: 
    // https://openweathermap.org/weather-conditions
    static mainToIcon(weatherMain){

        let icon = `clear`;

        switch (weatherMain){
            case `Thunderstorm`:
                icon = `thunderstorm`;
                break;
            case `Drizzle`:
                icon = `few`;
                break;
            case `Rain`:
                icon = `rain`;
                break;
            case `Snow`:
                icon = `snow`;
                break;
            case `Clear`:
                icon = `clear`;
                break;
            case `Clouds`:
                icon = `scattered`;
                break;
            default:
                icon = `mist`;
        }

        return icon;
    }

    static dayPeriod(time){

        let timeString = Cities.getTime(time);

        let hour = timeString.match(/^\d{2}/);

        hour = Math.round(hour);

        if( hour > 7 && hour < 18 ){

            return `day`;

        } else if( [5,6,7,18,19].includes(hour) ){

            return `transition`;

        }else{

            return `night`;

        }
    }

    static getClockTime(time){
        
        let timeString = Cities.getTime(time);
        
        const hour = timeString.match(/^\d{2}/);

        const meridian = hour < 12 ? `am` : `pm`;
        
        let fixHour = hour < 12 ? Math.round(hour) : hour - 12;

        fixHour = fixHour === 0 ? 12 : fixHour;
        
        timeString = timeString.replace(/^\d{2}/, fixHour);

        return timeString + ` ` + meridian;
    }

    static getTime(time){

        let timeString = time.toISOString();

        //`2021-07-18T14:30:26.797Z`.replace(/^([\d\-]{10}T)(\d{2}:\d{2}):[\d\.]{6}Z$/, `$2`)
        timeString = timeString.replace(/^([\d\-]{10}T)(\d{2}:\d{2}):[\d\.]{6}Z$/, `$2`);

        return timeString;
    }

}