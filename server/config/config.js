// ============================
// Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
// Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
// vENCIMIENTO DEL TOKEN
// ============================
// 60 segundos
// 60 minutos
// 24 horas 
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ============================
// SEED de autenticacion
// ============================
process.env.SEED = process.env.SEED || 'este_es_el_seed_sesarrollo';

// ============================
// Base de datos
// ============================

let urlDB;
if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // mongodb+srv://marsupion:<password>@cluster0-9xz8q.mongodb.net mongodb+srv://Mars
    urlDB = 'mongodb+srv://Marsupion:3noqHdazT3Qk94T9@cluster0-9xz8q.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

// ============================
// Google CLIENT_ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '708208988845-s84erlbeskq50rr76ir7c6skvfboc1ik.apps.googleusercontent.com';