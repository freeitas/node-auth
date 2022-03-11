import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";

export const Register = async (req: Request, res: Response) => {
	const body = req.body;

	if(body.password !== body.password_confirm) {
		return res.status(400).send({
			message: "Passwords do not match"
		});
	}

	const { password, ...user } = await getRepository(User).save({
		first_name: body.first_name,
		last_name: body.last_name,
		email: body.email,
		password: await bcryptjs.hash(body.password, 12),
	});

	res.send(user);
}

export const Login = async (req: Request, res: Response) => {
	const user = await getRepository(User).findOne({email: req.body.email})

	if(!user) {
		return res.status(400).send({
			message: 'Invalid credentials'
		})
	}

	if(!await bcryptjs.compare(req.body.password, user.password)) {
		return res.status(400).send({
			message: 'Invalid credentials'
		})
	}

	const accessToken = sign({
		id: user.id
	}, process.env.ACCESS_SECRET || '', {expiresIn: '30s'})

	const refreshToken = sign({
		id: user.id
	}, process.env.REFRESH_SECRET || '', {expiresIn: '1w'})

	res.cookie('access_token', accessToken, {
		httpOnly: true,
		maxAge: 24*60*60*100 // 1 day
	})

	res.cookie('refresh_token', refreshToken, {
		httpOnly: true,
		maxAge: 7*24*60*60*100 // 7 day
	})

	res.send({
		message: 'success'
	});
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
	try {
		const cookie = req.cookies['access_token']

		const payload: any = verify(cookie, process.env.ACCESS_SECRET || '')

		if(!payload) {
			return res.status(401).send({
				message: 'unauthenticated'
			})
		}

		const user = await getRepository(User).findOne(payload.id)

		if(!user) {
			return res.status(401).send({
				message: 'unauthenticated'
			})
		}

		const { password, ...data } = user

		res.send(data)
	} catch(e) {
			return res.status(401).send({
				message: 'unauthenticated'
			})
	}

}