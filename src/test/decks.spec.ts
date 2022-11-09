import supertest from 'supertest';
import app, { dbSync } from '../app';
import crypto from 'crypto';

jest.mock('sequelize', () => {
    const originalModule = jest.requireActual('sequelize');

    return {
        ...originalModule,
        _esModule: true,
        Sequelize: jest.fn(() => new originalModule.Sequelize('sqlite::memory:'))
    }
})

describe('Deck endpoints', () => {
    let deck: {
        id: string;
        remaining: number;
    };

    beforeAll(async () => {
        await dbSync;
    });

    it('should create a new deck',async () => {
        const type = 'SHORT';
        const shuffled = false;

        const response = await supertest(app.callback())
            .post('/decks')
            .send({
                type,
                shuffled,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            id: expect.any(String),
            type,
            shuffled,
            remaining: 32,
        });

        deck = response.body;
    });

    it('should create a short deck', async () => {
        const type = 'SHORT';
        const remaining = 32;

        const response = await supertest(app.callback())
            .post('/decks')
            .send({
                type,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            id: expect.any(String),
            type,
            shuffled: false,
            remaining,
        });
    });

    it('should create a shuffled deck', async () => {
        const type = 'FULL';
        const shuffled = true;
        const remaining = 52;

        const response = await supertest(app.callback())
            .post('/decks')
            .send({
                type,
                shuffled,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            id: expect.any(String),
            type,
            shuffled,
            remaining,
        });
    });

    it('should fail to get non existing deck', async () => {
        const deckId = crypto.randomUUID();

        const response = await supertest(app.callback())
            .get(`/decks/${deckId}`)
            .send();

        expect(response.statusCode).toEqual(404);
        expect(response.body).toHaveProperty('message', `Deck with id ${deckId} not found`);
    });

    it('should return deck by correct id', async () => {
        const deckId = deck.id;

        const response = await supertest(app.callback())
            .get(`/decks/${deckId}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            ...deck,
            Cards: expect.any(Array),
        });
    });

    it('should correctly draw some number of cards', async () => {
        const count = 5;
        const deckId = deck.id;

        const response = await supertest(app.callback())
            .post(`/decks/${deckId}/draw`)
            .send({
                count,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('cards');
        expect(response.body.cards).toHaveLength(count);
    });

    it('should fail to draw more cards than remaining in deck', async () => {
        const count = deck.remaining + 1;
        const deckId = deck.id;

        const response = await supertest(app.callback())
            .post(`/decks/${deckId}/draw`)
            .send({
                count,
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'There is no enough cards in deck to draw');
    });
});