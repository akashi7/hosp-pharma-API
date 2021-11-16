import { db } from "../config/database";


class pharmacyController {

  static InsertMedecine(req, res) {
    const { code, ph_name, longitude, latitude } = req.pharma;
    const { med_name } = req.body;


    db.getConnection((err, connection) => {
      if (err) console.log("err", err);
      else {
        connection.query("SELECT * FROM medecines WHERE med_name LIKE N? AND code=?", [`${med_name}`, code], (err, result) => {
          if (err) console.log("err", err);
          else if (result.length > 0) {
            res.send({
              status: 204,
              message: "Medecine arleady registered"
            });
          }
          else {
            connection.query("INSERT INTO medecines SET?", {
              code,
              ph_name,
              longitude,
              latitude,
              med_name
            }, (err, results) => {
              if (err) console.log("err", err);
              else {
                res.send({
                  status: 200,
                  message: "Medecine  registered"
                });
              }
              connection.release();
            });
          }
        });
      }
    });
  }

  static ViewRequest(req, res) {
    const { code, id_number } = req.body;
    const ph_code = req.pharma.code;

    db.getConnection((err, connection) => {
      if (err) console.log("err", err);
      else {
        connection.query("SELECT * FROM information WHERE code=? AND id_number=?", [code, id_number], (err, result) => {
          if (err) console.log("err", err);
          else if (result.length === 0) {
            res.send({
              status: 204,
              message: "Wrong information provided"
            });
          }
          else {
            res.send({
              status: 200,
            });
          }
          connection.release();
        });
      }
    });
  }

  static viewAllMedecines(req, res) {
    const { code } = req.pharma;
    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM medecines WHERE code=?", [code], (err, result) => {
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

}


export default pharmacyController;