import Eventable from '../base/Eventable.js';

export default class View extends Eventable {

    constructor() {
        super();

        this.checkRequiredMethod(`getTemplate`);
        this.checkRequiredMethod(`render`);

    }

    hook(target) {
        this.container = target;

        this.invalidateDom();

        this.render();
    }

    invalidateDom() {

        this.container.innerHTML = this.getTemplate();

        if (this.hasMethod(`setBinds`)) {
            this.setBinds()
        }

    }

    find(element) {
        return this.container.querySelector(element);
    }

    findAll(element) {
        return this.container.querySelectorAll(element);
    }

}