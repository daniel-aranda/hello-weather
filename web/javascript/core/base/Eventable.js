export default class Eventable extends EventTarget {

    constructor() {
        super();
    }

    on(type, listener) {
        this.addEventListener(type, listener);
    }

    emit(eventName, detail) {

        detail = detail || {};

        const customEvent = new CustomEvent(eventName, { detail: detail });

        this.dispatchEvent(customEvent);
    }

    hasMethod(methodName) {
        return typeof this[methodName] === 'function';
    }

    checkRequiredMethod(methodName) {

        if (!this.hasMethod(methodName)) {
            throw new Error(`Please create a ${methodName} method on: ${this.constructor.name}`);
        }

    }

}