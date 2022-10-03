const db = require('./../Utilities/config.db');

class Driver {
    full_name;
    number;
    secondary_number;
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
        this.secondary_number = obj.secondary_number;
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

module.exports = Driver;