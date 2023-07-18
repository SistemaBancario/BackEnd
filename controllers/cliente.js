const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
//Modelos
const Cliente = require('../models/cliente');

const getCliente = async (req = request, res = response) => {

  //Condición, me busca solo los usuarios que tengan estado en true
  const query = { estado: true };

  const listaCliente = await Promise.all([
    Cliente.countDocuments(query),
    Cliente.find(query)
  ]);

  res.json({
    msg: 'GET API de Clientes',
    listaCliente
  });

}



const postCliente = async (req = request, res = response) => {
  const { nombre,
    username,
    dpi,
    direccion,
    celular,
    correo,
    password,
    saldo,
    nombretrabajo,
    ingresosmensuales,
    rol,
    tipoCuenta
  } = req.body;

  const clienteCreado = new Cliente({
    nombre,
    username,
    dpi,
    direccion,
    celular,
    correo,
    password,
    saldo,
    nombretrabajo,
    ingresosmensuales,
    rol,
    tipoCuenta
  });

  //Encriptar password
  const salt = bcryptjs.genSaltSync();
  clienteCreado.password = bcryptjs.hashSync(password, salt);

  //Guardar en Base de datos
  await clienteCreado.save();

  res.status(201).json({
    msg: 'POST API de usuario',
    clienteCreado
  });

}



const putCliente = async (req, res) => {
  const { clienteId } = req.params;
  const { nombre, username, direccion, celular, correo, nombretrabajo, ingresosmensuales, rol, tipoCuenta } = req.body;

  try {
    // Verificar si el cliente existe en la base de datos
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si se intenta editar el DPI, número de cuenta o saldo
    if (req.body.dpi || req.body.accountNumber || req.body.saldo) {
      return res.status(400).json({ error: 'No está permitido editar el DPI, número de cuenta o saldo' });
    }

    // Actualizar los campos permitidos
    cliente.nombre = nombre || cliente.nombre;
    cliente.username = username || cliente.username;
    cliente.direccion = direccion || cliente.direccion;
    cliente.celular = celular || cliente.celular;
    cliente.correo = correo || cliente.correo;
    cliente.nombretrabajo = nombretrabajo || cliente.nombretrabajo;
    cliente.ingresosmensuales = ingresosmensuales || cliente.ingresosmensuales;
    cliente.rol = rol || cliente.rol;
    cliente.tipoCuenta = tipoCuenta || cliente.tipoCuenta;

    // Guardar los cambios en la base de datos
    const clienteActualizado = await cliente.save();

    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};



/*const putUsuario = async (req = request, res = response) => {

  const cliente = await Cliente.findById(clienteId);
  if (!cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  // Verificar si se intenta editar el DPI, número de cuenta o saldo
  if (req.body.dpi || req.body.accountNumber || req.body.saldo) {
    return res.status(400).json({ error: 'No está permitido editar el DPI, número de cuenta o saldo' });
  }

  const { id } = req.params;

  const { _id, rol, ...resto } = req.body;

  // //Encriptar password
  const salt = bcryptjs.genSaltSync();
  resto.password = bcryptjs.hashSync(resto.password, salt);

  //editar y guardar
  const ClienteEditado = await Cliente.findByIdAndUpdate(id, resto);

  res.json({
    msg: 'PUT API de usuario',
    msg: 'Version anterior:',
    ClienteEditado
  });

}
*/
const deleteCliente = async (req, res) => {
  const { clienteId } = req.params;

  try {
    // Verificar si el cliente existe en la base de datos
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Eliminar el cliente de la base de datos
    await cliente.remove();

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};

const getSaldoActual = async (req, res) => {
  try {
    // Obtener el cliente actual a partir del token
    const clienteId = req.userId;
    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Enviar el saldo actual como respuesta
    res.json({ saldo: cliente.saldo });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el saldo' });
  }
};

const getHistorialCuenta = async (req, res) => {
  try {
    // Obtener el cliente actual a partir del token
    const clienteId = req.userId;
    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Obtener el historial de la cuenta del cliente (por ejemplo, transferencias, compras o créditos)
    // Puedes usar otros modelos relacionados para obtener la información necesaria
    // const historialCuenta = ...

    // Enviar el historial de la cuenta como respuesta
    res.json({ historialCuenta });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial de la cuenta' });
  }
};


module.exports = {
  getCliente,
  postCliente,
  putCliente,
  deleteCliente,
  getSaldoActual,
  getHistorialCuenta
}