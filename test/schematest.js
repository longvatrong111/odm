const assert = require('assert');
const Schema = require('../schema');

describe('List of testcase', function () {

    describe('Create object', function () {

        let schema1 = new Schema({
            name: String,
            age: Number,
            friend1: {name: String, age: Number, friend: {name: String, age: Number}},
            friends: [{name: String, age: Number}]
        });

        let schema2 = new Schema({
            name: String,
            age: {type: Number},
            friend1: {name: String, age: Number, friend: {name: String, age: Number}},
            friends: [{type: {name: String, age: Number}}]
        });

        let cloneObject = {
            name: '',
            age: 0,
            friend1: {name: '', age: 0, friend: {name: '', age: 0}},
            friends: [{name: '', age: 0}]
        };

        it('Two schema with different declaration create same object', function () {
            assert.strictEqual(JSON.toString(schema1.create()), JSON.toString(schema2.create()));
        });
        it('Expected clone object', function () {
            assert.strictEqual(JSON.toString(schema1.create()), JSON.toString(cloneObject));
        });
    });

    describe('Cast', function () {

        let schema1 = new Schema({
            name: String,
            age: {type: Number},
            friend1: {name: String, age: Number, friend: {name: String, age: Number}},
            friends: [{type: {name: String, age: Number}}]
        });

        let beforeCast = {
            name: true,
            age: '20',
            friend1: {name: true, age: '15', friend: {name: 'trong', age: 15}},
            friends: [{name: 'trong', age: 20}, {name: 'trong', age: '20'}]
        };

        let afterCast = {
            name: 'true',
            age: 20,
            friend1: {name: 'true', age: 15, friend: {name: 'trong', age: 15}},
            friends: [{name: 'trong', age: 20}, {name: 'trong', age: 20}]
        };

        it('Cast', function () {
            assert.strictEqual(JSON.toString(schema1.cast(beforeCast)), JSON.toString(afterCast));
        });

        let schemaObject = {
            name: {type: String, default: 'trong'},
            age: {type: Number, min: 18, max: 25, default: 23},
            friend1: {car: {branch: String, price: {euro: Number, dollar: Number}, luxury: Boolean}, rich: Number},
            friend2: {car: {branch: String, price: {euro: Number, dollar: Number}, luxury: Boolean}, rich: Number},
            friends: [{name: {type: String, require: true}, age: Number}]
        };

        let schema2 = new Schema(schemaObject);
        let schema3 = new Schema(schemaObject, {strict: true});

        let beforeCast2 = {
            name: 'notTrong',
            car: {type: 'bmw'},
            friends: [{name: true, age: 23}, {name: 'name', age: '23'}]
        };

        let afterCast2 = {
            name: 'notTrong',
            age: 23,
            friends: [{name: true, age: 23}, {name: 'name', age: 23}]
        };

        it('No strict cast', function () {
            assert.strictEqual(JSON.toString(schema2.cast(beforeCast2)), JSON.toString(afterCast2));
        });
        it('Strict cast', function () {
            assert.throws(() => schema3.cast(beforeCast2), Error);
        });

        let schema4 = new Schema({
            people: [{age: Number, friends: [{name: String}]}]
        });

        let beforeCast4 = {
            people: [{age: 100},
                {age: 100, friends: [{name: 'trong'}, {name: 'tuan'}]}]
        };

        let aftercast4 = {
            people: [{age: 100},
                {age: 100, friends: [{name: 'trong'}, {name: 'tuan'}]}]
        };

        it('Multilevel array cast', function () {
            assert.strictEqual(JSON.toString(schema4.cast(beforeCast4)), JSON.toString(aftercast4))
        });
    });

    describe('Validate', function () {

        let schema1 = new Schema({
            name: String,
            age: {type: Number, min: 10, max: 20},
            friends: [{name: String, age: Number}]
        });

        let obj1 = {
            name: 'trong',
            age: 15,
            friends: [{name: '', age: 0}]
        };

        it('Two schema with different declaration create same object', function () {
            assert.strictEqual(schema1.validate(obj1), true);
        });
    });
});