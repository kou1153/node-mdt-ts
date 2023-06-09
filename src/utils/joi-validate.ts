import Joi from "joi";

const validator = (schema: Joi.ObjectSchema) => (payload: any) =>
    schema.validate(payload, {abortEarly: false});

const emailSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().required(),
    mdt: Joi.string().required(),
});

const mdtSchema: Joi.ObjectSchema = Joi.object({
    hovaten: Joi.string().required(),
    tkck: Joi.string().required(),
    sdt: Joi.string().required(),
    email: Joi.string().required(),
    mdt: Joi.string().required(),
});

const validateEmail = validator(emailSchema);
const validateMDT = validator(mdtSchema);

export {validateEmail, validateMDT, validator};
