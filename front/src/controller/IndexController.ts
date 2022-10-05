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
				this.model.scorePoint();
				this.model.sequence = this.getRandomSequence(this.model.level +1);
				console.log(this.model.sequence);

				this.view.showScore(this.model.score);
				this.runAnimation();
			}
			else{
				// continue
				this.model.colorIndex++;
			}
		}
		else{
			console.log("Error", btnId);
			console.log("Score", this.model.score);
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

	private async saveScore(name: string, score: number){

		try{
			let body: iScore = {name: name, score: score};
			
			const response = await fetch("http://127.0.0.1:1802/scores", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			}).then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);

				// show
				this.getScores();
			})
			.catch((error) => {
				console.error('Error:', error);
			});;
		}
		catch(e){
			console.log(e);
		}
	}

	private async getScores(){

		let scores: iGetScore = {error: false, scores: []};

		try{
			const response = await fetch("http://127.0.0.1:1802/scores");
			scores = <iGetScore>(await response.json());
		}
		catch(e){
			console.log(e);
		}

		console.log(scores);
		this.view.showScoreTable(scores.scores);
	}

}
