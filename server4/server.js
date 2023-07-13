import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.post('/', async(req, res) =>{
  const {username} = req.body;
  try{
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      {username: username, secret: username, first_name: username},
      {headers:{
        "private-key": "2851b533-6450-461f-bbcc-0ccbd5937829"
      }}
      )
      return res.status(r.status).json(r.data)
  }catch (e){
    return res.status(e.response.status).json(e.response.data)
  }
})

app.listen(3001, () => console.log('Server is running on port http://localhost:3001'));