import { NextFunction, Response, Request } from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Vérifie si le Pokémon existe par les différents champs pour éviter les doublons

export const verifyPokemonCardbyId = async (pokemonCardId: number, res : Response, next: NextFunction) => {
    const pokemonCard = await prisma.pokemonCard.findUnique({
        where: {
            id: parseInt(pokemonCardId.toString()),
        },
    });
    if (!pokemonCard) {
        return res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
    } else {
        next();
    }
}

export const verifyPokemonCardbyName = async (req: Request, res: Response, next: NextFunction) => {
    const pokemonCard = await prisma.pokemonCard.findUnique({
        where: {
            name: req.body.name,
        },
    });
    if (pokemonCard) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le nom du Pokémon est déjà pris.' });
    } else {
        next();
    }
}

export const verifyPokemonCardbyPokedex = async (req: Request, res: Response, next: NextFunction) => {
    const pokemonCard = await prisma.pokemonCard.findUnique({
        where: {
            pokedexId: req.body.pokedexId,
        },
    });
    if (pokemonCard) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le numéro du Pokédex est déjà pris.' });
    } else {
        next();
    }
}

// Vérifie si les types existent

export const verifyTypesId = async (req: Request, res: Response, next: NextFunction) => {
    const validType = await prisma.type.findMany({
        where: {
            id: {
                in: req.body.typeIds,
            },
        },
    });

    if (req.body.weaknessid) {
        const validWeakness = await prisma.type.findUnique({
            where: {
                id: req.body.weaknessid,
            },
        });
        if (!validWeakness) {
            return res.status(400).send({ error: 'Erreur 400 Bad Request : Le type de faiblesse est invalide.' });
        }
    }

    if (validType.length !== req.body.typeIds.length) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request : Un ou plusieurs types sont invalides.' });
    } else {
        next();
    }
}

// Vérifie si le nom du Pokémon est déjà pris

export const verifyPokemonName = async (req: Request, res: Response, next: NextFunction) => {
    const pokemonCard = await prisma.pokemonCard.findUnique({
        where: {
            name: req.body.name,
        },
    });
    if (pokemonCard) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le nom du Pokémon est déjà pris.' });
    } else {
        next();
    }
}

// Vérifie si les points de vie sont positifs

export const verifylifePoints = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.lifePoints < 0) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ lifePoints doit être positif.' });
    } else {
        next();
    }
}

// Transforme la requete en objet pour la base de données

export const serializePokemonCard = async (req: Request, res: Response, next: NextFunction) => {
    const { name, pokedexId, typeIds, lifePoints, size, weight, imageUrl, weaknessid, attack } = req.body;
    const pokecard = {
        name,
        pokedexId,
        typeIds: {
            set: typeIds.map((id: number) => ({ id }))
        },
        lifePoints,
        size,
        weight,
        imageUrl,
        weaknessid: req.body.weaknessid ? { id: req.body.weaknessid } : undefined,
        attack,
    };
    req.body = pokecard;
    next();
}