const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/papers', (req, res) => {
    fs.readFile('mockData.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading mock data');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});