import { Router } from "express";
import hospitalController from "../controllers/hospital";
import Validation from "../middleware/Validation";
import IsloggedIn from "../middleware/RequiredLogin";

const hospRouter = Router();


hospRouter.post("/registerDoc", IsloggedIn.isHospAdmin, Validation.DoctorsReg, hospitalController.createDoctors);
hospRouter.post('/registerRecept', hospitalController.createReceiptionist);
hospRouter.get('/allDoctors', IsloggedIn.isHospAdmin, hospitalController.viewAllDoctors);





export default hospRouter;