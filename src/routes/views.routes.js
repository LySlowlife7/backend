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
        res.render('signup');
})

router.get("/iniciarsesion", (req,res) => {
    res.render('login');
})

//~~~~~~~~~~~~RUTA PRIVADA~~~~~~~~~~~~~/
router.get("/perfil", (req,res) => {
    if(req.session.email){
    const emaildeusuario = req.session.email;
    res.render("profile", {emaildeusuario});
    } else {
        res.redirect("/iniciarsesion");
    }
})

export { router as viewsRouter };