const clockin = require('../models/clockin');

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
 return result;
}

const mainController = {
  clockin: (req, res) => {
    console.log(req.query.company_code)
    let { company_code: companyCode, employee_code: employeeCode } = req.query
    let checkinCode = makeid(6);
    console.log("Chegou no controller: ", companyCode, employeeCode, checkinCode);
    clockin.record(companyCode, employeeCode, checkinCode);
    res.send("Passou a cobra")
  },
  listOverdue: (req, res) => {

  },
  listAll: (req, res) => {

  }
};

module.exports = mainController;