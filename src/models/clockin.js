const neo4j = require('neo4j-driver');

const checkInTime = {
  checkCredentials: async (company_code, employee_code) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
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

    if (result.records.length) return true
    else return false
  },
  isCheckinRegistered: async (checkin_code) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
    driver.verifyConnectivity().then((result) =>  console.log(result));
    const session = driver.session();

    let result = await session.run(
      `MATCH (checkin:CHECK_IN_TIME {code: $checkinCode}) RETURN checkin`,
      {
        checkinCode: checkin_code
      }
    )

    session.close();
    driver.close();
    
    if (result.records.length) return true
    else return false
  },
  isTimestamp: async (checkin_code, timestamp) => {
    console.log('caiu no isTimestamp')
  },
  record: async (employee_code, checkin_code, timestamp) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
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
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
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
  delete: async (checkin_code) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
    const session = driver.session();

    await session.run(
      `MATCH (checkin:CHECK_IN_TIME {code: $checkinCode}) DETACH DELETE checkin`,
      {
        checkinCode: checkin_code
      }
    )

    session.close();
    driver.close();
  },
  update: async (checkin_code, new_timestamp) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('admin_connect', '3mo7'));
    const session = driver.session();

    let result = await session.run(
      `MATCH (checkin:CHECK_IN_TIME {code: $checkinCode}) SET checkin.timestamp = $newTimestamp RETURN checkin`,
      {
        checkinCode: checkin_code,
        newTimestamp: new_timestamp
      }
    )

    session.close();
    driver.close();
    
    return result
  }
}

module.exports = checkInTime;







// session.close();
// driver.close();