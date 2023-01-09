const mysql = require('mysql');

// const conn = mysql.createPool({
//     host:process.env.DATABASE_HOST,
//     port: process.env.DATABASE_PORT,
//     user:process.env.DATABASE_USER,
//     password:process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME
// });
const conn = mysql.createPool({
  host: "sql6.freemysqlhosting.net",
  user:"sql6589402",
  password:"ReUMxvl6tj", 
  database: "sql6589402",
  port: 3306 
});
conn.getConnection((err,connection)=>{
  if(err){
    console.error("error connection:" + err.stack)
    return;
  }
  if(connection){
    console.log("Database Connection established! ")
    connection.release()
  }
})

  module.exports = conn;