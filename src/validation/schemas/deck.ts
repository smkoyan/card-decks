import {boolean, number, object, string} from 'yup';
import {DECK_TYPE} from '../../enums';
import {Schema} from '../../contracts/validator';

const schema: Schema = {
    'POST:/decks': {
        body: object({
            type: string().oneOf(Object.values(DECK_TYPE)),
            shuffled: boolean(),
        }),
    },

    'GET:/decks/:id': {
        params: object({
            id: string().uuid().required(),
        }),
    },

    'POST:/decks/:id/draw': {
        params: object({
            id: string().uuid().required(),
        }),

        body: object({
            count: number().positive().required(),
        }),
    },
};

export default schema;
