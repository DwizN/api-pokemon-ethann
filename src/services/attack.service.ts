import { NextFunction, Response, Request } from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Vérifie si l'attaque existe par les différents champs pour éviter les doublons
export const verifyPokemonAttackbyId = async (pokemonAttackId: number, res : Response, next: NextFunction) => {
    const pokemonAttack = await prisma.pokemonAttack.findUnique({
        where: {
            id: pokemonAttackId,
        },
    });
    if (!pokemonAttack) {
        return res.status(404).send({ error: 'Erreur 404 : L"attaque n"a pas été trouvée.' });
    } else {
        next();
    }
}

// Vérifie si les dégâts sont positifs

export const verifyDamages = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.damages < 0) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ damages doit être positif.' });
    } else {
        next();
    }
}

// Vérifie si les types existent
// Révéle peut etre un défaut de conception dans sa version dans le fichier pokemon.service.ts

export const verifyTypes_Id = async (req: Request, res: Response, next: NextFunction) => {
    const validType = await prisma.type.findMany({
        where: {
            id: req.body.type_idid,
        },
    });
    if (!validType) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le type n"existe pas.' });
    } else {
        next();
    }

}

// Transforme la requete en objet pour la base de données

export const serializePokemonAttack = async (req: Request, next: NextFunction) => {
    const { name, damages, type_idid } = req.body;
    const pokeattack = {
        name,
        damages,
        type_idid,
    };
    req.body = pokeattack;
    next();
}