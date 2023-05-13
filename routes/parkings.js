const express = require('express');

const router = express.Router()
const authorize = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Model = require('../model/parking');
const User = require('../model/model');


module.exports = router;

//Post Method
router.post('/parking', async (req, res) => {
    const parking = [];

    existingUser = await User.findOne({ _id: req.body.user });
    if (!existingUser) {
      return res.status(400).send("Cette utilisateur n'est pas abonné...!");
    }

    const newParking = new Model({
        adresse:req.body.adresse,
        entrer: req.body.entrer,
        sortie: req.body.sortie,
        place: req.body.place,
        user: existingUser.matricule,
       
        dateEntrer: new Date(),
        dateSortie: null
    })
   
    try {
    
      await newParking.save();
        
        
      return res.send(`info_parking ajouté `);
        
    }
    catch (error) {
      return  res.status(400).json({message: error.message})
    }
    
  })

  router.get('/getParking', async  (req, res) => {

 
    const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization;
  
    if(!token) return res.send("Veillez ajouter un token")
   
          try {    
            const data = await Model.find();
            return res.json(data)
        } catch(error) {
          return res.send(error);
        }
  
  
  })

  router.patch('/updatePark/:id',  async (req, res) => {

    const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization;
    if(!token) return res.send("Veillez ajouter un token")

    try {
      const id = req.params.id;
      const updatedData = req.body;
      const options = { new: true };
      
      updatedData.dateSortie = new Date() 
      const result = await Model.findByIdAndUpdate(
          id, updatedData, options
      )

      if (result) return res.send(result)
      else return  res.status(404).json({ message: "Document introuvable" })
      
      
  }
  catch (error) {
    return res.status(400).json({ message: error.message })
  }
})