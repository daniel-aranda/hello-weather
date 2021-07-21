import View from './base/View.js';

export default class TopBar extends View {

    static TEMPLATE() {
        return `
            <div>
                <input class="new-city" type="text" />
                <button class="btn-add-city">
                    add city
                </button>
            </div>
        `;
    }

    static factory(openWeatherAPI) {
        return new TopBar(openWeatherAPI);
    }

    constructor(openWeatherAPI) {
        super();

        this.openWeatherAPI = openWeatherAPI;

    }

    getTemplate() {
        return TopBar.TEMPLATE();
    }

    setBinds() {

        this.find('.btn-add-city').addEventListener('click', this.addCityHanlder.bind(this));

    }

    render(){

    }

    addCityHanlder(){
        
        this.openWeatherAPI.addCity(this.find(`.new-city`).value);

    }

}