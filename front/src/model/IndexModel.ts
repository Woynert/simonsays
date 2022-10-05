export {IndexModel};

enum eDificulty{
	EASY,
	NORMAL,
	HARD
}

let dLabel : Map<number, string> = new Map<number, string>();
dLabel.set(eDificulty.EASY, "Facil");
dLabel.set(eDificulty.NORMAL, "Normal");
dLabel.set(eDificulty.HARD, "Dificil");

let dTime : Map<number, number> = new Map<number, number>();
dTime.set(eDificulty.EASY, 1000);
dTime.set(eDificulty.NORMAL, 500);
dTime.set(eDificulty.HARD, 200);

let dScoreFactor : Map<number, number> = new Map<number, number>();
dScoreFactor.set(eDificulty.EASY, 1);
dScoreFactor.set(eDificulty.NORMAL, 3);
dScoreFactor.set(eDificulty.HARD, 5);

//enum eTime{
	//EASY   = 1000,
	//NORMAL = 500,
	//HARD   = 300
//}

//enum eScoreFactor{
	//EASY   = 1,
	//NORMAL = 3,
	//HARD   = 5
//}

class IndexModel {

	// volatile
	public started: boolean;
	public animating: boolean;
	public colorIndex: number;

	public score: number;

	// conf
	public dificulty: number;
	public level: number;
	public sequence: number[];

    constructor() {
		this.started = false;
		this.animating = false;
		this.colorIndex = 0;
		this.score = 0;

		this.dificulty = eDificulty.NORMAL;
		this.level = 0;
		this.sequence = [];
		this.reset();
    }

	public scorePoint(){
		this.score += dScoreFactor.get(this.dificulty)!;
		this.level ++;
	}

	public setNewGame(){
		this.started = true;
		this.animating = false;
		this.colorIndex = 0;
		this.score = 0;

		this.level = 0;
		this.sequence = [];
	}

	public setLoseGame(){
		this.started = false;
		this.animating = false;
		this.colorIndex = 0;
		this.score = 0;

		this.level = 0;
		this.sequence = [];
	}

	public reset(){
		this.started = false;
		this.animating = false;
		this.colorIndex = 0;
		this.score = 0;

		this.dificulty = eDificulty.NORMAL;
		this.level = 0;
		this.sequence = [];
	}

	public getDificultyLabel() : string{
		return dLabel.get(this.dificulty)!;
	}

	public getTime() : number{
		return dTime.get(this.dificulty)!;
	}

	//public setSequence
}

