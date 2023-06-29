const mongoose = require('mongoose');
const Joi = require('joi');

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    }
});

const Language = mongoose.model("Language", languageSchema);

function validateLanguage(language) {
    const Schema = Joi.object({
        name: Joi.string().required(),
        code: Joi.string().required()
    });
    return Schema.validate(language);
}

exports.Language = Language;
exports.validate = validateLanguage;
