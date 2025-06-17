import mysql from 'mysql2/promise';

export const db = await mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    database:"tracking"
});
export const database = await mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    database:"tracking"
})