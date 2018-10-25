import Ajv from 'ajv';
import OptimizationInput from './OptimizationInput';
import OptimizationMethod from "./OptimizationMethod";

class Optimization {
    _input;
    _state = 0;
    _methods = [];

    static fromDefaults() {
        const optimization = new Optimization();
        optimization.input = OptimizationInput.fromDefaults();
        return optimization;
    }

    static fromObject(obj) {
        const optimization = new Optimization();
        optimization.input = OptimizationInput.fromObject(obj.input);
        optimization.state = obj.state;

        obj.methods && obj.methods.forEach((method) => {
            optimization.addMethod(OptimizationMethod.fromObject(method));
        });

        return optimization;
    }

    constructor() {
    }

    get id() {
        return this.input.id;
    }

    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value ? value : {};
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value ? value : 0;
    }

    get methods() {
        return this._methods;
    }

    set methods(value) {
        this._methods = value ? value : [];
    }

    get toObject() {
        return {
            'id': this.id,
            'input': this.input.toObject,
            'state': this.state,
            'methods': this.methods.map(m => m.toObject)
        };
    }

    getMethodByName(name) {
        const method = this.methods.filter(m => m.name === name);
        if (method.length >= 1) {
            return method[0];
        }
        return null;
    }

    addMethod(method) {
        if (!(method instanceof OptimizationMethod)) {
            throw new Error('The method is not of type OptimizationMethod.');
        }
        this._methods.push(method);
    }

    validate() {
        const schema = require("./optimization.schema.json");
        const ajv = new Ajv({schemaId: "id"});
        ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-04.json"));
        const validate = ajv.compile(schema);
        return [validate(this.toObject), validate.errors];
    }
}

export default Optimization;
