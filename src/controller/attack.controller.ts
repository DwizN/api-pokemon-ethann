import { PrismaClient } from '@prisma/client';
import { verifyPokemonAttackbyId, serializePokemonAttack, verifyTypes_Id } from '../services/attack.service';

const prisma = new PrismaClient()


// Renvoie tous les attaques des Pokémons
export const getAllPokemonAttacks = async (_req: any, res: any) => {
    const pokeattacks = await prisma.pokemonAttack.findMany();
    res.status(200).send(pokeattacks);
}

// Renvoie une attaque de Pokémon
export const getOnePokemonAttack = async (req: any, res: any) => {
    try {
        const attackId = parseInt(req.params.pokemonAttackId);
        await verifyPokemonAttackbyId(attackId, res, () => {}); // On vérifie si l'attaque existe
        if (res.statusCode === 404) {
          return res;
        } else {
            const pokeattack = await prisma.pokemonAttack.findUnique({
                where: {
                id: parseInt(req.params.pokemonAttackId),
                },
            });
            return res.status(200).send(pokeattack);
            }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
    }
}

// Crée une attaque de Pokémon
export const createPokemonAttack = async (req: any, res: any) => {
    const { name, damages, type_idid } = req.body;

    if (!name) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ name est requis.' });
    }

    if (!damages) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ damages est requis.' });
    }

    if (damages < 0) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ damages doit être positif.' });
    }

    if (!type_idid) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ type_idid est requis.' });
    }

    await verifyTypes_Id(req, res, () => {}); // On vérifie si le type existe
    if (res.statusCode === 400) {
        return res;
    }

    const pokeattack = await serializePokemonAttack(req, () => {})
    if (typeof pokeattack !== 'object') {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Les données sont invalides.' });
    }

    try {
        const newPokemonAttack = await prisma.pokemonAttack.create({
            data: pokeattack,
        });
        return res.status(200).send(`L"attaque ${newPokemonAttack.name} a bien été créée.`);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
    }

}

export const updatePokemonAttack = async (req: any, res: any) => {

    await verifyPokemonAttackbyId(req.params.pokemonAttackId, res, () => {}); // On vérifie si l'attaque existe
    if (res.statusCode === 404) {
        return res;
    }

    await verifyTypes_Id(req, res, () => {}); // On vérifie si le type existe
    if (res.statusCode === 400) {
        return res;
    }

    const pokeattack = await serializePokemonAttack(req, () => {})
    if (typeof pokeattack !== 'object') {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Les données sont invalides.' });
    }

    try {
        const updatedPokemonAttack = await prisma.pokemonAttack.update({
            where: {
                id: parseInt(req.params.pokemonAttackId),
            },
            data: pokeattack,
        });
        return res.status(200).send(`L"attaque ${updatedPokemonAttack.name} a bien été modifiée.`);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
    }
}

export const deletePokemonAttack = async (req: any, res: any) => {
    await verifyPokemonAttackbyId(req.params.pokemonAttackId, res, () => {}); // On vérifie si l'attaque existe
    if (res.statusCode === 404) {
        return res;
    }

    try {
        await prisma.pokemonAttack.delete({
            where: {
                id: parseInt(req.params.pokemonAttackId),
            },
        });
        return res.status(200).send(`L"attaque a bien été supprimée.`);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
    }
}