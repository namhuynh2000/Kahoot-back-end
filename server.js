import express from 'express';
import logger from 'morgan';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import serverRouter from './routes/server.router.js';

const app = express();

const port = process.env.PORT_SERVER || 3000;

app.use(cors(
    {
        methods: 'GET, PATCH, POST, DELETE'
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/server', serverRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})