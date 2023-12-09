import { Router } from "express";
import passport from "passport";
import { usuariosModel } from "../persistence/mongo/models/usuarios.model.js";
import { createHash, invalidPassword } from "../utils.js";
import { config } from "../config/config.js";

const router = Router();

//~~~~~~~~~~~~~~~~RUTAS DE REGISTRO~~~~~~~~~~~~~~~~~~~//
router.post("/signup", passport.authenticate("signupLocalStrategy", {
    failureRedirect:"/api/sessions/fail-signup"
}), async(req,res) => {
    res.render("login", {message:"USUARIO REGISTRADO EXITOSAMENTE"});
});

router.get("/fail-signup", (req,res) => {
    res.render("signup", {error:"NO SE REGISTRÓ EL USUARIO"});
});


//~~~~~~~~~~~~~~~~RUTA DE REGISTRO CON GITHUB~~~~~~~~~~~~~~~~~~~//
router.get("/signupGithub", passport.authenticate("signupGithubStrategy"));

//~~~~~~~~~~~~~~~~RUTA DEL CALLBACK CON GITHUB~~~~~~~~~~~~~~~~~//
router.get(config.github.callbackGithub, passport.authenticate("signupGithubStrategy",{
    failureRedirect:"/api/sessions/fail-signup"//Si algo falla se redirecciona al usuario a otra ruta
}),(req, res) => { //Si todo funciona bien
    res.redirect("/profile");
});


//~~~~~~~~~~~~~~~~RUTAS DE INICIO DE SESIÓN~~~~~~~~~~~~~~~~~~~//
router.post("/login", passport.authenticate("loginLocalStrategy", {
    failureRedirect:"/api/sessions/fail-login"
}), async(req,res) => {
    res.redirect("/profile");
});

router.get("/fail-login", (req,res) => {
    res.render("login", {error:"NO SE INICIÓ SESIÓN"});
});

//~~~~~~~~~~~~~~~ROLES~~~~~~~~~~~~~~~//
router.get("/admin", (req,res, next) => {
    const{email, password} = req.query;
    if(email !== "adminCoder@coder.com" && password !== "adminCod3r123"){
        return res.status(401).send("No tienes autorización")
    }
    req.session.email = email;
    req.session.password = password;
    req.session.admin = true;
    res.send("Sesión como administrador iniciada")
})

router.post("/login", async(req,res) => {
    try {
       const formdesesion = req.body;
       const usuario = await usuariosModel.findOne({email:formdesesion.email});
       if(!usuario){
        return res.render("login", {error:"No estás registrado"});
       }
       if(!invalidPassword(formdesesion.password, usuario)){
        return res.render("login", {error:"ERROR: Datos invalidos"});
    }

//~~~~~~~~~~CONTRASEÑA INCORRECTA~~~~~~~~~~~//
    if(usuario.password !== formdesesion.password){
        return res.render("login", {error:"Contraseña incorrecta"});
    }
//~~~USUARIO Y CONTRASEÑA VALIDOS, SE CREA LA SESIÓN~~~//
    req.session.email = usuario.email;
    res.redirect("/profile");

    } catch (error) {
        res.render("login", {error:"ERROR: No se pudo iniciar sesión"});
    }
})

//~~~~~~~~~~~~~~CERRAR SESIÓN~~~~~~~~~~~~~//
router.get("/logout", async(req,res) => {
    try {
        req.session.destroy(err => {
            if(err) return res.render("profile", {error:"No se cerró la sesión"});
            res.send("Sesión finalizada");
            res.redirect("/");
        })
    } catch (error) {
        res.render("signup", {error:"No se registró el usuario"});
    }
});

export { router as sessionsRouter };