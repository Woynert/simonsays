import { Request, Response } from "express";
import { render } from 'ejs';

import { ServerModel, iScore, iScoreContainer } from "../model/serverModel.js";

class ServerController {

	constructor() {
	}

	getScores(req: Request, res: Response): Response {
		console.log("Scores requested");
		// get
		try{
			const scores = ServerModel.getScores();
			return res.json({ 'error': false, 'scores': scores.scores});
		}
		catch(err){
			return res.json({ 'error': true });
		}
	}

	newScore(req: Request, res: Response): Response {

		let newscore: iScore = req.body;
		let scores: iScoreContainer;

		if (ServerModel.newScore(newscore)){
			console.log(`Registered new score ${JSON.stringify(newscore)}`);
			return res.json({ 'error': false });
		}
		else{
			return res.json({ 'error': true });
		}
	}
}

const serverController = new ServerController();
export default serverController;

