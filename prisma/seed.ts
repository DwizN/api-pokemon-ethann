import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
  await prisma.pokemon.deleteMany();
  await prisma.pokemon.createMany({
    data: [
      {
        name: 'Bulbizarre',
        pokedexId: 1,
        type: 4,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      },
      {
        name: 'Salamèche',
        pokedexId: 4,
        type: 2,
        lifePoints: 39,
        size: 0.6,
        weight: 8.5,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png',
      },
      {
        name: 'Carapuce',
        pokedexId: 7,
        type: 3,
        lifePoints: 44,
        size: 0.5,
        weight: 9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png',
      },
    ],
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
