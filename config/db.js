require("dotenv").config()
const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

const testConnection = async () => {
    try{
        const connection = await pool.getConnection()
        console.log("Database Connected")
        connection.release()
    }catch (error){
        console.log(error)
        process.exit(1)
    }
}

module.exports = {
    pool,
    testConnection
}