require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
// const SerialPort = require('serialport');
const jwt = require("jsonwebtoken")
const cors = require('cors')
const userRoute = require('./routes/user');
const parkingRoute = require('./routes/parkings');
// const io = require("socket.io");

require('dotenv').config();


// Ici, nous stockons la chaîne dans une variable appelée mongoString.
const mongoString = process.env.DATABASE_URL

// connectons la base de données à notre serveur en utilisant Mongoose
mongoose.connect(mongoString);
const database = mongoose.connection
// database.on signifie qu'il se connectera à la base de données et lancera une erreur si la connexion échoue
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({origin: '*'}))

app.use('/api', userRoute)
app.use('/api', parkingRoute)

// const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//   cors: {
//     origins: ['http://localhost:3000']
//   }
// });


// const portSerial = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
// const parser = portSerial.pipe(new ReadlineParser({ delimiter: '\r\n' }))

// //ECOUTER LES EVENNEMENTS DEPUIS LE FRONT
// portSerial.on('open', () => {
//     io.on('connection', (socket) => {
  
  
//       socket.on('openBarrier', (msg) => {
//         console.log('barrier: ' + msg);
//         portSerial.write("2")
//       });
  
//       socket.on('closeBarrier', (msg) => {
//         console.log('barrier: ' + msg);
//         portSerial.write("3")
//       });

//       socket.on('isWater', (msg) => {
//         console.log('water: ' + msg);
//         portSerial.write("4")
//       });
  
//       socket.on('noWater', (msg) => {
//         console.log('water: ' + msg);
//         portSerial.write("5")
//       });

//       socket.on('isAccount', (msg) => {
//         console.log('account: ' + msg);
//         portSerial.write("6")
//       });
  
//       socket.on('noAccount', (msg) => {
//         console.log('account: ' + msg);
//         portSerial.write("7")
//       });

//       socket.on('isEntrer', (msg) => {
//         console.log('entrer: ' + msg);
//         portSerial.write("8")
//       });
  

//       socket.on('isSortie', (msg) => {
//         console.log('sortie: ' + msg);
//         portSerial.write("10")
//       });

//     });
//   });


//   //ECOUTER LES EVENNEMENTS DEPUIS ESP32,ARDUINO,MEGA...
// parser.on('data', (data) => {
  
//     console.log("en attente....");
    
//     try {
//     let dataStr = data.toString();
//     let matin = "", soir = "", dureMatin = "", dureSoir = "";
    
  
//       let jsonData = JSON.parse(dataStr)
  
//       // If parsing succeeds, process the JSON data
//       console.log('Received JSON:', jsonData);
  
//       if (jsonData) {
  
//         io.emit('presence', `${jsonData.presence}`);
//         io.emit('buzzer', `${jsonData.buzzer}`);
//         io.emit('incendi', `${jsonData.incendi}`);
//         io.emit('barriere', `${jsonData.barriere}`);
//         io.emit('arrosage', `${jsonData.arrosage}`);
  
//         let buzzerEtIncendi = {
//           'buzzer': jsonData.buzzer,
//           'incendi': jsonData.incendi,
//           'dateInsertion': new Date(),
//           'presence': jsonData.presence,
//           'barriere': jsonData.barriere,
//           'arrosage': jsonData.arrosage,
//         };

//         //Connexion a mongodb et insertion 
//         const datHeure = new Date();
//         const min = datHeure.getMinutes();
//         const heur = datHeure.getHours(); 
//         const sec = datHeure.getSeconds();
  
//         const parkingCollection = database.collection('parking');
  
        
  
//         parkingCollection.findOne({}, function (err, result) {
//           if (err) {
//             console.log('Error finding document:', err);
//             return;
//           }
//           matin = result.matin;
//           soir = result.soir;
//           dureMatin = result.dureMatin
//           dureSoir = result.dureSoir
//           console.log(sec, ": ", dureSoir);
//           console.log("seconde est de :", sec == dureSoir);
//         })
  
  
//         if ((heur == matin && min == 00 && sec == 00)) {
//           portSerial.write("2")
//           console.log("arroser");
//         } else if ((heur == matin && min == 00 && sec == dureMatin)) {
//           portSerial.write("3");
//           console.log("arreter");
//         } else if ((heur == soir && min == 00 && sec == 00)) {
//           console.log("arroser");
//           portSerial.write("2")
//         } else if (heur == soir && min == 00 && sec == dureSoir) {
//           portSerial.write("3");
//           console.log("arreter");
//         }
  
//         if ((heur == 08 && min == 00 && sec == 00) || (heur == 19 && min == 00 && sec == 00)) {
  
//           setTimeout(() => {
//             const collection = database.collection('serres');
  
//             collection.insertOne(tempEtHum, function (err) {
//               if (err) throw err;
//               console.log("Data inserted successfully!");
//             });
//           }, 1000);
//         }
  
  
//         if (jsonData.rfid == true) {
//           token = jwt.sign(
//             { userId: 'admin@gmail.com' }, // id et email de la personne connectée
//             process.env.JWT_SECRET, // cette clé secrète se trouve dans le fichier .env
//             { expiresIn: "1h" } // delai d'expiration du token
//           )
//           console.log(token);
//           io.emit('my broadcast', `${token}`);
//         } else {
//           io.emit('my broadcast', "refuse");
//         }
  
//       }
    
//     } catch (error) {
//       // throw error
//     }
//   })
  
  
  

 

app.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
 })