
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
        // required: true,
        type: String,
        ref: 'site'
    },
    dateEntrer:{
        required: false,
        type: Date
    },
    dateSortie:{
        required: false,
        type: Date
    },
    // site:{
    //     type: Number,
    //     ref: 'site'
    // },
    user:{
        type: String,
        ref: 'users'
    }
   
})

module.exports = mongoose.model('parking', dataSchema)