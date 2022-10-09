const Driver = require('./../Models/drivers.model');
const Vehicle = require('./../Models/vehicle.model');

const basicInfo = async(req, res, next)=> {
    try {
        const id = req.params.id;
        const data = req.files.map((file)=> file.filename);
        Driver.AddImages(id,data, (err, response)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send({id,message: 'Images Added Successfully.'});
            }
        })
    } catch (error) {
        next(error);
    }
}

const driverLiscenceInfo = async(req, res, next)=> {
    try {
        const driver_id = Number(req.params.id);
        const data = req.files.map((file)=> file.filename);
        const liscenceObj = {
            driving_license_image1: data[0],
            driving_license_image2: data[1],
            driver_id
        }
        const result = new Vehicle(liscenceObj);
        Vehicle.AddDriverLiscence(result, (err, response)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send({id: driver_id ,message: 'Driver Liscence Added Successfully.'});
            }
        })
    } catch (error) {
        next(error);
    }
}

const addVehicleInfo = async(req, res, next)=> {
    try {
        const driver_id = Number(req.params.id);
        const data = req.files.map((file)=> file.filename);
        const name = req.body.name;
        const liscenceObj = {
            vehicle_image1: data[0],
            vehicle_image2: data[1],
            name
        }
        Vehicle.AddVehicleInfo(driver_id , liscenceObj, (err, response)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send({id: driver_id ,message: 'Vehicle Info Added Successfully.'});
            }
        })
    } catch (error) {
        next(error);
    }
}

const getDriverById = async(req, res, next)=> {
    try {
        const id = req.params.id;
        Driver.GetDriverById(id, (err, data)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send(data);
            }
        })
    } catch (error) {
        next(error);
    }
}

const updateDriver = async(req, res, next)=> {
    try {
        const id = req.params.id;
        const data = req.body;
        Driver.UpdateDriver(id, data, (err, data)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send(data);
            }
        })
    } catch (error) {
        next(error);
    }
}

const deleteDriver = async(req, res, next)=> {
    try {
        const id = req.params.id;
        Driver.DeleteDriver(id, (err, data)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send(data);
            }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    basicInfo,
    driverLiscenceInfo,
    addVehicleInfo,
    getDriverById,
    updateDriver,
    deleteDriver
}