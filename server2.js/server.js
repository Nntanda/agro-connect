import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';


dotenv.config();

const access_token = process.env.SUNBIRD_API_TOKEN;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: "Let's have that for today!!"
  });
});

const url = 'https://sunbird-ai-api-5bq6okiwgq-ew.a.run.app';
app.post('/', async(req, res) =>{
    try{
        const text =req.body.text;  
        const src_lang = req.body.src_lang;
        const tgt_lang = req.body.tgt_lang;
        const headers = {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
      };
        const payload = {
            'source_language': `${src_lang}`,
            'target_language': `${tgt_lang}`,
            'text': `${text}`,
          };
      
          const response = await axios.post(`${url}/tasks/translate`, payload, { headers });
      
          if (response.status === 200) {
            const translatedText = response.data.text;
            res.status(200).send({ translatedText });
          } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error:', error);
          res.status(500).send({ error: error.message });
        }
      });

console.log("funny");
app.listen(8080, () => console.log('Server is running on port http://localhost:8080'));