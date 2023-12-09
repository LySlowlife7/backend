import passport from "passport";
import localStrategy from "passport-local";
import { createHash, invalidPassword } from "../utils.js";
import { usuariosModel } from "../persistence/mongo/models/usuarios.model.js";

import { config } from "./config.js";
import GithubStrategy from "passport-github2"; //Estrategia de registro con Github


//Estrategia para registar usuarios: con username y password
export const initPassport = () => {
    passport.use("signupLocalStrategy", new localStrategy(
    {
        passReqToCallback: true,
        usernameField: username, //Cuando no hay username se pone "email"
    },
    async(req, username, email, password, done) => {
        const { user } = req.body;
        try{
            const usuario = await usuariosModel.findOne({username})
            if(usuario){
               return done(null, false); //Usuario registrado
            }
            const newUsuario = { //Usuario No registrado
               username,
               email,
               password:createHash(password)
            };
        console.log(newUsuario);
        const usuarioCreado = await usuariosModel.create(newUsuario);
        return done(null, usuarioCreado);    
    } catch (error) {
         return done(error);
    }
}
    ));
};

//Estrategia para Iniciar Sesión de los usuarios
//Instalar npm i passport-github2
passport.use("loginLocalStrategy", new localStrategy(
{
        usernameField: "username",
},
async(username, password, done) => {
    try {
        const usuario = await usuariosModel.findOne({user:username});
        if(!usuario){
            return done(null, false); //Usuario No registrado
        }
    } catch (error) {
        return done(error);
    }
}
));

//Estrategia para registro con GitHub de sessions.routes
passport.use("signupGithubStrategy", new GithubStrategy(//Logica para registrar usuarios con Github
      {//Objeto donde estarán todos los datos de la API de Github
       clientID: " Iv1.99ec57f5e405cf6d",
       clientSecret:"7f18ea47275c7f13e7c2b16e22577a20edbeefdc",
       callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
    async(accesToken, refreshToken, profile, done) => { //Esos Tokens son generados por la aplicación/red social
     try { //Verificar si el usuario esta registrado
        //console.log("profile", profile); //Se mostrarán todos los datos (obtenidos de la cuenta de Github) del usuario registrado
        const usuario = await usuariosModel.findOne({username:profile.username});
        if(usuario){
           return done(null, usuario); //Usuario ya está registrado y se inicia la sesión
        }
        const newUsuario = {
           username:profile.username,
           email:profile._json.name,
           password:createHash(profile.id)
        }; //Usuario No está registrado
    console.log(newUsuario);
    const usuarioCreado = await usuariosModel.create(newUsuario); //Se crea el usuario en la Base de Datos
    return done(null, usuarioCreado); //Se crea a Sesión
} catch (error) {
     return done(error);
}
}
));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async(id, done) => {
    const usuario = await usuariosModel.findById(id);
    done(null.usuario);
})