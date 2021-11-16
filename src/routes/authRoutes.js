import { Router } from "express";
import authController from "../controllers/auth";

const authRouter = Router();

authRouter.post("/registerHospital", authController.CreateHospital);
authRouter.post("/registerPharmacy", authController.CreatePharmacy);

// create patient






export default authRouter;