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
    return res.status(404).send("email n'existe pas...!");
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
        nom: existingUser.nom,
        prenom: existingUser.prenom,
        matricule: existingUser.matricule,
        tel: existingUser.tel,
        role: existingUser.role,
        token: token,
      },
    });
});

router.post('/compte',   async(req, res, next) => {
  const account = [];
    
 
     
  
})

router.post('/post', async (req, res) => {
  const users = [];

  const tel = await Model.find();
  console.log(tel.find(x=>x?.telephone === req.body.telephone));

  const findTel = tel.find(x=>x?.telephone === req?.body?.telephone)?? false;
  const findMail = tel.find(x=>x?.email === req?.body?.email)?? false;
  const findRfid = tel.find(x=>x?.rfid === req?.body?.rfid)?? false;
  if(findTel) return res.send(`Ce numero existe déjà `); 
  if(findMail) return res.send(`Ce email existe déjà `); 
  if(findRfid) return res.send(`Cette carte est déjà utilisée`); 
    
  const newUser = new Model({
      nom: req.body.nom,
      prenom:req.body.prenom,
      email: req.body.email,
      telephone: req.body.telephone,
      typeAbonnement: req.body.typeAbonnement,
      numeroCarte: req.body.numeroCarte,
      rfid: req.body.rfid,
      matricule: generateMatricule(),
      password: req.body.password,
      code: req.body.code,
      etat: true,
      role: "user",
      dateInscrit: new Date()
  })

  console.log(req.body);
 
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
    // if(!token) return res.send("Veillez ajouter un token")

    try {
      const id = req.params.id;
      const updatedData = req.body;
      const options = { new: true };
      
      if (updatedData.password){
        if (!updatedData.oldpassword) {
          return res.status(400).send("mot de passe est invalide");
        }
        const existingPassword = await Model.findById(id)
        const isPasswordValid = await bcrypt.compare(updatedData.oldpassword, existingPassword.password);
        if (!isPasswordValid) {
          return res.status(400).send("mot de passe est invalide");
        }
          const hash = await bcrypt.hash(updatedData.password, 10);
          updatedData.password = hash;
          
          const result = await Model.findByIdAndUpdate(
          id, updatedData, options
          );
      
         return res.send(updatedData);
         
      }
      
      const result = await Model.findByIdAndUpdate(
          id, updatedData, options
      )

      return res.send('result modifier')
      
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

router.delete('/delete', async(req, res) => {
  try {
      // const id = req.params.id;
      const data = await Model.deleteMany({})
      res.send(`Le Document avec le nom ${data.prenom} ${data.nom} a été supprimé..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})


const generateMatricule=()=> {
  const prefix = "MAT-";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = '';

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return prefix + result;
}














