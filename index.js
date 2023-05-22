// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');

// const bodyParser = require('body-parser');
// const SerialPort = require('serialport');
// const { ReadlineParser } = require('@serialport/parser-readline');
// const jwt = require("jsonwebtoken")
// const cors = require('cors')
const userRoute = require('./routes/user');
const parkingRoute = require('./routes/parkings');
const siteRoute = require('./routes/site');
// // const io = require("socket.io");

// require('dotenv').config();


// // Ici, nous stockons la chaîne dans une variable appelée mongoString.
// const mongoString = process.env.DATABASE_URL

// // connectons la base de données à notre serveur en utilisant Mongoose
// mongoose.connect(mongoString);
// const database = mongoose.connection
// // database.on signifie qu'il se connectera à la base de données et lancera une erreur si la connexion échoue
// database.on('error', (error) => {
//     console.log(error)
// })

// database.once('connected', () => {
//     console.log('Database Connected');
// })

// const app = express();

// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors({origin: '*'}))

// app.use('/api', userRoute)
// app.use('/api', parkingRoute)



const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const cors = require('cors');
const site = require('./model/site');
// const routes = require('./routes/route');
// const serreRoute = require('./routes/serreRouter')
// const arrosageRoute = require('./routes/arrosageRouter')

require('dotenv').config();

const databaseLink = process.env.DATABASE_URL;
mongoose.connect(databaseLink);
const database = mongoose.connection;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.json());

// app.use('/api', routes)
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
const io = require('socket.io')(http, {
  cors: {
    origins:"*" //['http://localhost:3000','*']
  }
});


const portSerial0 = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser0 = portSerial0.pipe(new ReadlineParser({ delimiter: '\r\n' }))
// const portSerial1= new SerialPort('/dev/ttyUSB1', { baudRate:115200  });
// const parser1 = portSerial1.pipe(new ReadlineParser({ delimiter: '\r\n' }))

io.on('connection', (socket) => {

  socket.on('test', (msg) => {
    console.log('tester: ' + msg)
    // portSerial.write("1")
  });

  socket.emit('pompe_mandela',1)
  socket.emit('rfid_mandela',1)
  socket.emit('buzzer_mandela',1)
  socket.emit('barriere_mandela',0)
  socket.emit('flamme_mandela',1)
  socket.emit('mouvement_mandela',1)

  socket.emit('pompe_surete',1)
  socket.emit('rfid_surete',1)
  socket.emit('buzzer_surete',0)
  socket.emit('barriere_surete',1)
  socket.emit('flamme_surete',0)
  socket.emit('mouvement_surete',1)

  socket.emit('pompe_simplon',1)
  socket.emit('rfid_simplon',1)
  socket.emit('buzzer_simplon',1)
  socket.emit('barriere_simplon',1)
  socket.emit('flamme_simplon',0)
  socket.emit('mouvement_simplon',1)
});

// parser.on('open', () => {
//   console.log('Connexion série établie !');
// });
let test;
parser0.on('data', (data) => {
  const flameValue = data.toString().trim();
  console.log(`Valeur reçue : ${data}`);
  getSite();
  // portSerial0.write("25")
  // Effectuez ici le traitement souhaité avec la valeur de flamme reçue
});

// parser1.on('data', (data) => {
//   const flameValue = data.toString().trim();
//   console.log(`Valeur 2 reçue : ${data}`);
 
//   const jsonData = test//.toString();
//   portSerial1.write(test, (err) => {
//     if (err) {
//       console.error('Erreur lors de l\'envoi des données JSON :', err);
//     } else {
//       console.log('Données JSON envoyées avec succès !');
//     }
//   });
//   // Effectuez ici le traitement souhaité avec la valeur de flamme reçue
// });



//ECOUTER LES EVENNEMENTS DEPUIS LE FRONT


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

//ECOUTER LES EVENNEMENTS DEPUIS ESP32,ARDUINO,MEGA...

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


 

async function getSite1() {

  // let site1;
  let nombrePlace1
  const data = await site.find({});
  for (const iterator of data) {
    // console.log(iterator.nom);
    if(iterator.nom ==="Mandela"){
      // site1= iterator.nom;
      nombrePlace1 = iterator.occupe
    }
    console.log(nombrePlace1);
    return nombrePlace1
  }
  // data.toArray().then((documents) => {
  //   console.log(documents);
  // });
  // console.log((data.nom));
  // // const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URI
  // // const client = new MongoClient(uri);

  // try {
  //   // await client.connect();

  //   // const database = client.db('your-database-name');
  //   // const collection = database.collection('your-collection-name');
  //   const siteCollection = database.collection('site');

  //   await   siteCollection.find({}, function (err, result) {
  //     if (err) {
  //       console.log('Error finding document:', err);
  //       return;
  //     }

  //     result.toArray().then((documents) => {
  //       console.log(documents);
  //     });
  //   });
  // } catch (error) {
  //   console.error('Error:', error);
  // } 
}

async function getSite2() {

  let nombrePlace2
  const data = await site.find({});
  for (const iterator of data) {
    // console.log(iterator.nom);
    if(iterator.nom ==="Surêté"){
      // site2= iterator.nom;
      nombrePlace2 = iterator.occupe
    }
  }

  return nombrePlace2
  
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

  const place ={
    place: nombrePlace1
  }

sendJSONData(place) 
}

// console.log(getSite3());
// getSite1() ;
// Exemple d'utilisation

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

// // Exemple d'utilisation
// // console.log("place: ", place);
// const sensorData = {
//   temperature: 77,
//   humidity: 50,
// };

// sendJSONData(sensorData);

// const dataToSend = { sensorValue: '1234' };
// sendDataToESP32(dataToSend);

//ECOUTE DU SERVER SUR LE PORT 3000
http.listen(8000, () => {
  console.log('listening on :8000');
});

