const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    nom: {
        required: true,
        type: String
    },
    prenom: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type:String
    },
    telephone: {
        required: true,
        type:String
    },
    numeroCarte: {
        required: false,
        type:String
    },
    typeAbonnement: {
        required: true,
        type:String
    },
    rfid: {
        required: false,
        type:String
    },
    matricule: {
        required: false,
        type:String
    },
    password: {
        required: false,
        type:String
    },
    code: {
        required: false,
        type:String
    },
    dateInscrit:{
        required: false,
        type: Date
    }
})

module.exports = mongoose.model('users', dataSchema)


