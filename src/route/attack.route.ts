import { Router } from 'express';
import { createPokemonAttack, getAllPokemonAttacks, getOnePokemonAttack, updatePokemonAttack, deletePokemonAttack } from '../controller/attack.controller';
import { verifyJWT } from '../services/user.service';

const attackRouter = Router();

attackRouter.get('/pokemon-attacks', getAllPokemonAttacks);
attackRouter.get('/pokemon-attacks/:pokemonAttackId', getOnePokemonAttack);
attackRouter.post('/pokemon-attacks', verifyJWT, createPokemonAttack);
attackRouter.patch('/pokemon-attacks/:pokemonAttackId', verifyJWT, updatePokemonAttack);
attackRouter.delete('/pokemon-attacks/:pokemonAttackId', verifyJWT, deletePokemonAttack);

export const attackRoutes = () => {
    return attackRouter;
}