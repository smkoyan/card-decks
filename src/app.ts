import Koa from 'koa';
import Router from 'koa-router';
import koaBodyParser from 'koa-bodyparser';
import sequelize from './db/client';

import { createDeck, drawCard, openDeck } from './controllers/deck';
import validator from './validation';

export const dbSync = sequelize.sync().then(() => {
    console.log('database models successfully synced');
}).catch((error: any) => {
    console.log('error happened during database sync', error);
    process.exit(1);
});

const app = new Koa();
const router = new Router();

app.use(koaBodyParser({
    enableTypes: ['json'],
}));

router.post('/decks', validator, createDeck);

router.get('/decks/:id', validator, openDeck);

router.post('/decks/:id/draw', validator, drawCard)

app.use(router.routes()).use(router.allowedMethods());

export default app;
