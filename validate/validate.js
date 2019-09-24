const number = require('./number');
const string = require('./string');
const boolean = require('./boolean');

function validator(schemaType, value) {
    switch (schemaType.type) {
        case Number:
            return number(schemaType, value);
        case String:
            return string(schemaType, value);
        case Boolean:
            return boolean(schemaType, value);
    }
}

module.exports = validator;