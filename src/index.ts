import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { pokemonRoutes } from './route/pokemon.route';
import { userRoutes } from './route/user.route';
import { swaggerDocument } from './controller/swagger.controller';
import { attackRoutes } from './route/attack.route';
import { deckRoutes } from './route/deck.route';


export const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

export const server = app.listen(port);

// Affiche les requetes reçus dans le terminal
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Requête reçue : ${req.method} ${req.url}`);
  next(); // Passe à la prochaine fonction middleware ou route
});

// Serveur Swagger UI à l'adresse /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route du site
app.use(pokemonRoutes());
app.use(userRoutes());
app.use(attackRoutes());
app.use(deckRoutes());



export function stopServer() {
  server.close();
}
