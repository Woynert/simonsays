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

	private getScores(){
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

		this.view.showScoreTable(scores.scores);
	}

    //public types(): void {
        //this.view.addToDisplay(`<h3>Types BY NERT EL JOY</h3>`);

        //let _num: number = 123;
        //this.view.addToDisplay(`Number int = ${_num.toString() + " "}`);

        //_num = 123.456;
        //this.view.addToDisplay(`Number float = ${_num.toString() + " "}`);

        //let _boo: boolean = true;
        //this.view.addToDisplay(`Boolean = ${_boo.toString()}`);

        //let _str: string = "text";
        //this.view.addToDisplay(`String = ${_str.toString()}`);

        //let _any: any = "any";
        //this.view.addToDisplay(`Any = ${_any.toString()}`);
        //_any = false;
        //this.view.addToDisplay(`Any = ${_any.toString()}`);

        //const PI: number = 3.1416;
        //this.view.addToDisplay(`Constant: PI = ${_any.toString()}`);

        //_str = 123 + " stirng";
        //this.view.addToDisplay(`toConcatenate = ${_str}`);
    //}

    //public arrays(): void {
        //this.view.addToDisplay(`<h3>Arrays</h3>`);

        //let out: string;

        //let _numArray: number[] = [0, 1, 2];
        //out = 'Number array = [';
        //_numArray.forEach(i => { out += ` ${i} ` });
        //this.view.addToDisplay(out + ']');

        //let _booArray: boolean[] = [true, false];
        //out = 'Boolean array = [';
        //_booArray.forEach(i => { out += ` ${i} ` });
        //this.view.addToDisplay(out + ']');

        //let _strArray: string[] = ["text0", "text1", "test2"];
        //out = 'String array = [';
        //_strArray.forEach(i => { out += ` ${i} ` });
        //this.view.addToDisplay(out + ']');

        //let _arrayAny: any[] = [0, true, "text0", [1, 2, 3], { attr1: "value 1", attr2: "value 2" }];
        //out = 'Any array = [';
        //_arrayAny.forEach(index => {
            //if (typeof (index) === "number") {
                //out += ` ${index} `
            //}
            //if (typeof (index) === "string") {
                //out += ` ${index} `
            //}
            //if (Array.isArray(index)) {
                //out += ` [${index}] `
            //}
        //});
        //out += `{${Object.keys(_arrayAny[4]).map(key => `${key}: ${_arrayAny[4][key]}`)}}`;
        //this.view.addToDisplay(out + ']');
    //}

    //public tuples(): void {
        //this.view.addToDisplay(`<h3>Tuples</h3>`);
        //let _tuple: [string, number] = ["text", 1];
        //this.view.addToDisplay(`Tuple = ${_tuple.toString()}`);
    //}

    //public vun(): void {
        //this.view.addToDisplay(`<h3>Void, Undefined, Null</h3>`);
        //let _void: void = undefined;
        //this.view.addToDisplay(`Void = ${typeof (_void)}`);
        //let _null: null = null;
        //this.view.addToDisplay(`Null = ${typeof (_null)}`);
        //let _undefined: undefined = undefined;
        //this.view.addToDisplay(`Undefined = ${typeof (_undefined)}`);
    //}

}
