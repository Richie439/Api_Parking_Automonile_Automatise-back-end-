    
const userRoute = require('./routes/user');
const parkingRoute = require('./routes/parkings');
const siteRoute = require('./routes/site');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const mongoose = require('mongoose');
const cors = require('cors');
const site = require('./model/site');
const model = require('./model/model');
const parking = require('./model/parking');

require('dotenv').config();

const databaseLink = process.env.DATABASE_URL;
mongoose.connect(databaseLink);
const database = mongoose.connection;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.json());

app.use('/api', userRoute)
app.use('/api', parkingRoute)
app.use('/api', siteRoute)



database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

module.exports = database;


const http = require('http').createServer(app);
const io = require('socket.io')(http, {cors: {origins:"*"} });




const portSerial0 = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser0 = portSerial0.pipe(new ReadlineParser({ delimiter: '\r\n' }))
const portSerial1= new SerialPort('/dev/ttyUSB1', { baudRate:115200  });
const parser1 = portSerial1.pipe(new ReadlineParser({ delimiter: '\r\n' }))
// const portSerial2 = new SerialPort('/dev/ttyUSB0', { baudRate: 19200 });
// const parser2 = portSerial0.pipe(new ReadlineParser({ delimiter: '\r\n' }))


let moveStatus = 0;
let flamme_and_buzzer= 0;
let distance ;
parser0.on('data', (data) => {
  let dataStr = data.toString();
  console.log("en attente....");
  try {
    
    let jsonData = JSON.parse(data)
    // console.log("Valeur reçue", jsonData.rfid);
    if (jsonData?.hasOwnProperty('place')) {
      console.log("Valeur reçue conforme:", jsonData.rfid);
    } 
    
    let rfid =  jsonData.rfid.replace(/\s/g, '')
    let servo = jsonData.servo;
    let flamme = jsonData.flamme;
    let move = jsonData.presence;
    console.log("distance :", move);
    distance = move
    if(move < 10) moveStatus = 1; else moveStatus = 0;
    if(flamme < 1000) flamme_and_buzzer= 1; else flamme_and_buzzer= 0 
    if(rfid) checkRfid(rfid,move);
    
    

    getSite();

    io.emit('buzzer_mandela',flamme_and_buzzer);
    io.emit('flamme_mandela',flamme_and_buzzer);
    io.emit('barriere_mandela',servo);
    io.emit('mouvement_mandela',moveStatus);
   

  } catch (error) {
    console.log(error);
  }

});



parser1.on('data', (data) => {
  let dataStr = data.toString();

  console.log("test passe :",dataStr);
  console.log(dataStr.slice(2));
  if(dataStr.slice(2))checkCode(dataStr.slice(2),distance);
  console.log(distance);
  
});

// parser2.on('data', (data) => {
//   let dataStr = data.toString();
//   let jsonData = JSON.parse(dataStr)
//   console.log("Arduino ....", jsonData);
//   // try {
    
//   //   let jsonData = JSON.parse(dataStr)
//   //   // console.log("Valeur reçue", jsonData.rfid);
//   //   if (jsonData.hasOwnProperty('place')) {
//   //     console.log("Valeur reçue conforme:", jsonData.rfid);
//   //   } 
    
//   //   let rfid =  jsonData.rfid.replace(/\s/g, '')
//   //   let servo = jsonData.servo;
//   //   let move = jsonData.presence;
//   //   let moveStatus = 0;
//   //   if(move < 10) moveStatus = 1;
//   //   if(rfid) checkRfid(rfid);
       
//   //   getSite();
   

//   //   io.on('connection', (socket) => {

//   //     socket.on('test', (msg) => {
//   //       console.log('tester: ' + msg)
//   //     });

//   //     socket.emit('pompe_mandela',0)
//   //     socket.emit('rfid_mandela',rfid)
//   //     socket.emit('barriere_mandela',servo)
//   //     socket.emit('mouvement_mandela',moveStatus)   
//   //   });

//   // } catch (error) {
//   //   console.log(error);
//   // }

// });



// ECOUTER LES EVENNEMENTS DEPUIS LE FRONT


// portSerial.on('open', () => {
//   io.on('connection', (socket) => {

//     socket.on('isOn', (msg) => {
//       console.log('lampe: ' + msg);
//       portSerial.write("1")
//     });

//     socket.on('isOff', (msg) => {
//       console.log('lampe: ' + msg);
//       portSerial.write("0")
//     });

//     socket.on('isWater', (msg) => {
//       console.log('water: ' + msg);
//       portSerial.write("2")
//     });

//     socket.on('noWater', (msg) => {
//       console.log('water: ' + msg);
//       portSerial.write("3")
//     });

//     socket.on('noFan', (msg) => {
//       console.log('fan: ' + msg);
//       portSerial.write("4")
//     });

//     socket.on('isFan', (msg) => {
//       console.log('fan: ' + msg);
//       portSerial.write("5")
//     });

//     socket.on('openDoor', (msg) => {
//       console.log('door: ' + msg);
//       portSerial.write("6")
//     });

//     socket.on('closeDoor', (msg) => {
//       console.log('door: ' + msg);
//       portSerial.write("7")
//     });
//   });
// });

// ECOUTER LES EVENNEMENTS DEPUIS ESP32,ARDUINO,MEGA...

// parser.on('data', (data) => {
  
//   console.log("en attente....");
  
//   try {
//   let dataStr = data.toString();
//   let matin = "", soir = "", dureMatin = "", dureSoir = "";
  

//     let jsonData = JSON.parse(dataStr)

//     // If parsing succeeds, process the JSON data
//     console.log('Received JSON:', jsonData);

//     if (jsonData) {

//       io.emit('temp', `${jsonData.temp}`);
//       io.emit('hum', `${jsonData.hum}`);
//       io.emit('lum', `${jsonData.lum}`);
//       io.emit('sol', `${jsonData.sol}`);
//       io.emit('buzzer', `${jsonData.buzzer}`);
//       io.emit('toit', `${jsonData.toit}`);
//       io.emit('door', `${jsonData.door}`);

//       let tempEtHum = {
//         'temp': jsonData.temp,
//         'hum': jsonData.hum,
//         'dateInsertion': new Date(),
//         'lum': jsonData.lum,
//         'sol': jsonData.sol,
//       };
//       //Connexion a mongodb et insertion Temperature et humidite
//       //  serre.save(tempEtHum)

//       const datHeure = new Date();
//       const min = datHeure.getMinutes();
//       const heur = datHeure.getHours(); //heure
//       const sec = datHeure.getSeconds();

//       const arrosageCollection = database.collection('arrosages');

//       // const collection = client.db('<database>').collection('<collection>');

//       arrosageCollection.findOne({}, function (err, result) {
//         if (err) {
//           console.log('Error finding document:', err);
//           return;
//         }
//         matin = result.matin;
//         soir = result.soir;
//         dureMatin = result.dureMatin
//         dureSoir = result.dureSoir
//         console.log(sec, ": ", dureSoir);
//         console.log("seconde est de :", sec == dureSoir);
//       })


//       if ((heur == matin && min == 00 && sec == 00)) {
//         portSerial.write("2")
//         console.log("arroser");
//       } else if ((heur == matin && min == 00 && sec == dureMatin)) {
//         portSerial.write("3");
//         console.log("arreter");
//       } else if ((heur == soir && min == 00 && sec == 00)) {
//         console.log("arroser");
//         portSerial.write("2")
//       } else if (heur == soir && min == 00 && sec == dureSoir) {
//         portSerial.write("3");
//         console.log("arreter");
//       }

//       if ((heur == 08 && min == 00 && sec == 00) || (heur == 19 && min == 00 && sec == 00)) {

//         setTimeout(() => {
//           const collection = database.collection('serres');

//           collection.insertOne(tempEtHum, function (err) {
//             if (err) throw err;
//             console.log("Data inserted successfully!");
//           });
//         }, 1000);
//       }


//       if (jsonData.rfid == true) {
//         token = jwt.sign(
//           { userId: 'admin@gmail.com' }, // id et email de la personne connectée
//           process.env.JWT_SECRET, // cette clé secrète se trouve dans le fichier .env
//           { expiresIn: "1h" } // delai d'expiration du token
//         )
//         console.log(token);
//         io.emit('my broadcast', `${token}`);
//       } else {
//         io.emit('my broadcast', "refuse");
//       }

//     }
  
//   } catch (error) {
//     // throw error
//   }
// })


 

// getParking(1016)

async function getParking(code) {
  try {
    const data = await parking.find({});
    const user = await model.find({});
    const siteMandela = await model.find({});

    const mandelaParking = data.find(x => x?.place === "Mandela") || false;
    const userParking = user.find(x => x?.code === code) || false;
    const nomSite = siteMandela.find(x => x?.nom === "Mandela") || false;
    const idSite = nomSite?._id || false;

    const userId = userParking?._id || false;
    const idParking = mandelaParking?._id || false;
    const checkUserMatricule = mandelaParking?.user || false;
    const getMatricule = userParking?.matricule || false;

    console.log(userId, idParking, checkUserMatricule, getMatricule);
    
    if (userParking && userId && idParking) {
      if (checkUserMatricule === getMatricule) {
        console.log("semaine");
        const id = mongoose.Types.ObjectId(idParking.toString());
        console.log(idParking.toString());

        let park = {
          sortie: "1",
          place: idSite
        };

        const updatedPark = await parking.findByIdAndUpdate(id, park, { new: true });
        console.log("Updated Park:", updatedPark);
      } else {
        let park = new parking({
          adresse: "avenue 22",
          entrer: "1",
          sortie: "0",
          place: idSite,
          user: userId
        });

        await park.save();
      }
    } else if (!idParking) {
      console.log("Inactif");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  
}

async function getUser() {

  const data = await model?.find({});
  for (const iterator of data) {
    // console.log(iterator.nom);
    if(iterator?.etat === false || isDateLessThanOneMonth(iterator?.dateInscrit)){
      // site2= iterator.nom;
      // nombrePlace2 = iterator.occupe
      console.log(iterator);
    }
  }

  
}

async function checkCode(code,distance) {

  const user = await model?.find({});

  const userCode = user.find(x=>x?.code == code)?? false;
  const userEtat = userCode?.etat == true ?? false;
  const dateInscrit = userCode?.dateInscrit?? false;
  const abonnementUser = userCode?.typeAbonnement?? false;
  console.log(userCode);
  // console.log(userCode,userEtat,dateInscrit,abonnementUser);
  if(userCode && userEtat){
    if (abonnementUser =="semaine" && isDateLessThanOneWeek(dateInscrit)) {
      console.log("abonnement semaine expiré")
    }else if (abonnementUser =="mois" && isDateLessThanOneMonth(dateInscrit)) {
      console.log("abonnement mois expiré")
    }else{
      console.log("code est ok");
      const data = await site.find({});
      const mandela = data?.find(x=>x?.nom == "Mandela");
      
      const jsonData = {
        servo: 1
      }
       sendJSONData(jsonData) 
       mandela.occupe = mandela.occupe -1 
      if(distance <= 10 ){ 

        mandela.save();

      }
      console.log("mandela :",  mandela.occupe);
      // const jsonData = {
      //   servo: 1,
      // };
    }
  }else if(!userEtat){
    console.log("Inactif")
  }else{
    console.log("Introuvable")
  }
  // userCode ? console.log("ouvrir"):console.log("interdit")
  // for (const iterator of data) {
  //   if(iterator?.etat === true || isDateLessThanOneMonth(iterator?.dateInscrit)){
  //     if(iterator?.code == code ){
  //       console.log("ouvrir");
  //       return;
  //     }
  //     // console.log(iterator);
  //   }//else 
  // } 
}

async function checkRfid(rfid,distance) {

  const user = await model?.find({});

  const userRfid = user.find(x=>x?.rfid == rfid.replace(/\s/g, ''))?? false;
  const userEtat = userRfid?.etat?? false;
  const dateInscrit = userRfid?.dateInscrit?? false;
  const abonnementUser = userRfid?.typeAbonnement?? false;
  
  console.log(userEtat);
  if(userRfid && userEtat){
    if (abonnementUser =="semaine" && isDateLessThanOneWeek(dateInscrit)) {
      console.log("abonnement semaine expiré")
    }else if (abonnementUser =="mois" && isDateLessThanOneMonth(dateInscrit)) {
      console.log("abonnement mois expiré")
    }else{
      console.log("ok connexion");
      const data = await site.find({});
      const mandela = data?.find(x=>x?.nom == "Mandela");

      if( mandela.occupe == 0) return;
      const jsonData = {
        servo: 1
      }
     sendJSONData(jsonData) 
      if(distance <= 10 ){ 
        mandela.occupe = mandela.occupe -1 
        getParking(1020)
        mandela.save();

      }
      console.log("mandela :",  mandela.occupe);
    }

  }else if(!userEtat){
    console.log("Carte invalid")
    const jsonData = {
      user: 0
    };
    sendJSONData(jsonData) 
  }else{
    console.log("Introuvable")
  }
  
}

async function getSite() {

//   let site1,site2,site3;
  let nombrePlace1,nombrePlace2,nombrePlace3
  const data = await site.find({});
  for (const iterator of data) {
    // console.log(iterator.nom);
    if(iterator.nom ==="Simplon"){
      nombrePlace3 = iterator.occupe
    }else if(iterator.nom ==="Surêté"){
      // site2= iterator.nom;
      nombrePlace2 = iterator.occupe
    }else if(iterator.nom ==="Mandela"){
      // site1= iterator.nom;
      nombrePlace1 = iterator.occupe
    }
  }
  
  // let place = nombrePlace1
  // const places ={
  //   place: place
  // }

  // let jsonDataParse = JSON.stringify(places);
  const jsonData = {
    place: nombrePlace1
  };
  
  // const place = JSON.stringify(jsonData);

  sendJSONData(jsonData) 
}

function sendJSONData(data) {
  const jsonData = JSON.stringify(data);
  portSerial0.write(jsonData + '\n', (err) => {
    if (err) {
      console.error('Erreur lors de l\'envoi des données :', err);
    } else {
      console.log('Données envoyées avec succès !');
    }
  });
}

const isDateLessThanOneMonth = (dateString) => {
  const currentDate = new Date();
  const targetDate = new Date(dateString);

  // Calculer la date il y a un mois à partir de la date actuelle
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  return targetDate < oneMonthAgo;
};

const isDateLessThanOneWeek = (dateString) => {
  const currentDate = new Date();
  const targetDate = new Date(dateString);

  // Calculer la date il y a un mois à partir de la date actuelle
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(currentDate.getDate() - 7);

  return targetDate < oneMonthAgo;
};


//ECOUTE DU SERVER SUR LE PORT 3000
http.listen(8000, () => {
  console.log('listening on :8000');
});

