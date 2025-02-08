import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';


afterAll(() => {
  stopServer();
});

// Carte Pokémon pour éviter de tout recopier à chaque fois

const card1 = {
    name: 'Bulbizarre',
    pokedexId: 1,
    lifePoints: 45,
    size: 0.7,
    weight: 6.9,
    imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/001.png',
    typeIds: [{ id: 4 }, { id: 8 }],
    weaknessid: 2,
    attack: { id: 1 },
};

const card2 = {
      name: 'Salamèche',
      pokedexId: 4,
      lifePoints: 39,
      size: 0.6,
      weight: 8.5,
      imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/004.png',
      typeIds: { id : 2 },
      weaknessid: 3,
      attack: { id : 2 }, 
    };

const card3 = {
    name: 'Carapuce',
    pokedexId: 7,
    lifePoints: 44,
    size: 0.5,
    weight: 9,
    imageUrl: 'https://assets.pokemonCard.com/assets/cms2/img/pokedex/full/007.png',
    typeIds: [{ id: 3 }],
    weaknessid: 2,
    attack: { id: 3 },
};

describe('Deck API', () => {
    describe('GET /decks', () => {
        it('should fetch all Decks', async () => {
            const mockDecks = [
                {
                    id: 1,
                    name: 'Deck 1',
                    ownerid: 1,
                    owner: { id: 1, email: 'test@test.com', password: 'test' },
                    cards: [
                        card1,
                        card2,
                    ],
                },
                {
                    id: 2,
                    name: 'Deck 2',
                    ownerid: 1,
                    owner: { id: 1, email: 'test@test.com', password: 'test' },
                    cards: [
                        card1,
                        card2,
                    ],
                },
            ];

            prismaMock.deck.findMany.mockResolvedValue(mockDecks);

            const response = await request(app).get('/decks');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDecks);
            });
        });
    });
    describe('GET /decks/:deckId', () => {
        it('should fetch a Deck by ID', async () => {
            const mockDeck = {
                id: 1,
                name: 'Deck 1',
                ownerid: 1,
                owner: { id: 1, email: 'test@test.com', password: 'test' },
                cards: [
                        card1,
                        card2,
                    ],
            };

            prismaMock.deck.findUnique.mockResolvedValue(mockDeck);

            const response = await request(app).get('/decks/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDeck);

        });
    });
    describe('POST /decks', () => {
        it('should create a new Deck', async () => {
            const createdDeck = {
                id: 1,
                name: 'Deck 1',
                ownerid: 1,
                owner: { id: 1, email: 'test@test.com', password: 'test' },
                cards: [
                        card1,
                        card2,
                    ],
            };

            prismaMock.deck.create.mockResolvedValue(createdDeck);

            const response = await request(app)
                .post('/decks')
                .send(createdDeck);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(`Deck ${createdDeck.name} créé avec succès`);
        });
    });
    describe('PUT /decks/:deckId', () => {
        it('should update a Deck', async () => {
            const updatedDeck = {
                id: 1,
                name: 'Deck 1',
                ownerid: 1,
                owner: { id: 1, email: 'test@test.com', password: 'test' },
                cards: [
                        card1,
                        card2,
                    ],
            };

            prismaMock.deck.update.mockResolvedValue(updatedDeck);

            const response = await request(app)
                .put('/decks/1')
                .send(updatedDeck);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(`Deck ${updatedDeck.name} modifié avec succès`);

        });
    });
    describe('DELETE /decks/:deckId', () => {
        it('should delete a Deck', async () => {
            const mockDeck = {
                id: 1,
                name: 'Deck 1',
                ownerid: 1,
                owner: { id: 1, email: 'test@test.com', password: 'test' },
                cards: [
                        card1,
                        card2,
                    ],
            };

            prismaMock.deck.delete.mockResolvedValue(mockDeck);

            const response = await request(app).delete('/decks/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(`Deck ${mockDeck.name} supprimé avec succès`);
        });
    });
    describe('PATCH /decks/:deckId/add-card', () => {
        it('should add a card to a Deck', async () => {
            const updatedDeck = {
                id: 1,
                name: 'Deck 1',
                ownerid: 1,
                owner: { id: 1, email: 'test@test.com', password: 'test' },
                cards: [
                        card1,
                        card2,
                        card3,
                    ],
            };

            prismaMock.deck.update.mockResolvedValue(updatedDeck);

            const response = await request(app)
                .patch('/decks/1/add-card')
                .send({ cardId: 3 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(`Carte ${3} ajoutée au deck ${updatedDeck.name} avec succès`);
        });
    });
    describe('PATCH /decks/:deckId/remove-card', () => {
        it('should remove a card from a Deck', async () => {
            const updatedDeck = {
                id: 1,
                name: 'Deck 1',
                ownerid: 1,
                owner: { id: 1, email: 'test@test.com', password: 'test' },
                cards: [
                        card1,
                    ],
            };

            prismaMock.deck.update.mockResolvedValue(updatedDeck);

            const response = await request(app)
                .patch('/decks/1/remove-card')
                .send({ cardId: 2 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(`Carte ${2} retirée du deck ${updatedDeck.name} avec succès`);

        });
});
