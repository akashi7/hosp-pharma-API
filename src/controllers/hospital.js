import { db } from "../config/database";
import { hash, compare } from "bcryptjs";



class hospitalController {

  static createDoctors(req, res) {
    const { code, h_name } = req.hosp;
    const { full_names, phone, password, confirmPassword } = req.body;

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
          connection.query("SELECT * FROM doctors WHERE phone=? AND code=?", [phone, code], async (err, result) => {
            if (err) console.log("Error", err);
            else if (result.length > 0) {
              res.send({
                status: 206,
                message: "Doctor arleady registered"
              });
            }
            else {
              let hashedPassword = await hash(password, 8);
              connection.query("INSERT INTO doctors SET?", {
                code,
                h_name,
                full_names,
                password: hashedPassword,
                phone
              }, (err, results) => {
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
      });
    }
  }

  static viewAllDoctors(req, res) {
    const { code } = req.hosp;
    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM doctors WHERE code=?", [code], (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { docs: result }
            });
          }
          connection.release();
        });
      }
    });
  }

  static createReceiptionist(req, res) {
    const { code, h_name } = req.hosp;
    const { full_names, phone, password, confirmPassword } = req.body;

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
          connection.query("SELECT * FROM doctors WHERE phone=?", [phone], async (err, result) => {
            if (err) console.log("Error", err);
            else if (result.length > 0) {
              res.send({
                status: 206,
                message: "Doctor arleady registered"
              });
            }
            else {
              let hashedPassword = await hash(password, 8);
              connection.query("INSERT INTO doctors SET?", {
                code,
                h_name,
                full_names,
                password: hashedPassword,
                phone
              }, (err, results) => {
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
      });
    }

  }


}



export default hospitalController;