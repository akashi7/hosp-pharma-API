import { db } from "../config/database";
import { config } from "dotenv";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";


config();


export default class authController {

  //create hospital
  static CreateHospital(req, res) {

    const { code, h_name, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res.send({
        status: 205,
        message: "Passwords do not match"
      });
    }
    else {
      db.getConnection((err, connection) => {
        if (err) console.log("Error", err);
        else {
          connection.query("SELECT * FROM hospitals WHERE code=?", [code], async (err, result) => {
            if (err) console.log("Error", err);
            else if (result.length > 0) {
              res.send({
                status: 206,
                message: "Hospital arleady exist"
              });
            }
            else {
              let hashedPassword = await hash(password, 8);
              let is_hadmin = '1';
              connection.query("INSERT INTO hospitals SET?", {
                code,
                h_name,
                password: hashedPassword,
                is_hadmin
              }, (err, results) => {
                if (err) console.log("Error", err);
                else {
                  const token = sign({ code, h_name }, process.env.JWT_SECRET, { expiresIn: "5d" });
                  res.send({
                    status: 200,
                    token
                  });
                }
                connection.release();
              });
            }
          });
        }
      });
    }

  }

  //create pharmacy

  static CreatePharmacy(req, res) {
    const { code, ph_name, password, confirmPassword } = req.body;
    const { location } = req.query;

    if (password !== confirmPassword) {
      res.send({
        status: 205,
        message: "Passwords do not match"
      });
    }
    else {
      db.getConnection((err, connection) => {
        if (err) console.log("Error", err);
        else {
          connection.query("SELECT * FROM pharmacy WHERE code=?", [code], async (err, result) => {
            if (err) console.log("Error", err);
            else if (result.length > 0) {
              res.send({
                status: 206,
                message: "Pharmacy arleady exist"
              });
            }
            else {
              let hashedPassword = await hash(password, 8);
              let is_phadmin = '1';
              connection.query("INSERT INTO pharmacy SET?", {
                code,
                ph_name, location,
                password: hashedPassword,
                is_phadmin
              }, (err, results) => {
                if (err) console.log("Error", err);
                else {
                  const token = sign({ code, ph_name, location }, process.env.JWT_SECRET, { expiresIn: "5d" });
                  res.send({
                    status: 200,
                    token
                  });
                }
                connection.release();
              });
            }
          });
        }
      });
    }
  }

  //create patient

  static CreatePatients(req, res) {

    const { full_names, phone, id_number } = req.body;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM patients WHERE phone=?", [phone], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length > 0) {
            res.send({
              status: 205,
              message: "Patient arleady registered"
            });
          }
          else {
            connection.query("INSERT INTO patients SET?", {
              full_names,
              phone,
              id_number
            }, (err, results) => {
              if (err) console.log("Error", err);
              else {
                connection.query("SELECT * FROM patients WHERE phone=?", [phone], (err, answer) => {
                  if (err) console.log("Error", err);
                  else {
                    const { code } = answer[0];
                    res.send({
                      status: 200,
                      code
                    });
                  }
                  connection.release();
                });
              }
            });
          }
        });
      }
    });
  }


  //LOGINS

  static HospitalLogin(req, res) {

    const { code, password } = req.body;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM hospitals WHERE code=?", [code], async (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({
              status: 202,
              message: "Hospital do not exist"
            });
          }
          else {
            if (!(await compare(password, result[0].password))) {
              res.send({
                status: 203,
                message: "Wrong password"
              });
            }
            else {
              const { code, h_name, is_hadmin } = result[0];
              const token = sign({ code, h_name, is_hadmin }, process.env.JWT_SECRET, { expiresIn: "5d" });
              res.send({
                status: 200,
                token
              });
            }
            connection.release();
          }
        });
      }
    });
  }

  static PharmacyLogin(req, res) {

    const { code, password } = req.body;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM pharmacy WHERE code=?", [code], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({
              status: 202,
              message: "Pharmacy do not exist"
            });
          }
          else {
            if (!(await compare(password, result[0].password))) {
              res.send({
                status: 203,
                message: "Wrong password"
              });
            }
            else {
              const { code, ph_name, is_phadmin } = result[0];
              const token = sign({ code, ph_name, is_phadmin }, process.env.JWT_SECRET, { expiresIn: "5d" });
              res.send({
                status: 200,
                token
              });
            }
            connection.release();
          }
        });
      }
    });
  }

  static doctorsLogin(req, res) {

    const { phone, password } = req.body;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM doctors WHERE phone=?", [phone], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({
              status: 202,
              message: "Doctor do not exist"
            });
          }
          else {
            if (!(await compare(password, result[0].password))) {
              res.send({
                status: 203,
                message: "Wrong password"
              });
            }
            if (result[0].full_names === 'reception') {
              const { phone, code, h_name, full_names, is_doc } = result[0];
              const token = sign({ code, h_name, phone, full_names, is_doc }, process.env.JWT_SECRET, { expiresIn: "5d" });
              res.send({
                status: 201,
                token
              });
            }
            else {
              const { phone, code, h_name, full_names } = result[0];
              const token = sign({ code, h_name, phone, full_names }, process.env.JWT_SECRET, { expiresIn: "5d" });
              res.send({
                status: 200,
                token
              });
            }
            connection.release();
          }
        });
      }
    });
  }
}
