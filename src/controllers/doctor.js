import { db } from "../config/database";
import { hash, compare } from "bcryptjs";
import moment from "moment";
import { nexmo } from "../config/nexmo";
import { v4 as uuidV4 } from 'uuid';


export default class doctorController {

  static searchPatient(req, res) {

    const { code } = req.query;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM patients WHERE id=?", [code], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({
              status: 300,
              message: "Patient not found"
            });
          }
          else {
            const { id } = result[0];
            res.send({
              status: 200,
              data: { patient: result },
              code: id
            });
          }
          connection.release();
        });
      }
    });
  }

  static viewPreviousRecord(req, res) {
    const { code, id_number } = req.query;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM patients WHERE id=? AND id_number=?", [code, id_number], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({
              status: 205,
              message: "Incorrect ID"
            });
          }
          else {
            const { phone } = result[0];
            connection.query("SELECT * FROM information WHERE patient_phone=? ORDER BY id DESC", [phone], (err, results) => {
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

    let address, pharmacy, locations;

    const time = new Date();
    const dateTime = time.toLocaleDateString();
    const newDate = moment(dateTime).format("DD/MM/YYYY");

    const Medecines = medecines.toString();
    const length = medecines.length;

    const Tel = `25${patient_phone}`;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query(`SELECT ph_name,location FROM medecines WHERE med_name IN (?) AND quantity >1 GROUP BY code HAVING COUNT(DISTINCT med_name)=${length} ORDER BY quantity DESC LIMIT 3 `, [medecines], (err, result) => {
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
                const [...phName] = result.map(item => item.ph_name);
                const [...Location] = result.map(item => item.location);

                const ph_name = phName.toString();
                const pH = ph_name.replace(',', " or ");
                const location = Location.toString();
                const from = `${h_name} Hospital`;
                const to = Tel;

                phName.length === 1 ? address = "address" : address = "addresses";
                phName.length === 1 ? pharmacy = "pharmacy" : pharmacy = "pharmacies";

                Location.length === 1 ? locations = "" : locations = "rescpectively";

                const text = `Dear ${patient_name} go to ${pH} ${pharmacy} with ${address} of ${location} ${locations} to retrieve your medecines , regards`;

                nexmo.message.sendSms(from, to, text, (err, results) => {
                  if (err) {
                    res.send({
                      status: 307,
                      message: "Sending message failed"
                    });
                  }
                  else {
                    res.send({
                      status: 200
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

  static docForgotPassword(req, res) {

    const { phone } = req.body;

    const Tel = `25${phone}`;

    const code = uuidV4();

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM doctors WHERE phone=?", [phone], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length === 0) {
            res.send({ status: 300, message: "Doctor do not exist" });
          }
          else {
            const from = 'SYSTEM RECOVERY';
            const to = Tel;
            const text = `Your code is ${code}`;

            nexmo.message.sendSms(from, to, text, (err, results) => {
              if (err) {
                res.send({
                  status: 307,
                  message: "Sending message failed"
                });
              }
              else {
                res.send({
                  status: 200,
                  phone,
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

  static resetPassword(req, res) {

    const { password } = req.body;
    const { confirmPassword, phone } = req.query;
    if (password !== confirmPassword) {
      res.send({
        status: 205,
        message: "Passwords do not match"
      });
    }
    else {
      db.getConnection(async (err, connection) => {
        if (err) console.log("Error", err);
        else {
          let hashedPassword = await hash(password, 8);
          connection.query("UPDATE doctors SET password=? WHERE phone=?", [hashedPassword, phone], (err, result) => {
            if (err) console.log("Error", err);
            else {
              res.send({
                status: 200
              });
            }
            connection.release();
          });
        }
      });
    }
  }
}

