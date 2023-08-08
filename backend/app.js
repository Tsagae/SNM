const express = require('express')
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

app.get('/', (req, res) => {
    res.send({ text: "Hello World" });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});