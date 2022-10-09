const db = require('./../Utilities/config.db');

class Driver {
    full_name;
    number;
    driver_image;
    cnic_front_image;
    cnic_back_image;
    is_active;
    is_deleted;
    deleted_at;
    created_at;
    updated_at;

    constructor(obj){
        this.full_name = obj.full_name;
        this.number = obj.number;
        this.driver_image = obj.driver_image;
        this.cnic_front_image = obj.cnic_front_image;
        this.cnic_back_image = obj.cnic_back_image;
        this.is_active = obj.is_active || 0;
        this.is_deleted = obj.is_deleted || 0;
        this.deleted_at = obj.deleted_at || null;
        this.created_at = obj.created_at || new Date().toISOString().replace("T", " ").split(".")[0];
        this.updated_at = obj.updated_at || null;
    }
}

Driver.signUp = (data, result)=> {
    try {
        const query = `INSERT INTO register_driver SET ?`;
        db.query(query, data, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}

Driver.FindDriverByNumber = (data, result)=> {
    try {
        const query = `SELECT * FROM register_driver WHERE number = '${data}'`;
        db.query(query, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}

Driver.activeDriver = (data, result)=> {
    try {
        const query = `UPDATE register_driver SET is_active=1 WHERE number='${data}'`;
        db.query(query, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}

Driver.AddImages = (id, data, result)=> {
    try {
        const query = `UPDATE register_driver SET driver_image='${data[0]}', cnic_front_image='${data[1]}', cnic_back_image='${data[1]}' WHERE id = ${id}`;
        db.query(query, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}

Driver.GetDriverById = (id, result)=> {
    try {
        const query = `SELECT full_name, number, driver_image, cnic_front_image, cnic_back_image FROM register_driver WHERE id = ${id} && is_active=1`;
        db.query(query, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}

Driver.UpdateDriver = (id, data, result)=> {
    try {
        const query = `update register_driver set `+Object.keys(data).map((key) => `${key} = ?`).join(", ") +` , updated_at='${new Date().toISOString().replace("T"," ").split(".")[0]}' where id=${id} ` 
        const parameters = Object.values(data).map(value => `${value}`)
        // const query = `SELECT full_name, number, driver_image, cnic_front_image, cnic_back_image FROM register_driver WHERE id = ${id} && is_active=1 && is_deleted=0`;
        db.query(query, parameters, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}

Driver.DeleteDriver = (id, result)=> {
    try {
        const query = `UPDATE register_driver SET is_deleted = 1 WHERE id = ${id}`;
        db.query(query, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}

module.exports = Driver;