import { DataTypes } from 'sequelize';
import sequelize from '../client';

import CardModel from './card';

const DeckModel = sequelize.define('Decks', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    shuffled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    remaining: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    timestamps: false,
});

DeckModel.hasMany(CardModel, {
    onDelete: 'cascade',
});

CardModel.belongsTo(DeckModel, {
    foreignKey: {
        // @ts-ignore
        type: DataTypes.UUID,
    }
})

export default DeckModel;
