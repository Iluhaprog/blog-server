const assert = require('assert');
const modelLib = require('../../src/libs/model');
const { sequelize } = require('../../src/config/db');
const { DataTypes } = require('sequelize');

describe('Test for model lib', async function() {
    const makeModel = name => sequelize.define(name, { 
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
            },
        }, {
            timestamps: false,
        });

    const model1 = makeModel('Model1');
    sequelize.sync();

    it('Should get name for foreignKey from model', async function() {
        try {
            const expectedName = 'model1Id';
            const actual = modelLib.getForeignKeyName(model1);
            assert.strictEqual(actual, expectedName);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get object, which has columns from db', async function() {
        try {
            const obj = { name: 'Ilua'};
            const objData = await model1.create(obj);
            const actual = modelLib.getModelData(objData);
            obj.id = actual.id;
            assert.deepStrictEqual(actual, obj);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get array with objects, which has columns from db', async function() {
        try {
            const obj = { name: 'Tom'};
            const objData = await model1.create(obj);
            const actual = modelLib.getModelsDataArray([objData]);
            obj.id = actual[0].id;
            assert.deepStrictEqual(actual, [obj]);
        } catch (error) {
            console.error(error);
        }
    });
});