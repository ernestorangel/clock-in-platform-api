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
  clockin: async (req, res) => {
    let { company_code: companyCode, employee_code: employeeCode, timestamp: timestamp } = req.query

    let resultCredentialChecking = await clockin.checkCredentials(companyCode, employeeCode);
    console.log("voltou pro controlador da checagem: ", resultCredentialChecking);

    if (resultCredentialChecking) {
    
      let checkinCode = makeid(6);
      console.log("Chegou no controller: ", companyCode, employeeCode, checkinCode, timestamp);
      clockin.record(employeeCode, checkinCode, timestamp);

      res.send(200)
    
    } else {

      res.send(401)

    }
  },
  edit: async (req, res) => {
    let { company_code: companyCode, employee_code: employeeCode } = req.query
  },
  listAll: async (req, res) => {
    let { company_code: companyCode, employee_code: employeeCode } = req.query

    let resultCredentialChecking = await clockin.checkCredentials(companyCode, employeeCode);
    console.log("voltou pro controlador da checagem no listAll: ", resultCredentialChecking);

    if (resultCredentialChecking) {

      let resultListAll = await clockin.listAll(employeeCode);

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
    res.send(401)
  },
  delete: async (req, res) => {
    let { checkin_code: checkinCode } = req.query
    await clockin.delete(checkinCode);
    if (await clockin.isCheckinRegistered(checkinCode)) {
      res.send(500)
    }
    res.send(200)
  }
};

module.exports = mainController;