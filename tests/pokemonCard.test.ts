import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';
import { response } from 'express';



afterAll(() => {
  stopServer();
});

describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        {
          id: 1,
          name: 'Bulbizarre',
          pokedexId: 1,
          lifePoints: 45,
          size: 0.7,
          weight: 6.9,
          imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/001.png',
          typeIds: [{ id: 4, name: "Grass" }, { id: 8, name: "Poison" }],
          weaknessid: 2,
        },
        {
          id: 2,
          name: 'Salamèche',
          pokedexId: 4,
          lifePoints: 39,
          size: 0.6,
          weight: 8.5,
          imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/004.png',
          typeIds: [{ id: 2, name: "Fire" }],
          weaknessid: 3,
        },
        {
          id: 3,
          name: 'Carapuce',
          pokedexId: 7,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/007.png',
          typeIds: [{ id: 3, name: "Water" }],
          weaknessid: 2,
        }
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemons-cards');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });
  });

  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = {
          id: 1,
          name: 'Bulbizarre',
          pokedexId: 1,
          lifePoints: 45,
          size: 0.7,
          weight: 6.9,
          imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/001.png',
          typeIds: [{ id: 4, name: "Grass" }, { id: 8, name: "Poison" }],
          weaknessid: 2,
        }

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);

      const response = await request(app).get('/pokemons-cards/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
    });

    it('should return 404 if PokemonCard is not found', async () => {

      const response = await request(app).get('/pokemons-cards/99');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Erreur 404 : Le Pokémon n"a pas été trouvé.' });
    });
  });

  describe('POST /pokemon-cards', () => {
    it('should create a new PokemonCard', async () => {
      const createdPokemonCard = {
        id: 4,
        name: 'Pikachu',
        pokedexId: 25,
        typeIds: [{ id: 4, name: "Electric" }],
        lifePoints: 60,
        size: null,
        weight: null,
        imageUrl: null,
        weaknessid: 2,
      };

      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app).post('/pokemon-cards').send(createdPokemonCard);
      expect(response.status).toBe(201);
    });
  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
      const updatedPokemonCard = {
        id: 4,
        name: 'Pikachu',
        pokedexId: 25,
        lifePoints: 100,
        size: null,
        weight: null,
        imageUrl: 'https://images.pokemontcg.io/base1/58.png',
        typeIds: [{ id: 4, name: "Electric" }],
        weaknessid: 2,
      };

      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app).patch('/pokemon-cards/1').send(updatedPokemonCard);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(`Mise à jour du Pokémon ${updatedPokemonCard.name} effectuée`);
    });
  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a PokemonCard', async () => {

      const deletedPokemonCard = {
        id: 1,
        name: 'Bulbizarre',
        pokedexId: 1,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/001.png',
        typeIds: [{ id: 4, name: "Grass" }, { id: 8, name: "Poison" }],
        weaknessid: 2,
      };

      prismaMock.pokemonCard.delete.mockResolvedValue(deletedPokemonCard);

      await request(app).delete('/pokemon-cards/1');
  
      expect(response.status).toBe(204);
    });
  });
});
