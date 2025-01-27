import { Router } from 'express';
import { createPokemonCard, getAllPokemonCards, getOnePokemonCard, updatePokemonCard, deletePokemonCard } from '../controller/pokemon.controller';
import { verifyJWT } from '../services/user.service';

const pokemonRouter = Router();

pokemonRouter.get('/pokemons-cards', getAllPokemonCards);
pokemonRouter.get('/pokemons-cards/:pokemonCardId', getOnePokemonCard);
pokemonRouter.post('/pokemon-cards', verifyJWT, createPokemonCard);
pokemonRouter.patch('/pokemon-cards/:pokemonCardId', verifyJWT, updatePokemonCard);
pokemonRouter.delete('/pokemon-cards/:pokemonCardId', verifyJWT, deletePokemonCard);


export const pokemonRoutes = () => {
    return pokemonRouter;
}