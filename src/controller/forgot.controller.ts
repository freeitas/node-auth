import { Request, Response } from "express";
import { createTransport } from "nodemailer";
import { getRepository } from "typeorm";
import { Reset } from "../entity/reset.entity";

export const Forgot = async (req: Request, res: Response) => {
	const { email } = req.body;
	const token = Math.random().toString(20).substring(2, 12)

	await getRepository(Reset).save({
		email,
		token
	});

  //mock
  const transporter = createTransport({
    host: '0.0.0.0',
    port: 1025
  });

  const url = `http://localhost:3000/reset/${token}`

  await transporter.sendMail({
    from: 'from@exemple.com',
    to: email,
    subject: 'reset your password!',
    html: `Click <a href="${url}">here</a> to reset your password!`
  })

	res.send({
    message: 'Please check yout email!'
  });
}