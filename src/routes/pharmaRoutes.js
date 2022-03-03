import { Router } from "express";
import Validation from "../middleware/Validation";
import IsloggedIn from "../middleware/RequiredLogin";
import pharmacyController from "../controllers/pharma";

const pharmaRouter = Router();


pharmaRouter.post('/insertMeds', IsloggedIn.isPharmacyAdmin, Validation.InsertMedVal, pharmacyController.InsertMedecine);
pharmaRouter.get('/allMeds', IsloggedIn.isPharmacyAdmin, pharmacyController.viewAllMedecines);
pharmaRouter.post('/viewPatientMedAuth', IsloggedIn.isPharmacyAdmin, Validation.searchPatient, pharmacyController.ViewRequest);
pharmaRouter.get('/viewTodayMeds', IsloggedIn.isPharmacyAdmin, pharmacyController.viewTodayMedecines);
pharmaRouter.patch('/approveMeds', IsloggedIn.isPharmacyAdmin, pharmacyController.ApproveMedecines);
pharmaRouter.patch('/filterDate', IsloggedIn.isPharmacyAdmin, pharmacyController.filterDate);
pharmaRouter.patch('/addMedQuantity', IsloggedIn.isPharmacyAdmin, Validation.QuantityVal, pharmacyController.addQuantity);
pharmaRouter.patch('/removeMedQuantity', IsloggedIn.isPharmacyAdmin, Validation.QuantityVal, pharmacyController.removeQuantity);
pharmaRouter.post('/insertInsurance', IsloggedIn.isPharmacyAdmin, pharmacyController.registerInsurance);
pharmaRouter.get("/allInsurance", IsloggedIn.isPharmacyAdmin, pharmacyController.seeAllInsurance);


export default pharmaRouter;