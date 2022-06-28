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
    let { company_code: companyCode, employee_code: employeeCode, timestamp: timestamp } = req.query
    let checkinCode = makeid(6);
    console.log("Chegou no controller: ", companyCode, employeeCode, checkinCode, timestamp);
    clockin.record(employeeCode, checkinCode, timestamp);
  },
  edit: (req, res) => {
    let { company_code: companyCode, employee_code: employeeCode } = req.query
    clockin.edit(companyCode, employeeCode)
  },
  listAll: async (req, res) => {
    let { company_code: companyCode, employee_code: employeeCode } = req.query

    let resultCredentialChecking = await clockin.checkCredentials(companyCode, employeeCode);
    console.log("voltou pro controlador da checagem: ", resultCredentialChecking);

    if (resultCredentialChecking) {

      let resultListAll = await clockin.listAll(employeeCode);
      // console.log("voltou pro controlador da listagem de todos: ", resultListAll);

      let allFoundCheckind = [];

      resultListAll.forEach((item) => {
        let fieldsArray = item._fields
        fieldsArray.forEach((node) => {
          allFoundCheckind.push(node.properties)
        })
      })

      console.log(allFoundCheckind)

      res.send(allFoundCheckind)
      return allFoundCheckind
    }

    res.send("error: wrong credentials")
    return "error: wrong credentials"
  }
};

module.exports = mainController;