import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import { hashPassword, transformUserData, verifyexistingUser, verifyexistingUserReturn } from '../services/user.service';


export const createUser = async (req: any, res: any) => {
    const { email, password } = req.body;
    
    if (!email) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ user est requis.' });
    }
    
    if (!password) {
        return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ password est requis.' });
    }
    
    await verifyexistingUser(req, res, () => {}); // On vérifie si l'utilisateur existe
    if (res.statusCode === 400) {
        return res;
    } else {
        res.status(200).send(req.user);
    }
    
    // Hashage du mot de passe
    const hashedPassword = hashPassword(password);
    
    const user = transformUserData(req, hashedPassword);
    if (typeof user === 'object') {
        return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
    }
    
    try {
        const createUser = await prisma.user.create({ data: user });
        res.status(201).send(`Utilisateur ${createUser.email} créé`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erreur 500 : Une erreur interne s"est produite.');
    }
    
    }

export const loginUser = async (req: any, res: any) => {
    const {email, password} = req.body;

  if (!email) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ user est requis.' });
  }

  if (!password) {
    return res.status(400).send({ error: 'Erreur 400 Bad Request :  Le champ password est requis.' });
  }

  const existingUser = await verifyexistingUserReturn(req, res, () => {}); // On vérifie si l'utilisateur existe
  if (res.statusCode === 400) {
    return res;
  }

  // Vérification du mot de passe
  if ('password' in existingUser) {
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(400).send({ error: 'Erreur 400 Bad Request : Le mot de passe est incorrect' });
    }
  } else {
    return res.status(500).send({ error: 'Erreur 500 : Une erreur interne s"est produite.' });
  }


  // Création d'un jeton d'authentification

  const token = jwt.sign(
      { email: existingUser.email }, // Payload
      process.env.JWT_SECRET as jwt.Secret, // Clé secrète
      { expiresIn: process.env.JWT_EXPIRES_IN } // Durée de validité
  );


  res.status(201).json({ message: `Bienvenue ${email} !`, token });

};