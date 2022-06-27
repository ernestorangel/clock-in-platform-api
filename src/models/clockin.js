const neo4j = require('neo4j-driver');

const checkInTime = {
  record: (company_code, employee_code, checkin_code) => {
    const driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', 'password'));
    const session = driver.session();
    session.run(
      'CREATE (a:CHECK_IN_TIME {code: $code}) RETURN a',
      {
        code: checkin_code
      }
    );
    session.run(
      'MATCH (timestamp:CHECK_IN_TIME {code: $code}), (employee:EMPLOYEE {code: $employeeCode}) CREATE (timestamp) - [:CHECKED_BY] -> (employee)',
      {
        code: checkin_code,
        employeeCode: employee_code,
      }
    );
    session.close();
    driver.close();
  }
}

module.exports = checkInTime;







// session.close();
// driver.close();