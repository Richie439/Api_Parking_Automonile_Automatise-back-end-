const express = require('express');

const router = express.Router()
const authorize = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Model = require('../model/parking');
const User = require('../model/model');
const Site = require('../model/site');


module.exports = router;

//Post Method
router.post('/parking', async (req, res) => {
  const parking = [];

  existingUser = await User.findOne({ _id: req.body.user });
  existingPlace = await Site.findOne({ _id: req.body.place });

  if (!existingUser) return res.status(400).send("Cette utilisateur n'est pas abonné...!");
  if (!existingPlace) return res.status(400).send("Cet site n'existe pas...!");
  if ((existingPlace.nombre - existingPlace.occupe) <= 0) return res.status(403).send("Aucune place disponible...!");
  
  const newParking = new Model({
    adresse: req.body.adresse,
    entrer: req.body.entrer,
    sortie: req.body.sortie,
    place: existingPlace.nom,
    user: existingUser.matricule,
    dateEntrer: new Date(),
    dateSortie: null
  })

  try {

    const options = { new: true };
    await Site.findByIdAndUpdate(existingPlace,{"occupe": (existingPlace.occupe+1)},options)
    await newParking.save();

    return res.send(`info_parking ajouté `);

  }
  catch (error) {
    return res.status(400).json({ message: error.message })
  }

})

router.get('/getParking', async (req, res) => {


  const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization;

  if (!token) return res.send("Veillez ajouter un token")

  try {
    const data = await Model.find();
    return res.json(data)
  } catch (error) {
    return res.send(error);
  }


})

router.patch('/updatePark/:id', async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization;
  if (!token) return res.send("Veillez ajouter un token")

  try {
    existingPlace = await Site.findOne({ _id: req.body.place });
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    updatedData.dateSortie = new Date()

    await Site.findByIdAndUpdate(existingPlace,{"occupe": (existingPlace.occupe-1)},options)
    const result = await Model.findByIdAndUpdate(id, updatedData, options)

    if (result) return res.send(result)
    else return res.status(404).json({ message: "Document introuvable" })


  }
  catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.delete('/delPark', async(req, res) => {
  try {
      // const id = req.params.id;
      const data = await Model.deleteMany({})
      res.send(`Le Document avec le nom ${data.prenom} ${data.nom} a été supprimé..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})
