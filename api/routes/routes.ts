import { Router } from "https://deno.land/x/oak/mod.ts";
import { login,signup } from '../controllers/user.controller.ts';
import {getColumnsByUser, insertColumn, getColumn} from '../controllers/card.controller.ts';

const router = new Router();

router.post("/user/login",login);
router.get("/user/columns",getColumnsByUser);
router.post("/user/columns",insertColumn);
router.get('/user/columns/:columnid',getColumn);
router.post("/user/signup",signup);
export default router;