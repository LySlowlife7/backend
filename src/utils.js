import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { config } from "./config/config.js";
import jwt from "jsonwebtoken"; //Se puede desencriptar, evitar guardar info sensible

//~~~~~~~~~~~~~TOKEN~~~~~~~~~~~~~~~//
export const generateToken = (user) => {
  const token = jwt.sign({username:user.username, email:user.email}, config.token.secretKeyToken, {expiresIn: "1m"});
  return token; //Se crea un Token para cuando el usuario se registre
};

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};
export const invalidPassword = (password, user) =>{
    return bcrypt.compareSync(password, user.password);
};