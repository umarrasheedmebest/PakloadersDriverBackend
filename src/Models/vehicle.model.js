const db = require('./../Utilities/config.db');

class Vehicle {
    driver_id;
    name;
    vehicle_image1;
    vehicle_image2;
    driving_license_image1;
    driving_license_image2;
    created_at;
    updated_at;

    constructor(obj){
        this.driver_id = obj.driver_id;
        this.name = obj.name;
        this.vehicle_image1 = obj.vehicle_image1;
        this.vehicle_image2 = obj.vehicle_image2;
        this.driving_license_image1 = obj.driving_license_image1;
        this.driving_license_image2 = obj.driving_license_image2;
        this.created_at = obj.created_at || new Date().toISOString().replace("T", " ").split(".")[0];
        this.updated_at = obj.updated_at || null;
    }
}

Vehicle.AddDriverLiscence = (data, result)=> {
    try {
        const query = `INSERT INTO vehicles_info SET ?`;
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

Vehicle.AddVehicleInfo = ( id, data, result)=> {
    try {
        const query = `UPDATE vehicles_info SET name = '${data.name}', vehicle_image1 = '${data.vehicle_image1}', vehicle_image2 = '${data.vehicle_image2}' WHERE driver_id = ${id}`;
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

module.exports = Vehicle;