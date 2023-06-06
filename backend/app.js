const express = require('express')
const { BtcInr } = require('./schema')
const app = express()
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(cors({
    origin: 'http://127.0.0.1:5500'
  }));

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/quadB');

    console.log("Mongodb connected")
};

connectDB()
mongoose.promise = global.Promise




app.get('/get-list', async (req, res, next) => {
    const url = 'https://api.wazirx.com/api/v2/tickers/';

    await axios.get(url)
      .then(response => {
        const data = response.data;
        const dataArray = Object.entries(data);

        dataArray.sort((a, b) => b[1].last - a[1].last);

        const top10Objects = dataArray.slice(0, 10);

        // Insert the top 10 objects into MongoDB
        const promises = top10Objects.map(item => {
          const data = item[1]; // Extract the object from the item
          return BtcInr.create(data); // Insert the object into MongoDB
        });

        Promise.all(promises)
          .then(() => {
            console.log('Data inserted successfully.');
            res.status(200).send(top10Objects);
          })
          .catch(error => {
            console.error('Error inserting data:', error);
            res.status(500).send('Error inserting data into MongoDB.');
          });
      })
      .catch(error => {
        console.log('Error:', error);
        res.status(500).send('Error fetching data from the API.');
      });
  });


app.listen(3001, () => {
    console.log("Server running on 3001")
}) 