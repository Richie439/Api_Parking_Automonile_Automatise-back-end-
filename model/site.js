
const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    
    nom: {
        required: false,
        type: String
    },
    adresse: {
        required: false,
        type: String
    },
    nombre: {
        required: false,
        type:Number
    },
    occupe: {
        required: false,
        type:Number
    }
   
})

module.exports = mongoose.model('site', dataSchema)