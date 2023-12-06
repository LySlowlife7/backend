import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect("mongodb+srv://azul:florymini22@cluster0.dg7nkrg.mongodb.net/login");
        console.log('Base de datos conectada');
    } catch (error) {
        console.log(`ERROR en la conexión a la base de datos ${error.message}`);
    }
}