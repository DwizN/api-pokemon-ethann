import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';


afterAll(() => {
  stopServer();
});

describe('PokemonAttack API', () => {
    describe('GET /pokemon-attacks', () => {
        it('should fetch all PokemonAttacks', async () => {
            const mockPokemonAttacks = [
                {
                    id: 1,
                    name: 'Charge',
                    damages: 40,
                    type_id: { id: 1, name: 'Normal' }, // A vérifier
                    type_idid: 1,
                },
                {
                    id: 2,
                    name: 'Flammèche',
                    damages: 30,
                    type_id: { id: 2, name: 'Fire' }, // A vérifier
                    type_idid: 2,
                },
                {
                    id: 3,
                    name: 'Pistolet à O',
                    damages: 30,
                    type_id : { id: 3, name: 'Water' }, // A vérifier
                    type_idid: 3,
                }
            ];

            prismaMock.pokemonAttack.findMany.mockResolvedValue(mockPokemonAttacks);

            const response = await request(app).get('/pokemon-attacks');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPokemonAttacks);
        });
    });
    describe('GET /pokemon-attacks/:pokemonAttackId', () => {
        it('should fetch a PokemonAttack by ID', async () => {
            const mockPokemonAttack = {
                id: 1,
                name: 'Charge',
                damages: 40,
                type_id: { id: 1, name: 'Normal' }, // A vérifier
                type_idid: 1,
            };

            prismaMock.pokemonAttack.findUnique.mockResolvedValue(mockPokemonAttack);

            const response = await request(app).get('/pokemon-attacks/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPokemonAttack);
        });
    });
    describe('POST /pokemon-attacks', () => {
        it('should create a new PokemonAttack', async () => {
            const createdPokemonAttack = { name: 'Charge', damages: 40, type_id: { id: 1, name: 'Normal' }, type_idid: 1 };
            const mockPokemonAttack = { id: 1, name: createdPokemonAttack.name, damages: createdPokemonAttack.damages, type_id: createdPokemonAttack.type_id, type_idid: createdPokemonAttack.type_idid };

            prismaMock.pokemonAttack.create.mockResolvedValue(mockPokemonAttack);

            const response = await request(app).post('/pokemon-attacks').send(createdPokemonAttack);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(`Attaque ${createdPokemonAttack.name} créée`);
        });
    });
    describe('PUT /pokemon-attacks/:pokemonAttackId', () => {
        it('should update a PokemonAttack', async () => {
            const updatedPokemonAttack = { name: 'Charge', damages: 40, type_id: { id: 1, name: 'Normal' }, type_idid: 1 };
            const mockPokemonAttack = { id: 1, name: updatedPokemonAttack.name, damages: updatedPokemonAttack.damages, type_id: updatedPokemonAttack.type_id, type_idid: updatedPokemonAttack.type_idid };

            prismaMock.pokemonAttack.update.mockResolvedValue(mockPokemonAttack);

            const response = await request(app).put('/pokemon-attacks/1').send(updatedPokemonAttack);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(`Attaque ${updatedPokemonAttack.name} mise à jour`);
        });
    });
    describe('DELETE /pokemon-attacks/:pokemonAttackId', () => {
        it('should delete a PokemonAttack', async () => {
            const mockPokemonAttack = { id: 1, name: 'Charge', damages: 40, type_id: { id: 1, name: 'Normal' }, type_idid: 1 };

            prismaMock.pokemonAttack.delete.mockResolvedValue(mockPokemonAttack);

            const response = await request(app).delete('/pokemon-attacks/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(`Attaque ${mockPokemonAttack.name} supprimée`);
        });
    });
});