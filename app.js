const express = require('express');
const app = express(); 
const morgan = require('morgan');
 const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./middleware/jwt');
const errorHandler = require('./middleware/error');
const api = process.env.API_URL;


//Middleware

app.use(morgan('tiny'));
app.use(express.json()); 
app.use(cors()); 
app.options('*',cors ());
app.use(authJwt());
app.use(errorHandler);


 
const userRouter = require ('./routes/user');
const formateurRouter = require ('./routes/formateur');
const formationRouter = require ('./routes/formation');
const seanceRouter = require ('./routes/seance');

  

//Routes 
 app.use(`${api}/users`, userRouter);
 app.use(`${api}/formateur`, formateurRouter);
 app.use(`${api}/formation`, formationRouter);
 app.use(`${api}/seance`, seanceRouter);





 
//Database
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
   dbName: 'ChangeMaker'
})
.then(()=>{
  console.log('Database Connection is ready...')
})
.catch((err)=> {
  console.log(err);
})
 

app.listen(3000, ()=>{
     console.log('server is running http://localhost:3000');
})