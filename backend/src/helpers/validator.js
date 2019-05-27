const mongoose = require("mongoose");
const validator = require("validator");

const objectId = (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Not a valid ID");
    }
    return true;
};

const fields = (value, modelName, nested = false) => {

    if (!value || !Object.keys(value).length) {
        throw new Error("Field is empty");
    }
    if (!mongoose.modelNames().includes(modelName)) {
        throw new Error("Not a valid model");
    }
    if (nested) {
        const fields = Object.keys(value);
        fields.forEach(field => {
            if (!mongoose.model(modelName).schema.path(field)) {
                console.log("here");
                throw new Error("Not a valid field");
            }
        });
    } else {
        if (!mongoose.model(modelName).schema.path(value)) {
            throw new Error("Not a valid field");
        }
    }
    return true;
};

const checkData = (data, modelName, save = true) => {
    if (!data || !Object.keys(data).length) {
        throw new Error("Data sent is empty");
    }
    
    if (save) {
        Object.keys(mongoose.model(modelName).schema.obj).forEach(key => {
            if (!data.hasOwnProperty(key)) {
                data[key] = "";
            }
        });
    }
    Object.keys(data).forEach(key => {
        const field = mongoose.model(modelName).schema.path(key);
        if (!field) return true;
        if (field.instance === "Array") {
            if (field.isRequired && !Array.isArray(data[key])) {
                throw new Error(`Require field ${key} to be an Array`);
            }
        } else if (field.instance !== "Mixed") {
            if (field.isRequired && validator.isEmpty(data[key])) {
                throw new Error(`Require field ${key}`);
            }
            if (mongoose.model(modelName).schema.obj[key].hasOwnProperty("validate")) {
                const { validate } = mongoose.model(modelName).schema.obj[key];
                if (!validate.validator(data[key])) {
                    throw new Error(validate.message);
                }
            }
            if (mongoose.model(modelName).schema.obj[key].hasOwnProperty("minlength")) {
                const { minlength } = mongoose.model(modelName).schema.obj[key];
                if (!validator.isLength(data[key], minlength[0])) {
                    throw new Error(minlength[1]);
                }
            }
        }
    });
    return true;
};

module.exports = {
    objectId,
    fields,
    checkData
}