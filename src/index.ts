import express from 'express';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
import { PrismaClient } from '@prisma/client';
import { connect } from 'http2';
import { disconnect } from 'process';
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
  const pokecard = await prisma.pokemonCard.findMany({ include: { typeIds: true } }); // Récupère tous les Pokémons et leurs type
  res.status(200).send(pokecard);
});

// Renvoie un pokémon en particulier
app.get('/pokemons-cards/:pokemonCardId', async (req, res) => {
  try {
    const pokecard = await prisma.pokemonCard.findUnique({
      where: {
        id: parseInt(req.params.pokemonCardId),
      },
      include: { typeIds: true },
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

  const { name, pokedexId, typeIds, lifePoints, size, weight, imageUrl } = req.body;

  // Batterie de tests pour voir si les champs sont bien remplis
  if (!name) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ name est requis.' });
  }
  const existingPokemon1 = await prisma.pokemonCard.findUnique({
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
  const existingPokemon2 = await prisma.pokemonCard.findUnique({
    where: {
      pokedexId: pokedexId,
    },
  });

  if (existingPokemon2) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le numéro du Pokédex est déjà pris.' });
  }
  if (!typeIds) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ type est requis.' });
  }

  const validType = await prisma.type.findMany({
    where: {
      id: {
        in: typeIds,
      },
    },
  });

  if (validType.length !== typeIds.length) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request - Un ou plusieurs types sont invalides.' });
    return;
  }

  if (!validType) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ typeIds est requis.' });
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
    typeIds: { connect: typeIds.map((id: number) => ({ id })) },
    lifePoints,
    size,
    weight,
    imageUrl
  };

  try {
    // Pass 'pokecard' object into query
    const createPokemon = await prisma.pokemonCard.create({ data: pokecard });
    res.status(201).send(`Ajout de la carte Pokémon ${createPokemon.name}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
  }
);

// Permet de mettre à jour un pokémon
app.patch('/pokemon-cards/:pokemonCardId', async (req, res) => {

  const { name, pokedexId, typeIds, lifePoints, size, weight, imageUrl } = req.body;

  const existingPokemon = await prisma.pokemonCard.findUnique({
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

  if (typeIds) {
      const validType = await prisma.type.findMany({
      where: {
        id: {
          in: typeIds,
        },
      },
  });

  if (validType.length !== typeIds.length) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request - Un ou plusieurs types sont invalides.' });
    return;
  }
  }

  if (lifePoints < 0) {
    res.status(400).send({ error: 'Erreur 400 : Bad Request -  Le champ lifePoints doit être positif.' });
  }


  const pokecard = {
    name,
    pokedexId,
    typeIds: {
      set: typeIds.map((id: number) => ({ id })) },
    lifePoints,
    size,
    weight,
    imageUrl
  };

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
    res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
});

// Permet de supprimer un pokémon
app.delete('/pokemon-cards/:pokemonCardId', async (req, res) => {
  try {
      const existingPokemon = await prisma.pokemonCard.findUnique({
        where: {
          id: parseInt(req.params.pokemonCardId),
        },
      });

      if (!existingPokemon) {
        res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
      }
   const deletePokémon = await prisma.pokemonCard.delete({
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

// Permet de créer un utlisateur
app.post('/users', async (req, res) => {

})

// Permet de se connecter à l'application
app.post('/users/login', async (req, res) => {
  
})



export function stopServer() {
  server.close();
}
