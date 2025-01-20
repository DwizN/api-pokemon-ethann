import express from 'express';
export const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const bcrypt = require('bcrypt');
const saltRounds = 10;

import jwt from 'jsonwebtoken';

import { verifyJWT } from './auth/verifyJWT';

export default prisma;

export const server = app.listen(port);

// Affiche les requetes reçus dans le terminal
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Requête reçue : ${req.method} ${req.url}`);
  next(); // Passe à la prochaine fonction middleware ou route
});

// Renvoie les Pokémons inscrits
app.get('/pokemons-cards', async (_req: any, res: any) => {
  const pokecard = await prisma.pokemonCard.findMany({ include: { typeIds: true } }); // Récupère tous les Pokémons et leurs type
  res.status(200).send(pokecard);
});

// Renvoie un pokémon en particulier
app.get('/pokemons-cards/:pokemonCardId', async (req: any, res: any) => {
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
      return res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
});

// Permet d'ajouter un pokémon à la liste
app.post('/pokemon-cards', async (req: any, res: any) => {

  const { name, pokedexId, typeIds, lifePoints, size, weight, imageUrl } = req.body;

  // Batterie de tests pour voir si les champs sont bien remplis
  if (!name) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ name est requis.' });
  }
  const existingPokemon1 = await prisma.pokemonCard.findUnique({
    where: {
      name: name,
    },
  });

  if (existingPokemon1) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le nom du Pokémon est déjà pris.' });
  }

  if (!pokedexId) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ pokedexId est requis.' });
  }
  const existingPokemon2 = await prisma.pokemonCard.findUnique({
    where: {
      pokedexId: pokedexId,
    },
  });

  if (existingPokemon2) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le numéro du Pokédex est déjà pris.' });
  }
  if (!typeIds) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ type est requis.' });
  }

  const validType = await prisma.type.findMany({
    where: {
      id: {
        in: typeIds,
      },
    },
  });

  if (validType.length !== typeIds.length) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request : Un ou plusieurs types sont invalides.' });
  }

  if (!validType) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ typeIds est requis.' });
  }
  if (!lifePoints) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ lifePoints est requis.' });
  }
  if (lifePoints < 0) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ lifePoints doit être positif.' });
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
app.patch('/pokemon-cards/:pokemonCardId', async (req: any, res: any) => {

  const { name, pokedexId, typeIds, lifePoints, size, weight, imageUrl } = req.body;

  const existingPokemon = await prisma.pokemonCard.findUnique({
      where: {
        id: parseInt(req.params.pokemonCardId),
      },
    });

  if (!existingPokemon) {
    return res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
  }

  if (existingPokemon && existingPokemon.name == name) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le nom du Pokémon est déjà pris.' });
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
    res.status(400).send({ error: 'Erreur 400 Bad Request : Un ou plusieurs types sont invalides.' });
    return;
  }
  }

  if (lifePoints < 0) {
    res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ lifePoints doit être positif.' });
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
    return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
});

// Permet de supprimer un pokémon
app.delete('/pokemon-cards/:pokemonCardId', async (req: any, res: any) => {
  try {
      const existingPokemon = await prisma.pokemonCard.findUnique({
        where: {
          id: parseInt(req.params.pokemonCardId),
        },
      });

      if (!existingPokemon) {
        return res.status(404).send({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
      }
   const deletePokémon = await prisma.pokemonCard.delete({
     where: {
         id: parseInt(req.params.pokemonCardId),
       },
   })

    res.send(`Supression du Pokémon ${req.params.pokemonCardId}`);} 
     
  catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }
});

// Permet de créer un utlisateur
app.post('/users', async (req: any, res: any) => {
  const {email, password} = req.body;

  if (!email) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ user est requis.' });
  }

  if (!password) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ password est requis.' });
  }

  const existingUser = await prisma.user.findUnique({
    where : {
      email: email,
    },
  });

  if (existingUser) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  L"adresse email est déjà utilisé' });
  }

  // Hashage du mot de passe
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const user = {
    email: email,
    password: hashedPassword,
  };

  try {
    const createUser = await prisma.user.create({ data: user });
    res.status(201).send(`Utilisateur ${createUser.email} créé`);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erreur 500 : Une erreur interne s"est produite.');
  }

})

// Permet de se connecter à l'application
app.post('/users/login', async (req: any, res: any) => {
  const {email, password} = req.body;

  if (!email) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ user est requis.' });
  }

  if (!password) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ password est requis.' });
  }

  const existingUser = await prisma.user.findUnique({
    where : {
      email: email,
    },
  });

  if (!existingUser) {
    return res.status(404).send({ error: 'Erreur 404 : Utilisateur introuvable' });
  }

  const match = await bcrypt.compare(password, existingUser.password);

  if (!match) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request : Le mot de passe est incorrect' });
  }

  // Création d'un jeton d'authentification

  const token = jwt.sign(
      { email: existingUser.email }, // Payload
      process.env.JWT_SECRET as jwt.Secret, // Clé secrète
      { expiresIn: process.env.JWT_EXPIRES_IN } // Durée de validité
  );


  res.status(201).send(`Bienvenue ${email} !`);

});



export function stopServer() {
  server.close();
}
