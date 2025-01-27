import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // On récupère le token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret
    ) as {
      email: string;
    };
    const email = decodedToken.email;
    req.query = {
      email: email,
    };
    next();
  } else {
    res.sendStatus(401); // Pas de token fourni
  }
};

// Vérifie si l'utilisateur existe par l'email pour éviter les doublons
export const verifyexistingUser = async(req: Request, res: Response, next: NextFunction) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  L"adresse email est déjà utilisé' });
  } else { 
    next();
  }
}

// Littéralement la même chose mais renvoie l'utilisateur avec le mot de passe
export const verifyexistingUserReturn = async(req: Request, res: Response, next: NextFunction) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
    select: {
      email: true,
      password: true,
    },
  });
  if (existingUser) {
    return existingUser;
  } else { 
    return res.status(400).send({ error: 'Erreur 404 : Utilisateur introuvable' });
  }
}

// Hashage du mot de passe
export const hashPassword = async(password: string) => {
  const bcrypt = require('bcrypt');

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}



// Transforme les données de l'utilisateur pour renvoyer un objet
// Oui mettre "any" c'est pas bien mais son type c'est littéralement Promise<any>
export const transformUserData = async(req : Request, hashedPassword: any) => {
  const { email, password } = req.body;
  
  const user = {
    email: email,
    password: hashedPassword,
  };
  return user;
}