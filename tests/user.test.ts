import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createdUser = {email: 'test@test.com', password: 'test1234'};

      const response = await request(app).post('/users').send(createdUser);
      expect(response.status).toBe(201);
    });
  });

  describe('POST /users/login', () => {
    it('should login a user and return a token', async () => {
      const user = {id: 1, email: 'test@test.com', password: 'test1234'};
      const token = 'mockedToken';

      prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app).post('/users/login').send(user);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token,
        message: `Bienvenue ${user.email} !`,
      });
      });
  
      describe('POST /users/login', () => {
        it('should return an error if the user is not found', async () => {
          const user = {id: 2, email: 'marchepas@test.com', password: 'test1234'};
          prismaMock.user.findFirst.mockResolvedValue(null);
  
          const response = await request(app).post('/login').send(user);
          expect(response.status).toBe(401);
          expect(response.body).toEqual({error: 'Erreur 404 : Utilisateur introuvable' });
        });
      });
    });
  });
  