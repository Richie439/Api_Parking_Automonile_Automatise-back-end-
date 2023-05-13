
const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    
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
    },
    user:{
        type: String,
        ref: 'users'
    }
   
})

module.exports = mongoose.model('parking', dataSchema)