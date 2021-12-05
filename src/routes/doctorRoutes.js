import { Router } from "express";
import doctorController from "../controllers/doctor";
import IsloggedIn from "../middleware/RequiredLogin";
import Validation from "../middleware/Validation";

const docRouter = Router();


docRouter.get('/allMeds', IsloggedIn.isDoctor, doctorController.allMedecines);
docRouter.patch('/updatePass', IsloggedIn.isDoctor, Validation.UpdatePasswordVal, doctorController.EditPassword);
docRouter.get('/viewPrevRecord', IsloggedIn.isDoctor, doctorController.viewPreviousRecord);
docRouter.get("/SearchPat", IsloggedIn.isDoctor, doctorController.searchPatient);
docRouter.post("/sendMeds", IsloggedIn.isDoctor, doctorController.sendReport);





export default docRouter;