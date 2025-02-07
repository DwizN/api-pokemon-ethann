import { PrismaClient } from '@prisma/client';
import { verifyDeckById, verifyExistingPokemonCard } from '../services/deck.service';
import { getUserID } from '../services/user.service';

const prisma = new PrismaClient();

export const getAllDecks = async (_req: any, res: any) => {
    const decks = await prisma.deck.findMany({ include: { cards: true, owner: true } });
    res.status(200).send(decks);
}

export const getOneDeck = async (req: any, res: any) => {
    try {
        await verifyDeckById(req.params.deckId, res, () => {});
        if (res.statusCode === 404) {
            return res;
        } else {
            const deck = await prisma.deck.findUnique({
                where: {
                    id: parseInt(req.params.deckId),
                },
            });
            return res.status(200).send(deck);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
    }
}

export const createDeck = async (req: any, res: any) => {
    const { name, cards } = req.body;

    // On récupère l'utilisateur connecté via JWT

    const ownerId = await getUserID(req, res);
    if (typeof ownerId !== 'number') {
        return res;
    }

    if (!name) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ name est requis.' });
    }

    if (!cards) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ cards est requis.' });
    }

    await verifyExistingPokemonCard(req, res, () => {});
    if (res.statusCode === 404) {
        return res;
    }

    const deck = await prisma.deck.create({
        data: {
            name: name,
            ownerid: ownerId,
            cards: {
                connect: cards.map((card: any) => ({ id: card.id })),
            },
        },
    });
}

export const updateDeck = async (req: any, res: any) => {
    const { name, cards } = req.body;

    await verifyDeckById(req.params.deckId, res, () => {});
    if (res.statusCode === 404) {
        return res;
    }

    if (!name) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ name est requis.' });
    }

    if (!cards) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ cards est requis.' });
    }

    await verifyExistingPokemonCard(req, res, () => {});
    if (res.statusCode === 404) {
        return res;
    }

    const deck = await prisma.deck.update({
        where: {
            id: parseInt(req.params.deckId),
        },
        data: {
            name: name,
            cards: {
                connect: cards.map((card: any) => ({ id: card.id })),
            },
        },
    });
    res.status(200).send(deck);
}

export const deleteDeck = async (req: any, res: any) => {
    await verifyDeckById(req.params.deckId, res, () => {});
    if (res.statusCode === 404) {
        return res;
    }

    await prisma.deck.delete({
        where: {
            id: parseInt(req.params.deckId),
        },
    });
    res.status(204).send();
}

export const addCardToDeck = async (req: any, res: any) => {
    const { cardId } = req.body;

    await verifyDeckById(req.params.deckId, res, () => {});
    if (res.statusCode === 404) {
        return res;
    }

    await verifyExistingPokemonCard(req, res, () => {});
    if (res.statusCode === 404) {
        return res;
    }

    const deck = await prisma.deck.update({
        where: {
            id: parseInt(req.params.deckId),
        },
        data: {
            cards: {
                connect: { id: cardId },
            },
        },
    });
    res.status(200).send(deck);
}

export const removeCardFromDeck = async (req: any, res: any) => {
    const { cardId } = req.body;

    await verifyDeckById(req.params.deckId, res, () => {});
    if (res.statusCode === 404) {
        return res;
    }

    await verifyExistingPokemonCard(req, res, () => {});
    if (res.statusCode === 404) {
        return res;
    }

    const deck = await prisma.deck.update({
        where: {
            id: parseInt(req.params.deckId),
        },
        data: {
            cards: {
                disconnect: { id: cardId },
            },
        },
    });
    res.status(200).send(deck);
}
