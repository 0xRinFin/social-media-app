import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = 3111;

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});