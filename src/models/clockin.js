const neo4j = require('neo4j-driver');

const checkInTime = {
  record: async (company_code, employee_code, checkin_code) => {
    console.log("Chegou o seguinte: ", employee_code, checkin_code)
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
    driver.verifyConnectivity().then((result) =>  console.log(result));
    const session = driver.session();
    await session.run(
      `CREATE (a:CHECK_IN_TIME {code: $code}) RETURN a`,
      {
        code: checkin_code
      }
    );
    console.log("Passou a criação do node")
    await session.run(
      `MATCH (timestamp:CHECK_IN_TIME {code: $code}), (employee:EMPLOYEE {code: $employeeCode}) CREATE (timestamp) - [:CHECKED_BY] -> (employee)`,
      {
        code: checkin_code,
        employeeCode: employee_code,
      }
    );
    console.log("Passou a criação da relação")
    session.close();
    driver.close();
    console.log("Fechou tudo")
  }
}

module.exports = checkInTime;







// session.close();
// driver.close();