import Eventable from './base/Eventable.js';

export default class OpenWeatherAPI extends Eventable {

    static get API_HOST() {
        return `https://api.openweathermap.org/data/2.5/`;
    }

    static factory() {
        return new OpenWeatherAPI(OpenWeatherAPI.API_HOST);
    }

    constructor(host) {

        super();

        this.host = host;

    }

    async getCurrentWeather(cityName) {

        cityName = encodeURIComponent(cityName);

        const weather = await this.getAPIFecth(`weather?q=${cityName}&units=metric&appid={OPEN_WEATHER_KEY}`);

        return weather;

    }

    async getImagesForCity(cityName){

        cityName = encodeURIComponent(cityName);

        return await this.getFecth(`https://pixabay.com/api/?key=22554486-1b088ba979ba92acc371a094f&q=${cityName}&image_type=photo`);
    }

    addCity(cityName) {
        
        const cities = this.getLocalStorage('helloWeather_cities') || [];

        cities.push(cityName);

        this.saveLocalStorage(`helloWeather_cities`, cities);

        this.emit(`NEW_CITY`);

    }

    getCities(){
        const cities = this.getLocalStorage('helloWeather_cities');

        return cities || [];
    }

    saveLocalStorage(key, value){
        const item = JSON.stringify(value);

        return window.localStorage.setItem(key, item);
    }

    getLocalStorage(key){
        const stringItem = window.localStorage.getItem(key);

        if( !stringItem ){
            return null;
        }

        return JSON.parse(stringItem);
    }

    async getAPIFecth(path) {

        path = path.replace(/\{OPEN_WEATHER_KEY\}/g, `155e0f9cdbcc35a26f951a79dd392da0`);

        return await this.getFecth(this.host + path);

    }

    async getFecth(url) {

        const result = await fetch(url);

        return await result.json();

    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}