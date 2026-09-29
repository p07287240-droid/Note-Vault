require('dotenv').config({ path: './backend/.env' });
const express = require ('express');
const cors = require('cors');
const connectDB = require ('./config/db');
const Notes = require('./models/Notes');

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use('/auth',require('./routes/auth'));
app.use('/notes',require('./routes/notes'));

app.use((err,req,res,next)=>{
    console.error(err.message);
    res.status(400).json({error:err.message});
});

app.listen(process.env.PORT,() => console.log('Server running'));