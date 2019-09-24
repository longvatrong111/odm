const assert = require('assert');

exports.default = function (schemaType) {
    if (schemaType.default){
        return schemaType.default;
    }
    switch (schemaType.type) {
        case String: return '';
        case Number: return 0;
        case Boolean: return false;
        case Array: return [];
        case Object: return {};
        default: return undefined;
    }
};

exports.castType = function (schemaType,val) {
    if(schemaType.default && !val){
        return  schemaType.default;
    }
    if (schemaType.type === Number) {
        if (typeof val === 'number')
            return val;
        if (val === null)
            return val;
        if (!isNaN(Number(val)))
            return Number(val);
        throw new Error('Cant cast the value to number');
    }
    if (schemaType.type === String) {
        if (typeof val === 'string')
            return val;
        if (val === null)
            return val;
        return String(val);
    }
    if (schemaType.type === Boolean) {
        let convertToTrue = new Set([true, 'true', 1, '1', 'yes']);
        let convertToFalse = new Set([false, 'false', 0, '0', 'no']);
        if (val == null)
            return val;
        if (convertToTrue.has(val))
            return true;
        if (convertToFalse.has(val))
            return false;
        throw new Error('Cant cast the value to boolean');
    }
};
