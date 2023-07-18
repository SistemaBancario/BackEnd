const mongoose = require('mongoose');
const Cliente = require('../models/cliente');

const transferenciaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  cuentaDestino: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  }
  // Otros campos relacionados con la transferencia
});

// Middleware pre 'save' para actualizar el saldo del cliente
transferenciaSchema.pre('save', async function(next) {
  try {
    // Obtener el cliente asociado a la transferencia
    const cliente = await Cliente.findById(this.cliente);

    // Actualizar el saldo del cliente
    cliente.saldo += this.monto;

    // Guardar los cambios en el cliente
    await cliente.save();

    next();
  } catch (error) {
    next(error);
  }
});

const Transferencia = mongoose.model('Transferencia', transferenciaSchema);

module.exports = Transferencia;
