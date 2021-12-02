import { Router } from "express";
import authController from "../controllers/auth";
import Validation from "../middleware/Validation";

const authRouter = Router();

//Hospital registration

authRouter.post("/registerHospital", Validation.HospitalRegVal, authController.CreateHospital);

//Pharmacy registration

authRouter.post("/registerPharmacy", Validation.PharmacyRegVal, authController.CreatePharmacy);

// create patient

authRouter.post("/registerPatient", Validation.PatientRegVal, authController.CreatePatients);

//Hospital login

authRouter.post("/hospitalLogin", Validation.HospitalLoginVal, authController.HospitalLogin);

//Pharmacy login

authRouter.post('/pharmacyLogin', Validation.PharmacyLoginVal, authController.PharmacyLogin);

//Doctor/receptionist login

authRouter.post('/docLogin', Validation.DoctorsLoginVal, authController.doctorsLogin);






export default authRouter;