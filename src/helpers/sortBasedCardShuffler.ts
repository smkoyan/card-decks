import Card from '../card';
import Shuffler from '../contracts/Shuffler';

export default class SortBasedCardShuffler implements Shuffler<Card>{
    shuffle(collection: Card[]): Card[] {
        return collection.sort(() => 0.5 - Math.random());
    }
}
