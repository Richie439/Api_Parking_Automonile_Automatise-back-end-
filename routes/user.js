const express = require('express');

const router = express.Router()
const authorize = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Model = require('../model/model');

module.exports = router;

//Post Method
router.post("/login", async (req, res, next) => {
    
  let { email, password } = req.body;

  let existingUser;

  existingUser = await Model.findOne({ email: email });
  if (!existingUser) {
    return res.status(400).send("email n'existe pas...!");
  }
  //check if password is correct
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(400).send("mot de passe est invalide");
  }


  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "process.env.JWT_SECRET",
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    const error = new Error("Erreur! Quelque chose s'est mal passée.");
    return next(error);
  }
 
  res
    .status(200)
    .json({
      success: true,
      data: {
        userId: existingUser.id,
        email: existingUser.email,
        token: token,
      },
    });
});

router.post('/compte',   async(req, res, next) => {
  const account = [];
    
 
     
  
})

router.post('/post', async (req, res) => {
  const users = [];

  const newUser = new Model({
      nom: req.body.nom,
      prenom:req.body.prenom,
      email: req.body.email,
      telephone: req.body.telephone,
      typeAbonnement: req.body.typeAbonnement,
      numeroCarte: req.body.numeroCarte,
      password: req.body.password,
      code: req.body.code,
      dateInscrit: new Date()
  })
 
  try {
    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;
    users.push(newUser);
    // res.json(newUser);
    await newUser.save();
      
      return res.send(`Utilisateur ajouté `);
      
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

router.get('/getById/:id',  async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization ;

  if(!token) return res.send("Veillez ajouter un token")

  try {
    const data = await Model.findById(req.params.id);
    return res.json(data)
  }
  catch (error) {
    return res.status(500).json({ message: error.message })
  }
    
})

router.patch('/update/:id',  async (req, res) => {

    const token = req.headers.authorization?.split(' ')[1] || req.headers?.authorization;
    if(!token) return res.send("Veillez ajouter un token")

    try {
      const id = req.params.id;
      const updatedData = req.body;
      const options = { new: true };
      
      if (updatedData.password){
          const hash = await bcrypt.hash(updatedData.password, 10);
          updatedData.password = hash;
          
          const result = await Model.findByIdAndUpdate(
          id, updatedData, options
          );
      
         return res.send(result);
         
      }
      
      const result = await Model.findByIdAndUpdate(
          id, updatedData, options
      )

      res.send(result)
      
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})














