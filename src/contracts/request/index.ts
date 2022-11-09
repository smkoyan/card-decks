import {DECK_TYPE} from "../../enums";

export type CreateDeckRequest = {
    type: DECK_TYPE;
    shuffled: boolean;
};
