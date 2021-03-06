require('dotenv').config();
import cookieParser from 'cookie-parser'
import cors from 'cors';
import express from 'express';
import { createConnection } from 'typeorm';
import { routes } from './routes';

createConnection().then(() => {
	const app = express();
	app.use(cookieParser())
	app.use(express.json());

	app.use(cors({
		origin: ['http://localhost:3000'],
		credentials: true
	}))

	routes(app)

	app.listen(8000)
})
