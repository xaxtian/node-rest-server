///////////////////
//Puerto
///////////////////
process.env.PORT = process.env.PORT || 3000;

///////////////////
//Expiracion token
///////////////////
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

///////////////////
//Seed token
///////////////////
process.env.SEED = process.env.SEED || 'secret';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://xaxtian:12345o!@cluster0-i9ebf.mongodb.net/cafe';
}

// urlDB = 'mongodb+srv://xaxtian:12345o!@cluster0-i9ebf.mongodb.net/cafe';

process.env.URLDB = urlDB;

///////////////////
//Google client id
///////////////////

process.env.CLIENT_ID = process.env.CLIENT_ID || '786414672554-8oi4vlcujeem1dqgltud2106l6rt55ph.apps.googleusercontent.com';