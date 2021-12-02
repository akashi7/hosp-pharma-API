import { db } from "../config/database";
import { hash, compare } from "bcryptjs";


export default class doctorController {

  static searchPatient(req, res) {
    const { code } = req.body;
    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM patients WHERE code=?", [code], (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { patient: result }
            });
          }
          connection.release();
        });
      }
    });
  }

  static viewPreviousRecord(req, res) {
    const { code, id_number } = req.body;
    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM patients WHERE code=? AND id_number=?", [code, id_number], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({
              status: 205,
              message: "Incorrect ID"
            });
          }
          else {
            connection.query("SELECT * FROM information WHERE u_code=?", [code], (err, results) => {
              if (err) console.log("Error", err);
              else {
                res.send({
                  status: 200,
                  data: { userInfo: results }
                });
              }
              connection.release();
            });
          }
        });
      }
    });
  }

  static allMedecines(req, res) {
    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM medecines", (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { allMeds: result }
            });
          }
          connection.release();
        });
      }
    });
  }

  static sendReport(req, res) {
    const { disease, meds } = req.body;
    const [...medecines] = meds;

  }

  static EditPassword(req, res) {
    const { password, confirmPassword, oldPassword } = req.body;
    const { phone } = req.doctor;

    if (password !== confirmPassword) {
      res.send({
        status: 301,
        message: "Password's do not match"
      });
    }
    else {
      db.getConnection((err, connection) => {
        if (err) console.log("Error", err);
        else {
          connection.query("SELECT * FROM doctors WHERE phone=?", [phone], async (err, result) => {
            if (err) console.log("Error", err);
            else {
              if (!(await compare(oldPassword, result[0].password))) {
                res.send({
                  status: 302,
                  message: "Wrong old password try again !"
                });
              }
              else {
                let hashedPassword = await hash(password, 8);
                connection.query("UPDATE doctors SET password=? WHERE phone=?", [hashedPassword, phone], (err, results) => {
                  if (err) console.log("Error", err);
                  else {
                    res.send({
                      status: 200
                    });
                  }
                  connection.release();
                });
              }
            }
          });
        }
      });
    }
  }

}

