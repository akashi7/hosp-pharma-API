import { db } from "../config/database";
import moment from "moment";


export default class pharmacyController {

  static InsertMedecine(req, res) {
    const { code, ph_name, location, sector } = req.pharma;
    const { med_name, quantity } = req.body;


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
              med_name,
              quantity,
              location,
              sector
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

    db.getConnection((err, connection) => {
      if (err) console.log("err", err);
      else {
        connection.query("SELECT * FROM patients WHERE id=? AND id_number=?", [code, id_number], (err, result) => {
          if (err) console.log("err", err);
          else if (result.length === 0) {
            res.send({
              status: 204,
              message: "Wrong information provided"
            });
          }
          else {
            const { phone } = result[0];
            res.send({
              status: 200,
              phone
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

  static addQuantity(req, res) {
    const { id, quantity } = req.query;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM medecines WHERE id=?", [id], (err, result) => {
          if (err) console.log("Error", err);
          else {
            let Quantity = result[0].quantity;
            let newQuantity = parseInt(quantity) + parseInt(Quantity);

            connection.query("UPDATE medecines SET quantity=? WHERE id=?", [newQuantity, id], (err, results) => {
              if (err) console.log("Error", err);
              else {
                res.send({
                  status: 200,
                  message: "quantity added successfully"
                });
              }
              connection.release();
            });
          }
        });
      }
    });
  }

  static removeQuantity(req, res) {
    const { id, quantity } = req.query;

    let diff;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM medecines WHERE id=?", [id], (err, result) => {
          if (err) console.log("Error", err);
          else {
            let Quantity = result[0].quantity;

            (parseInt(Quantity) - parseInt(quantity) < 0) ? diff = 0 : diff = 1;

            if (diff === 0) {
              res.send({
                status: 301,
                message: "Not enough quantity in stock"
              });
            }
            else {
              let newQuantity = parseInt(Quantity) - parseInt(quantity);
              connection.query("UPDATE medecines SET quantity=? WHERE id=?", [newQuantity, id], (err, results) => {
                if (err) console.log("Error", err);
                else {
                  res.send({
                    status: 200,
                    message: "quantity removed successfully"
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

  static viewTodayMedecines(req, res) {
    const today = new Date();
    const date = today.toLocaleDateString();

    const Dates = moment(date).format("DD/MM/YYYY");

    const { phone } = req.query;


    db.getConnection((err, connection) => {
      if (err) console.log("err", err);
      else {
        connection.query("SELECT * FROM information WHERE date=? AND patient_phone=?", [Dates, phone], (err, result) => {
          if (err) console.log("err", err);
          else {
            res.send({
              status: 200,
              data: { medecines: result }
            });
          }
          connection.release();
        });
      }
    });


  }

  static ApproveMedecines(req, res) {
    const { id } = req.query;
    const { ph_name } = req.pharma;

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        let status = 'taken';
        connection.query("UPDATE information SET status=? , pharmacy_name=? WHERE id=?", [status, ph_name, id], (err, result) => {
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

  static filterDate(req, res) {
    const { phone, date } = req.query;

    let dateTime = moment(date).format("DD/MM/YYYY");

    db.getConnection((err, connection) => {
      if (err) console.log("Error", err);
      else {
        connection.query("SELECT * FROM information WHERE date=? AND patient_phone=?", [dateTime, phone], (err, result) => {
          if (err) console.log("Error", err);
          if (result.length === 0) {
            res.send({
              status: 203,
            });
          }
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

  static registerInsurance(req, res) {
    const { code } = req.pharma;
    const { insurance } = req.body;

    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM insurances WHERE code=? AND insurance=?", [code, insurance], (err, result) => {
          if (err) console.log("Error", err);
          else if (result.length > 1) {
            res.send({
              status: 205,
              message: "Insurance arleady registered"
            });
          }
          else {
            connection.query("INSERT INTO insurances SET?", {
              code,
              insurance
            }, (err, results) => {
              if (err) console.log("Error", err);
              else {
                res.send({
                  status: 200,
                  message: "Insurance inserted succesfully"
                });
              }
              connection.release();
            });
          }
        });
      }
    });

  }

  static seeAllInsurance(req, res) {
    const { code } = req.pharma;
    db.getConnection((err, connection) => {
      if (err) console.log("ConnectionError", err);
      else {
        connection.query("SELECT * FROM insurances WHERE code=?", [code], (err, result) => {
          if (err) console.log("Error", err);
          else {
            res.send({
              status: 200,
              data: { insurance: result }
            });
          }
          connection.release();
        });
      }
    });
  }



}