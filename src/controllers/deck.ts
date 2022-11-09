// @ts-nocheck

import { ParameterizedContext } from 'koa';
import { CreateDeckRequest } from '../contracts/request';

import Deck from '../deck';
import DeckModel from '../db/models/deck';
import CardModel from '../db/models/card';
import sequelize from '../db/client';


export const createDeck = async (ctx: ParameterizedContext) => {
    const { type, shuffled } = ctx.request.body as CreateDeckRequest;

    const deck = new Deck(type, shuffled);

    const deckSerialized = deck.toJSON();
    await DeckModel.create(deckSerialized);

    const deckCards = deck.cards.map(card => ({
        ...card,
        DeckId: deck.id,
    }));
    await CardModel.bulkCreate(deckCards);

    ctx.status = 201;
    ctx.body = deckSerialized;
};

export const openDeck = async (ctx: ParameterizedContext) => {
    const { id } = ctx.params as { id: string };

    const deck = await DeckModel.findByPk(id, {
        include: {
            model: CardModel,
            attributes: ['value', 'suite', 'code'],
        },
    });

    if (deck === null) {
        ctx.status = 404;
        ctx.body = {
            message: `Deck with id ${id} not found`,
        };
        return;
    }

    ctx.body = deck;
};

export const drawCard = async (ctx: ParameterizedContext) => {
    const { id } = ctx.params as {id: string};
    const { count } = ctx.request.body as {count: number};

    const result = await sequelize.transaction(async (transaction) => {
        const deck = await DeckModel.findByPk(id, {
            attributes: ['remaining'],
            raw: true,
            transaction,
        });

        if (deck.remaining < count) {
            ctx.status = 400;
            ctx.body = {
                message: 'There is no enough cards in deck to draw',
            };
            return null;
        }

        const cards = await CardModel.findAll({
            where: {
                DeckId: id,
            },
            order: ['order'],
            limit: count,
            attributes: ['order', 'value', 'suite', 'code'],

            transaction,
        });

        await CardModel.destroy({
            where: {
                order: cards.map(c => c.order),
            },

            transaction,
        });

        await DeckModel.update({
            remaining: deck.remaining - count,
        }, {
            where: {
                id,
            },

            transaction,
        });

        return cards.map(card => ({
            value: card.value,
            suite: card.suite,
            order: card.order,
        }));
    });

    if (result === null) {
        return;
    }

    ctx.body = {
        cards: result,
    };
};
