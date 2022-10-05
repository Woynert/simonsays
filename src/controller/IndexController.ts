import { IndexModel } from "../model/IndexModel.js";
import { IndexView } from "../view/IndexView.js";
export { iScore, iScoreStorage };

// util
async function sleep(ms : number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

interface iScore{
	name: string;
	score: number;
}

interface iScoreStorage{
	scores: iScore[];
}

interface iGetScore{
	error: boolean;
	scores: iScore[];
}

export class IndexController {

    public model: IndexModel;
    public view: IndexView;

    constructor(model: IndexModel, view: IndexView) {
        this.model = model;
        this.view = view;
        //this.types();
        //this.arrays();
        //this.tuples();
        //this.vun();
		//
		this.insertCallbacks();
		this.getScores();
		this.view.showDificulty(this.model.getDificultyLabel());
    }

	// callbacks

	public insertCallbacks(): void{

		this.view.setCallbackColor((btnId: number) => {
			this.pressedColor(btnId);
		});

		this.view.setCallbackBtnStart(()=>{this.pressedStart()});
		this.view.setCallbackBtnDificulty(()=>{this.pressedDificulty()});
		this.view.setCallbackBtnSelectDificulty((iDif) => {
			this.pressedSelectDificulty(iDif);
		});
		this.view.setCallbackBtnSubmmitUsername((name: string) => {
			this.pressedSubmitUsername(name);
		});
	}

	public pressedColor(btnId: number): void{

		if (!this.model.started || this.model.animating)
			return;

		// check its correct

		if (btnId == this.model.sequence[this.model.colorIndex]){
			console.log("Correcto", btnId, ", length", this.model.sequence.length, ", index", this.model.colorIndex);


			if (this.model.colorIndex == (this.model.sequence.length -1)){
				// next level
				this.model.colorIndex = 0;
				//this.model.sequence.push(this.getRandomColor());
				this.model.scorePoint();
				this.model.sequence = this.getRandomSequence(this.model.level +1);
				console.log(this.model.sequence);

				this.view.showScore(this.model.score);
				this.runAnimation();
			}
			else{
				// continue
				this.model.colorIndex++;
				//this.view.showScore(this.model.score);
			}
		}
		else{
			console.log("Error", btnId);
			console.log("Score", this.model.score);
			//this.model.setLoseGame();
			this.view.playLose();

			if (this.model.score > 0){
				// username
				this.view.showModalUsername();
			}
			else{
				this.model.setLoseGame();
			}
		}
	}

	public pressedStart(): void{

		if (!this.model.started){
			this.model.setNewGame();
			//this.model.sequence = [this.getRandomColor()];
			this.model.sequence = this.getRandomSequence(1);

			this.view.showScore(this.model.score);
			this.runAnimation();

			console.log("Start");
			console.log(this.model.sequence);
		}
		
	}

	public pressedDificulty(): void{
		if (!this.model.started){
			this.view.showModalDificulty();
		}
	}

	public pressedSelectDificulty(iDif: number): void{
		this.model.dificulty = iDif;
		this.view.hideModalDificulty();
		this.view.showDificulty(this.model.getDificultyLabel());
	}

	public pressedSubmitUsername(name: string){
		this.saveScore(name, this.model.score);
		this.view.hideModalUsername();

		// reset state
		this.model.setLoseGame();
	}


	// logic
	
	private getRandomSequence(length: number): number[]{
		let seq : number[] = [];

		for (let i : number = 0; i < length; i++){
			seq.push(this.getRandomColor());
		}

		return seq;
	}

	private getRandomColor(): number{
		return Math.floor(Math.random() * 4);
	}

	private async runAnimation(){

		// wait before starting
		await sleep(500);
		this.model.animating = true;

		for (let i : number = 0; i < this.model.sequence.length; i++){
			let icolor : number = this.model.sequence[i];
			this.view.showColor(icolor);
			await sleep(this.model.getTime());
			this.view.hideColor(icolor);
			await sleep(100);
		}

		this.model.animating = false;
	}

	// storage

	private saveScore(name: string, score: number){

		// get
		let scores : iScoreStorage;
		let storedScores : string | null = localStorage.getItem("scores");

		if (storedScores){
			scores = <iScoreStorage>JSON.parse(storedScores);
			console.log(scores);
		}
		else{
			scores = { scores: [] };
		}

		// add
		scores.scores.push(<iScore>{
			name: name,
			score: score
		});

		// sort
		scores.scores.sort((a: iScore, b: iScore) => {
			return (b.score - a.score);
		});

		// cut to only 10 elements
		scores.scores = scores.scores.slice(0, 10);

		// save
		localStorage.setItem("scores", JSON.stringify(scores));

		// show
		this.getScores();
	}

	private async getScores(){

		let scores: iGetScore = {error: false, scores: []};

		try{
			const response = await fetch("http://localhost:1802/scores");
			//const response = await fetch("http://localhost:1802/scores", {
			//method: "GET",
			//mode: 'same-origin'
			//});
			scores = <iGetScore>(await response.json());
		}
		catch(e){
			console.log(e);
		}

		console.log(scores);
		this.view.showScoreTable(scores.scores);
	}


}
