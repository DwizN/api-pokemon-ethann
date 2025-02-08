import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = "PokemonAttack"`;
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = "Deck"`;
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = "PokemonCard"`;
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = "Type"`;
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = "User"`;

  await prisma.pokemonAttack.deleteMany();
  await prisma.pokemonCard.deleteMany();
  await prisma.type.deleteMany();
  await prisma.deck.deleteMany();
  await prisma.user.deleteMany();
  
  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

    await prisma.pokemonAttack.createMany({
    data: [
      { name: 'Charge', damages: 40, type_idid: 1 },
      { name: 'Flammèche', damages: 30, type_idid: 2 },
      { name: 'Pistolet à O', damages: 30, type_idid: 3 },
    ],
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Bulbizarre',
      pokedexId: 1,
      lifePoints: 45,
      size: 0.7,
      weight: 6.9,
      imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/001.png',
      typeIds: {
        connect: [{ id: 4 }, { id: 8 }],
      },
      weaknessid: 2,
      attack: {
        connect: { id: 1 },
      }
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Salamèche',
      pokedexId: 4,
      lifePoints: 39,
      size: 0.6,
      weight: 8.5,
      imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/004.png',
      typeIds: {
        connect: [{ id: 2 }],
      },
      weaknessid: 3,
      attack: {
        connect: { id: 2 },
      }
    },
  });

  await prisma.pokemonCard.create({
    data: {
      name: 'Carapuce',
      pokedexId: 7,
      lifePoints: 44,
      size: 0.5,
      weight: 9,
      imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/007.png',
      typeIds: {
        connect: [{ id: 3 }],
      },
      weaknessid: 2,
      attack: {
        connect: { id: 3 },
      }
    },
  });

  await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: 'test',
    },
  });

  await prisma.deck.create({
    data: {
      name: 'Deck 1',
      ownerid: 1,
      cards: {
        connect: [{ id: 1 }, { id: 2 }],
      },
    },
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
