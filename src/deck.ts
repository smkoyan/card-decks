import values from './values.json';
import suites from './suites.json';
import { randomUUID } from 'crypto';

import Shuffler from './contracts/Shuffler';
import SortBasedCardShuffler from './helpers/sortBasedCardShuffler';
import { DECK_TYPE } from './enums';
import Card from './card';

class Deck {
    id: string;
    cards: Card[] = [];
    type: DECK_TYPE;
    shuffled: boolean;
    shuffler: Shuffler<Card>;

    private static readonly INDEX_OF_CARD_7 = 5;

    constructor(
        type: DECK_TYPE = DECK_TYPE.FULL,
        shuffled: boolean = false,
        shuffler?: Shuffler<Card>
    ) {
        this.id = randomUUID();
        this.type = type;
        this.shuffled = shuffled;
        this.setShuffler(shuffler ?? new SortBasedCardShuffler());

        this.generateCards();

        if (shuffled) {
            this.cards = this.shuffler.shuffle(this.cards);
        }
    }

    private generateCards() {
        let _values = values;
        if (this.type === DECK_TYPE.SHORT) {
            _values = values.slice(Deck.INDEX_OF_CARD_7);
        }

        for (const suite of suites) {
            for (const value of _values) {
                this.cards.push(new Card(value, suite));
            }
        }
    }

    setShuffler(shuffler: Shuffler<Card>) {
        this.shuffler = shuffler;
    }

    get remaining(): number {
        return this.cards.length;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            shuffled: this.shuffled,
            remaining: this.remaining,
        };
    }
}

export default Deck;
