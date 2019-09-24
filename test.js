class Schema {
    constructor(obj, opt) {
        this.options = opt || {};
        this.path = {};
        schemaPath(obj, this.path);
    }
}

function schemaPath(obj, path, pre) {
    let prefix = pre || '';
    for (let key of Object.keys(obj)) {
        if (typeof obj[key] === "object") {
            if (!obj[key].type)
                schemaPath(obj[key], path, (prefix + key + '.').replace('.type', ''));
            else
                path[(prefix + key).replace('.type', '')] = obj[key];
        } else
            path[(prefix + key).replace('.type', '')] = {type: obj[key]};
    }
    return path;
}

// function schemaPath(obj, path, pre) {
//     let prefix = pre || '';
//     for (let key of Object.keys(obj)) {
//         if (typeof obj[key] === "object") {
//             schemaPath(obj[key], path, (prefix + key + '.').replace('.type', ''));
//         } else if (typeof obj[key] === "function") {
//             path[(prefix + key).replace('.type', '')] = {type: obj[key]};
//         } else {
//             path[prefix.slice(0, prefix.length - 1)][key] = obj[key];
//         }
//     }
//     return path;
// }

let schemaObj = {
    name: {type: String, default: ['trong', 'bla']},
    age: {type: Number, min: 18, max: 25, default: 23},
    friend1: {car: {branch: String, price: {euro: Number, dollar: Number}, luxury: Boolean}, rich: Number},
    friends: [{name: {type: String, require: true}, age: Number}]
};

let schema1 = new Schema(schemaObj, {strict: false});

console.log(schema1.path);
//var input = {friends: [{name: 'trong', age: 23}]}

//console.log(schema1.path);
//console.log('\n');
//console.log(schema1.create());
// console.log('\n');
