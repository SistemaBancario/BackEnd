const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');


const ClienteSchema = Schema({
  nombre: {
    type: String,
  },
  username: {
    type: String,
  }, 
  accountNumber: {
    type: Number,
  },
  dpi: {
    type: String,
  },
  direccion: {
    type: String,
  },
  celular: {
    type: String,
  },
  correo: {
    type: String,
  },
  password: {
    type: String,
  },
  saldo: {
    type: String
  },
  nombretrabajo: {
    type: String,
  },
  ingresosmensuales: {
    type: Number,
  },
  rol: {
    type: String,
  },
  tipoCuenta: {
    type: String,
  },
  estado: {
    type: Boolean,
    default: true
  }
  
});

// Función para generar un número aleatorio de 10 dígitos
function generateRandomAccountNumber() {
  const min = 1000000000; // Número mínimo de 10 dígitos
  const max = 9999999999; // Número máximo de 10 dígitos
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Método para generar y asignar el número de cuenta aleatorio antes de guardar el documento
ClienteSchema.pre('save', async function (next) {
  if (!this.accountNumber) {
    let accountNumber = generateRandomAccountNumber();
    const existingUser = await this.constructor.findOne({ accountNumber });
    while (existingUser) {
      accountNumber = generateRandomAccountNumber();
      existingUser = await this.constructor.findOne({ accountNumber });
    }
    this.accountNumber = accountNumber;
  }
  next();
});

const Cliente = model('Cliente', ClienteSchema);

module.exports = Cliente;