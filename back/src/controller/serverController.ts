import { Request, Response } from "express";
import { render } from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

interface iScore{
    name: string;
    score: number;
}

interface iScoreContainer{
	scores: iScore[];
}

class ServerController {

	constructor() {
	}

	getScores(req: Request, res: Response): Response {
		// get
		try{
			let scorePath = path.join(__dirname, "../../data/scores.json");
			const data    = fs.readFileSync(scorePath, 'utf8');
			const scores  = <iScoreContainer>JSON.parse(data);

			console.log("Scores requested");
			return res.json({ 'error': false, 'scores': scores.scores});
		}
		catch(err){
			return res.json({ 'error': true });
		}
	}

	newScore(req: Request, res: Response): Response {

		let newscore: iScore = req.body;
		let scores: iScoreContainer;


		try{
			// get
			let scorePath = path.join(__dirname, "../../data/scores.json");
			const data = fs.readFileSync(scorePath, 'utf8');
			scores = <iScoreContainer>JSON.parse(data);

			// add
			scores.scores.push(newscore);

			// sort 
			scores.scores.sort((a: iScore, b: iScore) => {
				return (b.score - a.score);
			});

			// cut to only 10 elements
			scores.scores = scores.scores.slice(0, 10);

			// write
			fs.writeFileSync(scorePath, JSON.stringify(scores), 'utf8');
			console.log(`Registered new score ${JSON.stringify(newscore)}`);
			return res.json({ 'error': false });
		}
		catch(err){
			return res.json({ 'error': true });
		}

	}
}

const serverController = new ServerController();
export default serverController;

