import Joi from "joi";

let string = Joi.string().required();

export const appSchema = {

  HospitalSignUp: Joi.object({
    code: string.regex(/^[0-9]+$/).max(100).error(new Error("Code is required and must be numbers")),
    h_name: string.regex(/^[A-Za-z]/).max(100).error(new Error("Hospital name is required and must be letters")),
    password: string.min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).error(new Error('Password must be 6 characters long with a capital letter and a number'))
  }),

  PharmacySignUp: Joi.object({
    code: string.regex(/^[0-9]+$/).max(100).error(new Error("Code is required and must be numbers")),
    ph_name: string.regex(/^[A-Za-z]/).max(100).error(new Error("Pharmacy name is required and must be letters")),
    password: string.min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).error(new Error('Password must be 6 characters long with a capital letter and a number')),
    location: string.error(new Error("Location is required"))
  }),

  PatientSignUp: Joi.object({
    full_names: string.regex(/^[A-Za-z]/).max(100).min(4).error(new Error('Full names are required and must be letters and not less than 4')),
    phone: string.regex(/^[0-9]+$/).max(10).min(10).error(new Error("Telephone must be 10 numbers and required")),
    id_number: string.regex(/^[0-9]+$/).max(16).min(16).error(new Error("ID must be 16 numbers and required")),
    age: string.regex(/^[0-9]+$/).max(50).error(new Error("Age is required and must be a number")),
    district: string.regex(/^[A-Za-z]/).max(50).error(new Error('District is required and must be letters only')),
    sector: string.regex(/^[A-Za-z]/).max(50).error(new Error('District is required and must be letters only'))
  }),

  Hospitallogin: Joi.object({
    code: string.regex(/^[0-9]+$/).max(100).error(new Error("Code is required and must be numbers")),
    password: string.min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).error(new Error('Password must be 6 characters long with a capital letter and a number'))
  }),

  pharmacyLogin: Joi.object({
    code: string.regex(/^[0-9]+$/).max(100).error(new Error("Code is required and must be numbers")),
    password: string.min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).error(new Error('Password must be 6 characters long with a capital letter and a number'))
  }),

  doctorsLogin: Joi.object({
    phone: string.regex(/^[0-9]+$/).max(10).min(10).error(new Error("Telephone must be 10 numbers and required")),
    password: string.min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).error(new Error('Password must be 6 characters long with a capital letter and a number'))
  }),

  InsertMedecine: Joi.object({
    med_name: string.regex(/^[A-Za-z]/).max(100).error(new Error('Medecine name are required and must be letters')),
    quantity: string.regex(/^[0-9]+$/).max(100).error(new Error("quantity is required and must be numbers"))
  }),

  Quantity: Joi.object({
    quantity: string.regex(/^[0-9]+$/).max(100).error(new Error("quantity is required and must be numbers"))
  }),

  doctorReg: Joi.object({
    full_names: string.regex(/^[A-Za-z]/).max(100).min(4).error(new Error('Full names are required and must be letters')),
    phone: string.regex(/^[0-9]+$/).max(10).min(10).error(new Error("Telephone must be 10 numbers and required")),
    password: string.min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).error(new Error('Password must be 6 characters long with a capital letter and a number')),
    role: string.error(new Error('Role is required'))
  }),

  updatePassword: Joi.object({
    password: string.min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).error(new Error('Password must be 6 characters long with a capital letter and a number'))
  }),

  searchPatient: Joi.object({
    code: string.regex(/^[0-9]+$/).max(100).error(new Error("Code must be number and required")),
    id_number: string.regex(/^[0-9]+$/).max(16).min(16).error(new Error("ID must be 16 numbers and required")),
  })


};