import { db } from "../config/database";
import { hash, compare } from "bcryptjs";
import moment from "moment";


export default class doctorController {

  static searchPatient(req, res) {

    const { phone } = req.query;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM patients WHERE phone=?", [phone], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({
              status: 300,
              message: "Patient not found"
            });
          }
          else {
            res.send({
              status: 200,
              data: { patient: result },
              phone
            });
          }
          connection.release();
        });
      }
    });
  }

  static viewPreviousRecord(req, res) {

    const { phone, id_number } = req.body;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM patients WHERE phone=? AND id_number=?", [phone, id_number], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({
              status: 205,
              message: "Incorrect ID"
            });
          }
          else {
            connection.query("SELECT * FROM information WHERE patient_phone=?", [phone], (err, results) => {
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
        connection.query("SELECT id,med_name FROM medecines", (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: result
            });
          }
          connection.release();
        });
      }
    });
  }

  static sendReport(req, res) {
    const { disease, medecines } = req.body;
    const { patient_name, patient_phone } = req.query;
    const { h_name, full_names } = req.doc;

    const time = new Date();
    const dateTime = time.toLocaleDateString();
    const newDate = moment(dateTime).format("DD/MM/YYYY");

    const Medecines = medecines.toString();
    const length = medecines.length;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query(`SELECT ph_name FROM medecines WHERE med_name IN (?) AND quantity >1 GROUP BY code HAVING COUNT(DISTINCT med_name)=${length} ORDER BY quantity DESC LIMIT 5 `, [medecines], (err, result) => {
          if (err) console.log("Error", err);
          else {
            connection.query("INSERT INTO information SET?", {
              patient_name,
              date: newDate,
              hospital_name: h_name,
              doctor_name: full_names,
              disease,
              medecines: Medecines,
              patient_phone
            }, (err, results) => {
              if (err) console.log("Error", err);
              else {
                console.log("result", result);
                res.send({
                  status: 200,
                });
              }
              connection.release();
            });
          }
        });
      }
    });



  }

  static EditPassword(req, res) {
    const { password, confirmPassword, oldPassword } = req.body;
    const { phone } = req.doc;

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

