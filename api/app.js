import express from 'express';
import morgan from 'morgan';

const app = express();
const port = 3000

app.use(morgan('dev'))

app.get('/', (req, res) => res.send('Hello Express 👋'))

app.listen(port, () => console.log(`Application Node started on : http://localhost:${port}`));