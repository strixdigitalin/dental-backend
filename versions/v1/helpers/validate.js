const MyError = require("../error/MyError");

const validate = async (validationSchema, data) => {
    const validatedData = await validationSchema.validate(data).catch((err) => {
        throw new MyError(400, err.errors?.[0]);
    });

    return validatedData;
};

module.exports = validate;
