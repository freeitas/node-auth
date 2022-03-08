import express, {Request, Response } from 'express'
import { createConnection } from 'typeorm';

createConnection().then(() => {
	const app = express();

	app.use(express.json());

	app.get('/', (req: Request, res: Response) => {
		res.send('hello')
	})

	app.listen(8000)
})
