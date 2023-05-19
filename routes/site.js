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
router.post('/site', async (req, res) => {
  const parking = [];

//   existingUser = await User.findOne({ _id: req.body.user });
//   existingPlace = await User.findOne({ _id: req.body.place });
//   if (!existingUser) return res.status(400).send("Cette utilisateur n'est pas abonné...!");
//   if (!existingPlace) return res.status(400).send("Cet site n'existe pas...!");
  const newSite = new Site({
    adresse: req.body.adresse,
    nom: req.body.nom,
    nombre: req.body.nombre,
    occupe: req.body.occupe,
    // user: existingUser.matricule,
    // dateEntrer: new Date(),
    // dateSortie: null
  })

  try {

    await newSite.save();


    return res.send(`Info_site ajouté `);

  }
  catch (error) {
    return res.status(400).json({ message: error.message })
  }

})

router.get('/getSite', async (req, res) => {


  const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization;

//   if (!token) return res.send("Veillez ajouter un token")

  try {
    const data = await Site.find();
    return res.json(data)
  } catch (error) {
    return res.send(error);
  }


})

router.patch('/updatePark/:id', async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization;
  if (!token) return res.send("Veillez ajouter un token")

  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    updatedData.dateSortie = new Date()
    const result = await Model.findByIdAndUpdate(
      id, updatedData, options
    )

    if (result) return res.send(result)
    else return res.status(404).json({ message: "Document introuvable" })


  }
  catch (error) {
    return res.status(400).json({ message: error.message })
  }
})


router.delete('/delSite', async(req, res) => {
    try {
        // const id = req.params.id;
        const data = await Site.deleteMany({})
        res.send(`Le Document avec le nom ${data.prenom} ${data.nom} a été supprimé..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
  })