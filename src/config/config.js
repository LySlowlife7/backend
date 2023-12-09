import dotenv from "dotenv"; //Para poder leer las variables de .env

dotenv.config();

export const config = {
    server:{
        secretSession: process.env.SECRETKEY_SESSION

    },
    mongo:{
        url: process.env.MONGO_URL//Se selecciona la variable de .env - Propiedad:Variable secreta

    },
    github:{
        callbackGithub: process.env.GITHUB_CALLBACK,
        clientIDGithub: process.env.GITHUB_CLIENT_ID,
        clientSecretGithub: process.env.GITHUB_CLIENT_SECRET
    },
    token:{
        secretKeyToken: process.env.TOKEN_SECRETKEY
    }

}