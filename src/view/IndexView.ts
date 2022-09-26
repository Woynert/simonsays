import { iScore, iScoreStorage } from "../controller/IndexController.js";

//interface iScore{
	//name: string;
	//score: number;
//}

//interface iScoreStorage{
	//scores: iScore[];
//}

export class IndexView {

    private scoreBoard: HTMLElement;
	private btnColor: Element[];

    constructor() {        
		this.btnColor = [];
		this.scoreBoard = this.getElement('#scoreboard')!; 
    }

    private getElement = (selector: string): HTMLElement | null => {
		return document.querySelector(selector)
	};

	public addToScoreBoard(username: string, score: number){
		this.scoreBoard.innerHTML += `
		<tr>
			<td>${username}</td>
			<td>${score}</td>
		</tr>
		`;
	}

	// callbacks

	public setCallbackColor (callback:(a: number)=>void ) : void{

		this.btnColor = Array.from(document.getElementsByClassName("game__button"));

		this.btnColor.forEach((e : Element, i)=>{
			e.addEventListener("click", ()=>{callback(i)}, false);
		});

	}

	public setCallbackBtnStart (callback:() => void ) : void{
		let btn : Element | null = document.getElementById("btnStart");
		btn?.addEventListener("click", ()=>{callback()}, false);
	}

	public setCallbackBtnDificulty (callback:() => void ) : void{
		let btn : Element | null = document.getElementById("btnDificulty");
		btn?.addEventListener("click", ()=>{callback()}, false);
	}

	public setCallbackBtnSelectDificulty (callback:(iDif: number) => void ) : void{

		let btns : Element[] =
			Array.from(document.getElementsByClassName("btnDifficulty"));

		btns.forEach((e : Element, i)=>{
			e.addEventListener("click", ()=>{callback(i)}, false);
		});
	}

	public setCallbackBtnSubmmitUsername (callback:(name: string) => void ) : void{
		let btn : Element | null = document.getElementById("btnUsername");
		btn?.addEventListener("click", ()=>{
			let name : string;
			name = (<HTMLInputElement> document.getElementById("tbxUsername")!).value;
			callback(name);
		}, false);

		//callback(name);
	}

	// visual effects
	
	public showColor(icolor: number){
		(<HTMLElement>this.btnColor[icolor]).style.background = "pink";
	}
	public hideColor(icolor: number){
		(<HTMLElement>this.btnColor[icolor]).style.background = "black";
	}

	public showScore(score: number){
		let lbl : Element | null;
 		lbl = document.getElementById("scoreLabel");
		lbl!.innerHTML = score.toString();
		lbl = document.getElementById("modalScoreLabel");
		lbl!.innerHTML = score.toString();
	}

	public showDificulty(dif: string){
		let lbl : Element | null = document.getElementById("dificultyLabel");
		lbl!.innerHTML = dif;
	}

	public showModalDificulty(){
		let mod : HTMLElement | null = document.getElementById("modalDificulty");
		mod!.style.visibility = "visible";
	}

	public hideModalDificulty(){
		let mod : HTMLElement | null = document.getElementById("modalDificulty");
		mod!.style.visibility = "hidden";
	}

	public showModalUsername(){
		let mod : HTMLElement | null = document.getElementById("modalUsername");
		mod!.style.visibility = "visible";
	}

	public hideModalUsername(){
		let mod : HTMLElement | null = document.getElementById("modalUsername");
		mod!.style.visibility = "hidden";
	}

	public showScoreTable(scores : iScore[]){

		// sort
		scores.sort((a: iScore, b: iScore) => {
			return (b.score - a.score);
		});

		// clear container
		let con : HTMLElement = document.getElementById("scoreboardTable")!;
		con.innerHTML = "";

		// populate
		scores.forEach((i : iScore) => {
			let tr : HTMLElement = document.createElement('tr');

			tr.innerHTML = `
				<tr>
					<td>${i.name}</td>
					<td>${i.score}</td>
				</tr>
			`;

			con.appendChild(tr);
			console.log(i);
		});

	}

    //public set display(display: HTMLElement) {
        //this._display = display;
    //}

    //public get display() {
        //return this._display;
    //}

    //public addToDisplay(content: string): void {
        //this._display.innerHTML += `<p>${content}</p>`
    //}
}
