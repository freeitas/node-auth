require('dotenv').config();
import express from 'express';
import { createConnection } from 'typeorm';
import { routes } from './routes';
import cors from 'cors'

createConnection().then(() => {
	const app = express();

	app.use(express.json());
	app.use(cors({
		origin: ['http://localhost:3000'],
		credentials: true
	}))

	routes(app)

	app.listen(8000)
})
