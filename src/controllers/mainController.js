const clockin = require('../models/clockin');

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
 return result;
}

const mainController = {
  clockin: async (req, res) => {
    let { company_code: companyCode, employee_code: employeeCode, timestamp: timestamp } = req.query
    let resultCredentialChecking = await clockin.checkCredentials(companyCode, employeeCode);
    if (resultCredentialChecking) {
      let checkinCode = makeid(6);
      clockin.record(employeeCode, checkinCode, timestamp);
      res.send(200)  
    } else {
      res.send(401)
    }
  },
  edit: async (req, res) => {
    let { checkin_code: checkinCode , new_timestamp: newTimestamp } = req.query
    let newCheckin = await clockin.update(checkinCode, newTimestamp);
    let currentTimestamp = newCheckin.records[0]._fields[0].properties.timestamp
    if (newTimestamp == currentTimestamp) res.send(200)
    else res.send(500)
  },
  listAll: async (req, res) => {
    let { company_code: companyCode, employee_code: employeeCode } = req.query
    let resultCredentialChecking = await clockin.checkCredentials(companyCode, employeeCode);
    if (resultCredentialChecking) {
      let resultListAll = await clockin.listAll(employeeCode);
      let allFoundCheckind = [];
      resultListAll.forEach((item) => {
        let fieldsArray = item._fields
        fieldsArray.forEach((node) => {
          allFoundCheckind.push(node.properties)
        })
      })
      res.send(allFoundCheckind)
      return allFoundCheckind
    }
    res.send(401)
  },
  delete: async (req, res) => {
    let { checkin_code: checkinCode } = req.query
    await clockin.delete(checkinCode);
    if (await clockin.isCheckinRegistered(checkinCode)) res.send(500)
    else res.send(200)
  }
};

module.exports = mainController;