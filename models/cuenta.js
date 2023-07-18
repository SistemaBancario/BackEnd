const { Schema, model } = require('mongoose');

const CuentaSchema = Schema({
    tipo: {
        type: String,
        required: [true, 'El tipo de cuenta es obligatorio es obligatorio']
    }
});

module.exports = model('Cuenta', CuentaSchema);