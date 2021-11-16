import { db } from "../config/database";


class doctorController {

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







}

export default doctorController;