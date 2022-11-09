import { DataTypes } from 'sequelize';
import sequelize from '../client';

const CardModel = sequelize.define('Cards', {
    order: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    suite: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    code: {
        type: DataTypes.STRING(2),
        allowNull: false,
    }
},{
    timestamps: false,
});

export default CardModel;
