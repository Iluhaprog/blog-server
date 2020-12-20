function getForeignKeyName(model) {
    return `${model.name.toLowerCase()}Id`;
}

function oneToMany(parent, child, alias = '') {
    const options = {
        foreignKey: {
            name: getForeignKeyName(parent),
            allowNull: false,
        },
        onDelete: 'CASCADE',
    };
    if (alias) {
        options.as = alias;
    }
    parent.hasMany(child, options);
}

function manyToMany(model1, model2, through) {
    model1.belongsToMany(model2, { 
        through: through, 
        foreignKey: getForeignKeyName(model1) 
    });
    model2.belongsToMany(model1, { 
        through: through, 
        foreignKey: getForeignKeyName(model2) 
    });
}

function getModelData(model) {
    return model ? model.get({ plain: true }) : {};
}

function getModelsDataArray(arr) {
    return arr.map(el => getModelData(el)) || arr;
}

module.exports = {
    oneToMany,
    manyToMany,
    getModelData,
    getModelsDataArray,
    getForeignKeyName,
};