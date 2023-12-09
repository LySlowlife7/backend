import { Router } from "express";

const router = Router();

router.get("/", (req,res) => {
    res.render("home");

})

router.get("/videojuegos", (req,res) => {
    if(req.session.email){
        const email = req.session.email;
        res.render("productos", {email});
        } else {
            res.redirect("/iniciarsesion");
        }
})

router.get("/registro", (req,res) => {
    if(req.session.username && req.session.email && req.session.password){
        const username = req.session.username;
        const email = req.session.email;
        const password = req.session.password;
        res.render("signup", {username, email, password});
    } else {
        res.redirect("/productos");
    }
})

router.get("/iniciarsesion", (req,res) => {
    if(req.session.username && req.session.password){
    const datoemail = req.session.email;
    const datopassword = req.session.password;
    res.render("login", {datoemail, datopassword});
    } else {
        res.redirect("/productos");
    }
})

//~~~~~~~~~~~~RUTA PRIVADA~~~~~~~~~~~~~/
router.get("/perfil", (req,res) => {
    if(req.session.email){
    const nombredeusuario = req.session.email;
    res.render("profile", {nombredeusuario});
    } else {
        res.redirect("/iniciarsesion");
    }
})

export { router as viewsRouter };