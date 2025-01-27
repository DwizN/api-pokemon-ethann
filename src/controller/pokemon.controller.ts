import { PrismaClient } from '@prisma/client';
import { serializePokemonCard, verifylifePoints, verifyPokemonCardbyId, verifyPokemonCardbyName, verifyPokemonCardbyPokedex, verifyTypesId } from '../services/pokemon.service';
const prisma = new PrismaClient();

export const getAllPokemonCards = async (_req: any, res: any) => {
    const pokecard = await prisma.pokemonCard.findMany({ include: { typeIds: true } }); // Récupère tous les Pokémons et leurs type
    res.status(200).send(pokecard);
}

export const getOnePokemonCard = async (req: any, res: any) => {
    try {
        await verifyPokemonCardbyId(req.params.pokemonCardId, res, () => {}); // On vérifie si le Pokémon existe
        if (res.statusCode === 404) {
          return res;
        } else {
          const pokemoncard = await prisma.pokemonCard.findUnique({
            where: {
              id: parseInt(req.params.pokemonCardId),
            },
          });
          return res.status(200).send(pokemoncard);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
      }
}


export const createPokemonCard = async (req: any, res: any) => {
     const { name, pokedexId, typeIds, lifePoints, size, weight, imageUrl } = req.body;
    
      // Batterie de tests pour voir si les champs sont bien remplis et si les données sont valides
      if (!name) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ name est requis.' });
      }
      await verifyPokemonCardbyName(req, res, () => {}); // On vérifie si le Pokémon existe
      if (res.statusCode === 400) {
        return res;
      } else {
        res.status(200).send(req.pokemonCard);
      }

      if (!pokedexId) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ pokedexId est requis.' });
      }
      
      await verifyPokemonCardbyPokedex(req, res, () => {}); // On vérifie si le Pokémon existe 
      if (res.statusCode === 400) {
        return res;
      } else {
        res.status(200).send(req.pokemonCard);
      }

      if (!typeIds) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ type est requis.' });
      }
    
      await verifyTypesId(req, res, () => {}); // On vérifie si le type existe
      if (res.statusCode === 400) {
        return res;
      } else {
        res.status(200).send(req.pokemonCard);
      }

      if (!lifePoints) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ lifePoints est requis.' });
      }
      
      await verifylifePoints(req, res, () => {}); // On vérifie si le Pokémon existe
      if (res.statusCode === 400) {
        return res;
      } else {
        res.status(200).send(req.pokemonCard);
      }
    
      const pokecard = await serializePokemonCard(req, res, () => {});
      if (typeof pokecard !== 'object') { // On vérifie si l'objet est bien un objet (c'est bête mais sinon VS Code se plaint)
        return res.status(500).send({ error: 'Erreur 500 : Le serveur n"a pas pu traiter la requête.' });
      }
    
      try {
        // Pass 'pokecard' object into query
        const createPokemon = await prisma.pokemonCard.create({ data: pokecard });
        res.status(201).send(`Ajout de la carte Pokémon ${createPokemon.name}`);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
      }
}

export const updatePokemonCard = async (req: any, res: any) => {
    
    await verifyPokemonCardbyId(parseInt(req.params.pokemonCardId), res, () => {}); // On vérifie si le Pokémon existe
    if (res.statusCode === 404) {
      return res;
    }
    
    await verifyPokemonCardbyName(req, res, () => {}); // On vérifie si le nom du Pokémon est déjà pris
    if (res.statusCode === 400) {
      return res;
    }

    await verifyTypesId(req, res, () => {}); // On vérifie si les types existent
    if (res.statusCode === 400) {
      return res;
    }

    await verifylifePoints(req, res, () => {}); // On vérifie si les points de vie sont positifs
    if (res.statusCode === 400) {
      return res;
    }
    
      const pokecard = await serializePokemonCard(req, res, () => {});
      if (typeof pokecard !== 'object') {
        return res.status(500).send({ error: 'Erreur 500 : Le serveur n"a pas pu traiter la requête.' });
      }
    
      try {
        const updatePokemon = await prisma.pokemonCard.update({
          where: {
            id: parseInt(req.params.pokemonCardId),
          },
          data: pokecard
        });
        res.status(200).send(`Mise à jour de la carte Pokémon ${updatePokemon.name}`);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
      }
}

export const deletePokemonCard = async (req: any, res: any) => {
    try {
        await verifyPokemonCardbyId(parseInt(req.params.pokemonCardId), res, () => {}); // On vérifie si le Pokémon existe
        if (res.statusCode === 404) {
          return res;
        }

        const deletePokémon = await prisma.pokemonCard.delete({
          where: {
            id: parseInt(req.params.pokemonCardId),
          },
        });
    
        res.send(`Supression du Pokémon ${req.params.pokemonCardId}`);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
      }
}