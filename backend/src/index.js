const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // 프론트(다른 포트)에서 호출 허용
app.use(express.json()); // 요청 body의 JSON 읽기

app.get('/', (req, res) => {
    res.send('hello');
});

app.use('/projects', require('./routes/project.route'));
app.use('/api/tech-stacks', require('./routes/techStack.route'));

// Express 5는 async 핸들러에서 throw된 에러를 여기로 넘겨줌
app.use((err, req, res, next) => {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ message: status === 500 ? '서버 오류' : err.message });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
