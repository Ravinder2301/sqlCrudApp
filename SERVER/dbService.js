const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_POR
});

connection.connect((err) => {
    if(err){
        console.log(err.message)
    }
    console.log("db " + connection.state);
})

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                // Add the 'USE' statement to select the database
                const selectDatabaseQuery = `USE ${process.env.DATABASE};`;
                connection.query(selectDatabaseQuery, (err) => {
                    if (err) reject(new Error(err.message));

                    // Now, you can proceed with your actual query
                    const selectDataQuery = "SELECT * FROM crudtable;";
                    connection.query(selectDataQuery, (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results);
                    });
                });
            });

            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const insertDataQuery = "INSERT INTO crudtable (name, date_added) VALUES (?, ?);";
                connection.query(insertDataQuery, [name, dateAdded], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else if (!result || result.insertId === undefined) {
                        reject(new Error("Insert ID is undefined in the result object."));
                    } else {
                        resolve(result.insertId);
                    }
                });
            });
    
            console.log(insertId);
            return{
                id: insertId,
                name: name,
                dateAdded: dateAdded
            };
    
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id){
        try {
            id = parseInt(id, 10);
            const deleteId = await new Promise((resolve, reject) => {
                const deleteDataQuery = "DELETE FROM crudtable WHERE id = ?";

                connection.query(deleteDataQuery, [id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }else {
                        resolve(result.affectedRows);
                    }
                });
            });
    
            return deleteId === 1 ? true : false;
    
        } catch (error) {
            console.log(error);
            return false
        }
    }
    
    async updateNameById(id, name){
        try {
            id = parseInt(id, 10);
            const updateName = await new Promise((resolve, reject) => {
                const updateNameQuery = "UPDATE crudtable SET name = ? WHERE id = ?;";

                connection.query(updateNameQuery, [name, id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }else {
                        resolve(result.affectedRows);
                    }
                });
            });
    
            return updateName === 1 ? true : false;
    
        } catch (error) {
            console.log(error);
            return false
        }
    }

    async searchByName(name){
        try {
            const searchName = await new Promise((resolve, reject) => {
                const searchNameQuery = "SELECT * FROM crudtable WHERE name = ?;";

                connection.query(searchNameQuery, [name], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }else {
                        resolve(result);
                    }
                });
            });
    
            // return updateName === 1 ? true : false;
            // console.log(searchName);
            return searchName
    
        } catch (error) {
            console.log(error);
            return false
        }
    }
}

module.exports = DbService;