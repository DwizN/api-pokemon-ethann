import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = "Pokemon"`;
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = "Type"`;

  await prisma.pokemonCard.deleteMany();
  await prisma.type.deleteMany();
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
