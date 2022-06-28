const neo4j = require('neo4j-driver');

const checkInTime = {
  checkCredentials: async (company_code, employee_code) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
    driver.verifyConnectivity().then((result) =>  console.log(result));
    const session = driver.session();

    let result = await session.run(
      `MATCH (employee:EMPLOYEE) - [:WORKS_FOR] -> (company:COMPANY) WHERE company.code = $companyCode AND employee.code = $employeeCode RETURN company, employee`,
      {
        companyCode: company_code,
        employeeCode: employee_code
      }
    )

    session.close();
    driver.close();

    if (result !== undefined) {
      return true
    }

    return false
  },
  typeValidator: async (employee_code) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
    driver.verifyConnectivity().then((result) =>  console.log(result));
    const session = driver.session();

    let result = await session.run(
      `MATCH (checkin:CHECK_IN_TIME)`,
      {
        
      }
    )

    session.close();
    driver.close();
  },
  record: async (employee_code, checkin_code, timestamp) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
    driver.verifyConnectivity().then((result) =>  console.log(result));
    const session = driver.session();

    await session.run(
      `CREATE (a:CHECK_IN_TIME {code: $code, timestamp: $timestamp}) RETURN a`,
      {
        code: checkin_code,
        timestamp: timestamp
      }
    );

    await session.run(
      `MATCH (timestamp:CHECK_IN_TIME {code: $code}), (employee:EMPLOYEE {code: $employeeCode}) CREATE (timestamp) - [:CHECKED_BY] -> (employee)`,
      {
        code: checkin_code,
        employeeCode: employee_code,
      }
    );

    session.close();
    driver.close();
  },
  listAll: async (employee_code) => {
    console.log('caiu no list all')
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
    driver.verifyConnectivity().then((result) =>  console.log(result));
    const session = driver.session();

    let result = await session.run(
      `MATCH (checkin:CHECK_IN_TIME) - [:CHECKED_BY] -> (employee:EMPLOYEE) WHERE employee.code = $employeeCode RETURN checkin`,
      {
        employeeCode: employee_code
      }
    )

    session.close();
    driver.close();

    return result.records
  },
  listOverdue: async (company_code, employee_code) => {
    console.log('caiu no list overdue')
  }
}

module.exports = checkInTime;







// session.close();
// driver.close();