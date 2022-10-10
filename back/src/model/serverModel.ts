import * as fs from 'fs';
import * as path from 'path';
export { ServerModel, iScore, iScoreContainer };

interface iScore{
	name: string;
	score: number;
}

interface iScoreContainer{
	scores: iScore[];
}

class ServerModel{

	constructor(){
	}

	public static getScores(): iScoreContainer{
		let scores: iScoreContainer = {scores: []};
		// get
		try{
			let scorePath = path.join(__dirname, "../../data/scores.json");
			const data    = fs.readFileSync(scorePath, 'utf8');
			scores  = <iScoreContainer>JSON.parse(data);
		}
		catch(err){
		}
		console.log(scores);
		return (scores);
	}

	public static newScore(newscore: iScore): boolean {

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
			return true;
		}
		catch(err){
			return false;
		}

	}
}
