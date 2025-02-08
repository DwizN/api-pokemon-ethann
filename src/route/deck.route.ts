import { Router } from 'express';
import { createDeck, getAllDecks, getOneDeck, updateDeck, deleteDeck, addCardToDeck, removeCardFromDeck } from '../controller/deck.controller';
import { verifyJWT } from '../services/user.service';

const deckRouter = Router();

deckRouter.get('/decks', getAllDecks);
deckRouter.get('/decks/:deckId', getOneDeck);
deckRouter.post('/decks', verifyJWT, createDeck);
deckRouter.patch('/decks/:deckId', verifyJWT, updateDeck);
deckRouter.delete('/decks/:deckId', verifyJWT, deleteDeck);
deckRouter.patch('/decks/:deckId/add-card', verifyJWT, addCardToDeck);
deckRouter.patch('/decks/:deckId/remove-card', verifyJWT, removeCardFromDeck);

export const deckRoutes = () => {
    return deckRouter;
}