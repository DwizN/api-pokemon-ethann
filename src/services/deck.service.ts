import { NextFunction, Response, Request } from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Vérifie si le deck existe par l'id
export const verifyDeckById = async (deckId: number, res : Response, next: NextFunction) => {
    const deck = await prisma.deck.findUnique({
        where: {
            id: parseInt(deckId.toString()),
        },
    });
    if (!deck) {
        return res.status(404).send({ error: 'Erreur 404 : Le deck n"a pas été trouvé.' });
    } else {
        next();
    }
}

export const verifyExistingPokemonCard = async (req: Request, res: Response, next: NextFunction) => {
    const cards = req.body.cards;
    for (const card of cards) {
        const pokemonCard = await prisma.pokemonCard.findUnique({
            where: {
                id: card.id,
            },
        });
        if (!pokemonCard) {
            return res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
        }
    }
    next();
}