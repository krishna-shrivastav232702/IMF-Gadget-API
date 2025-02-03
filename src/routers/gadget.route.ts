import { Router } from "express";
import express from "express"
import { getAllGadgets,addGadget,updateGadget,removeGadget,selfDestructGadget,getGadgetStatus } from "../controllers/gadget.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router:Router= express.Router();

router.use(protect);

router.get('/allGadgets',getAllGadgets);
router.post('/',addGadget);
router.patch('/update/:id',updateGadget);
router.patch('/remove/:id',removeGadget);
router.post('/:id/self-destruct',selfDestructGadget);
router.get('/',getGadgetStatus);

export default router;