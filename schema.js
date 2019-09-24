const lib = require('./lib');
const _ = require('lodash');
const validator = require('./validate/validate');

class Schema {
    constructor(obj, opt) {
        this.path = {};
        this.options = opt || {};

        schemaPath(obj, this.path);
    }
}

// Copy path cua schema object
function schemaPath(obj, path, pre) {
    let prefix = pre || '';
    for (let key of Object.keys(obj)) {
        if (typeof obj[key] === "object") {
            if (!obj[key].type)
                schemaPath(obj[key], path, prefix + key + '.');
            else
                path[prefix + key] = obj[key];
        } else
            path[prefix + key] = {type: obj[key]};
    }
    return path;
}

// Copy path cua object
function objPath(obj, path, pre) {
    let prefix = pre || '';
    for (let key of Object.keys(obj)) {
        if (typeof obj[key] === "object") {
            objPath(obj[key], path, prefix + key + '.');
        } else {
            path[prefix + key] = obj[key];
        }
    }
    return path;
}

Schema.prototype.create = function () {
    let result = {};
    for (let key of Object.keys(this.path)) {
        _.set(result, key, lib.default(this.path[key]));
    }
    return result;
};

Schema.prototype.cast = function (obj) {
    let result = {};
    for (let key of Object.keys(this.path)) {
        if (_.get(obj, key) || this.path[key].default)
            _.set(result, key, lib.castType(this.path[key], _.get(obj, key)));
    }
    for (let key of Object.keys(objPath(obj, {}))) {
        if (!this.path[key.replace(/\d/g, '0')]) {
            if (this.options.strict)
                throw new Error('Cast error: Schema dont have path ' + key);
        } else
            _.set(result, key, lib.castType(this.path[key.replace(/\d/g, '0')], _.get(obj, key)));
    }
    return result;
};

Schema.prototype.validate = function (obj) {
    obj = this.cast(obj);
    for (let key of Object.keys(this.path)) {
        //Xu ly validator chung
        if (this.path[key].require && !_.get(obj, key)) {
            throw new Error('Validate fail');
        }
        //Xu ly validator cua kieu du lieu rieng
        if (!validator(this.path[key], obj[key]) && _.get(obj, key)) {
            throw new Error('Validate fail');
        }
    }
    //return obj;
    return true;
};

module.exports = Schema;


let schemaObj = {
    name: {type: String, enum: ['trong', 'bla']},
    age: {type: Number, min: 18, max: 25, default: 23},
    friend1: {car: {branch: String, price: {euro: Number, dollar: Number}, luxury: Boolean}, rich: Number},
    friends: [{name: {type: String, require: true}, age: Number}]
};

let schema1 = new Schema(schemaObj, {strict: false});

console.log(schema1.path);