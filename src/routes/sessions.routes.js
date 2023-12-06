import { Router } from "express";
import { usuariosModel } from "../persistence/mongo/models/usuarios.model.js";


const router = Router();

router.post("/signup", async(req,res) => {
    try {
        const formderegistro = req.body;
        const result = await usuariosModel.create(formderegistro);
        res.render("login", {message:"Usuario registrado exitosamente"});
    } catch (error) {
        res.render("signup", {error:"ERROR: No se pudo registrar su usuario"});
    }
})

//~~~~~~~~~~~~~~~ROLES~~~~~~~~~~~~~~~//
router.get("/admin", (req,res,next) => {
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
//~~~~~~~~~~CONTRASEÑA INCORRECTA~~~~~~~~~~~//
    if(usuario.password !== formdesesion.password){
        return res.render("login", {error:"Contraseña incorrecta"});
    }
//~~~USUARIO Y CONTRASEÑA VALIDOS, SE CREA LA SESIÓN~~~//
    req.session.email = usuario.email;
    res.render('profile');

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