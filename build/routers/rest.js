import { Router } from "hyper-express";
import { deposit, withdraw } from "../controllers/transaction.js";
// REST api specific router
export const apiRouter = new Router();
apiRouter.post("/deposit_to_mantle", deposit);
apiRouter.post("/withdraw_from_mantle", withdraw);
