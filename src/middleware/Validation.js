import { appSchema } from "../models/appModel";


export default class Validation {

  static HospitalRegVal(req, res, next) {

    const { code, h_name, password } = req.body;
    const { error } = appSchema.HospitalSignUp.validate({ code, h_name, password });

    if (error) {
      res.send({
        status: 409,
        error: error.message
      });
    }
    else next();

  }

  static PharmacyRegVal(req, res, next) {

    const { code, ph_name, password } = req.body;
    const { location } = req.query;
    const { error } = appSchema.PharmacySignUp.validate({ code, ph_name, password, location });

    if (error) {
      res.send({
        status: 409,
        error: error.message
      });
    }
    else next();
  }

  static PatientRegVal(req, res, next) {

    const { full_names, phone, id_number } = req.body;
    const { error } = appSchema.PatientSignUp.validate({ full_names, phone, id_number });

    if (error) {
      res.send({
        status: 409,
        error: error.message
      });
    }
    else next();
  }

  static HospitalLoginVal(req, res, next) {

    const { code, password } = req.body;
    const { error } = appSchema.Hospitallogin.validate({ code, password });

    if (error) {
      res.send({
        status: 409,
        error: error.message
      });
    }
    else next();
  }

  static PharmacyLoginVal(req, res, next) {

    const { code, password } = req.body;
    const { error } = appSchema.pharmacyLogin.validate({ code, password });

    if (error) {
      res.send({
        status: 409,
        error: error.message
      });
    }
    else next();
  }

  static DoctorsLoginVal(req, res, next) {

    const { phone, password } = req.body;
    const { error } = appSchema.doctorsLogin.validate({ phone, password });

    if (error) {
      res.send({
        status: 409,
        error: error.message
      });
    }
    else next();
  }

  static DoctorsReg(req, res, next) {

    const { full_names, phone, password, role } = req.body;
    const { error } = appSchema.doctorReg.validate({ full_names, phone, password, role });

    if (error) {
      res.send({
        status: 409,
        error: error.message
      });
    }
    else next();
  }

}