import express from 'express';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default prisma;

export const server = app.listen(port);

// Affiche les requetes reçus dans le terminal
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Requête reçue : ${req.method} ${req.url}`);
  next(); // Passe à la prochaine fonction middleware ou route
});

// Renvoie les Pokémons inscrits
app.get('/pokemons-cards', async (_req, res) => {
  const pokecard = await prisma.pokemon.findMany({ include: { typeId: true } }); // Récupère tous les Pokémons et leurs type
  res.status(200).send(pokecard);
});

// Renvoie un pokémon en particulier
app.get('/pokemons-cards/:pokemonCardId', async (req, res) => {
  try {
    const pokecard = await prisma.pokemon.findUnique({
      where: {
        id: parseInt(req.params.pokemonCardId),
      },
    });
    if (pokecard) { // On vérifie si il existe
      res.status(200).send(pokecard);
    } else {
      res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
});

// Permet d'ajouter un pokémon à la liste
app.post('/pokemon-cards', async (req, res) => {

  const { name, pokedexId, type, lifePoints, size, weight, imageUrl } = req.body;

  // Batterie de tests pour voir si les champs sont bien remplis
  if (!name) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ name est requis.' });
  }
  const existingPokemon1 = await prisma.pokemon.findUnique({
    where: {
      name: name,
    },
  });

  if (existingPokemon1) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le nom du Pokémon est déjà pris.' });
  }

  if (!pokedexId) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ pokedexId est requis.' });
  }
  const existingPokemon2 = await prisma.pokemon.findUnique({
    where: {
      pokedexId: pokedexId,
    },
  });

  if (existingPokemon2) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le numéro du Pokédex est déjà pris.' });
  }
  if (!type) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ type est requis.' });
  }

  const validType = await prisma.type.findUnique({
    where: {
      id: type,
    },
  });

  if (!validType) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le numéro du type est invalide.' });
  }
  if (!lifePoints) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ lifePoints est requis.' });
  }
  if (lifePoints < 0) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ lifePoints doit être positif.' });
  }

  const pokecard = {
    name,
    pokedexId,
    type,
    lifePoints,
    size,
    weight,
    imageUrl
  };

  try {
    // Pass 'pokecard' object into query
    const createPokemon = await prisma.pokemon.create({ data: pokecard });
    res.status(201).send(`Ajout de la carte Pokémon ${createPokemon.name}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
  }
);

// Permet de mettre à jour un pokémon
app.patch('/pokemon-cards/:pokemonCardId', async (req, res) => {

  const { name, pokedexId, type, lifePoints, size, weight, imageUrl } = req.body;

  const existingPokemon = await prisma.pokemon.findUnique({
      where: {
        id: parseInt(req.params.pokemonCardId),
      },
    });

  if (!existingPokemon) {
    res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
  }

  if (existingPokemon && existingPokemon.name == name) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le nom du Pokémon est déjà pris.' });
  }

  if (type) {
    const validType = await prisma.type.findUnique({
      where: {
        id: type,
      },
    });
    if (!validType) {
      res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le numéro du type est invalide.' });
      return;
    }
  }

  if (lifePoints < 0) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ lifePoints doit être positif.' });
  }


  const pokecard = {
    name,
    pokedexId,
    type,
    lifePoints,
    size,
    weight,
    imageUrl
  };

  try {
    const updatePokemon = await prisma.pokemon.update({
      where: {
        id: parseInt(req.params.pokemonCardId),
      },
      data: pokecard
    });
    res.status(200).send(`Mise à jour de la carte Pokémon ${updatePokemon.name}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
});

// Permet de supprimer un pokémon
app.delete('/pokemon-cards/:pokemonCardId', async (req, res) => {
  try {
      const existingPokemon = await prisma.pokemon.findUnique({
        where: {
          id: parseInt(req.params.pokemonCardId),
        },
      });

      if (!existingPokemon) {
        res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
      }
   const deletePokémon = await prisma.pokemon.delete({
     where: {
         id: parseInt(req.params.pokemonCardId),
       },
   })

    res.send(`Supression du Pokémon ${req.params.pokemonCardId}`);} 
     
  catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
});


export function stopServer() {
  server.close();
}
