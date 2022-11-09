class Card {
    value: string;
    suite: string;
    code: string;

    constructor(value: string, suite: string) {
        this.value = value;
        this.suite = suite;
        this.code = value.at(0) + suite.at(0);
    }
}

export default Card;
