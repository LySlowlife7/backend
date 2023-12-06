import mongoose from "mongoose";

const usuariosCollection = "usuarios";

const usuariosSchema = new mongoose.Schema({
    username: { type:String, required:true },
    email: { type:String, required:true },
    password: { type:String, required:true },
});

export const usuariosModel = mongoose.model(usuariosCollection, usuariosSchema);