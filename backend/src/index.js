const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // 요청 body의 JSON 읽기

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});