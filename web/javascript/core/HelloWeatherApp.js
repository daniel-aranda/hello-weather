import Eventable from './base/Eventable.js';
import OpenWeatherAPI from './OpenWeatherAPI.js';

export default class TestingCloudApp extends Eventable {

    static factory() {

        const openWeatherAPI = OpenWeatherAPI.factory();

        return new TestingCloudApp(openWeatherAPI);
    }

    constructor(openWeatherAPI) {

        super();

        this.openWeatherAPI = openWeatherAPI;

        this.validateSession();

    }

    validateSession() {

        // this.openWeatherAPI.on(`MISSING_KEY`, () => {
        //     const key = prompt(`Key?`);
        //     if (key && key.length > 4) {
        //         this.openWeatherAPI.saveKey(key);
        //     }
        // });

        // this.openWeatherAPI.verifyAuth();

    }

}