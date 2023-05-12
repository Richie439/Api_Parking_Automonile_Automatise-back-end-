const express = require('express');

const router = express.Router()
const authorize = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Model = require('../model/parking');

module.exports = router;

//Post Method
router.post('/parking', async (req, res) => {
    const parking = [];
  
    const newParking = new Model({
        nom: req.body.nom,
        adresse:req.body.adresse,
        entrer: req.body.entrer,
        sortie: req.body.sortie,
        place: req.body.place,
       
        dateEntrer: new Date(),
        dateSortie: new Date()
    })
   
    try {
    
      await newParking.save();
        
        
      return res.send(`info_parking ajouté `);
        
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
    
  })

  router.get('/getAll', async  (req, res) => {

 
    const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization;
  
    if(!token) return res.send("Veillez ajouter un token")
   
          try {    
            const data = await Model.find();
            return res.json(data)
        } catch(error) {
          return res.send(error);
        }
  
  
  })