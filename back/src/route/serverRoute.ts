import { Router } from "express";

import serverController from "../controller/serverController";

class ServerRoute {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    config(): void {
		// get scores
        this.router.get('/scores', serverController.getScores);

		// put new score
        this.router.post('/scores', serverController.newScore);
    }
}

const serverRoute = new ServerRoute();
export default serverRoute;
