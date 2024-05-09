const { Model, DataTypes } = require('sequelize');

class Version extends Model {}

const initializeVersionModel = (seq) => {

    Version.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        document_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        version_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize: seq,
        modelName: 'version',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        freezeTableName: true
    });
}

module.exports = { initializeVersionModel, Version };