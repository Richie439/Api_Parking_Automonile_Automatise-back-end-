
const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    nom: {
        required: true,
        type: String
    },
    adresse: {
        required: true,
        type: String
    },
    entrer: {
        required: false,
        type:String
    },
    sortie: {
        required: false,
        type:String
    },
    place:{
        required: true,
        type: String
    },
    dateEntrer:{
        required: false,
        type: Date
    },
    dateSortie:{
        required: false,
        type: Date
    }
   
})

module.exports = mongoose.model('parking', dataSchema)