const Transferencia = require('../models/transferencia');
const Cliente = require('../models/cliente');

const realizarTransferencia = async (req, res) => {
  const { clienteId, monto, cuentaDestino, descripcion } = req.body;

  try {
    // Buscar el cliente remitente
    const clienteRemitente = await Cliente.findById(clienteId);
    if (!clienteRemitente) {
      return res.status(404).json({ error: 'Cliente remitente no encontrado' });
    }

    // Verificar si hay saldo suficiente para la transferencia
    if (clienteRemitente.saldo < monto) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Realizar la transferencia
    const transferencia = new Transferencia({
      cliente: clienteId,
      monto,
      cuentaDestino,
      descripcion
    });

    // Restar el monto del saldo del cliente remitente
    clienteRemitente.saldo -= monto;
    await clienteRemitente.save();

    // Buscar el cliente destinatario (si es necesario) y sumar el monto a su saldo
    if (cuentaDestino) {
      const clienteDestinatario = await Cliente.findOne({ cuenta: cuentaDestino });
      if (!clienteDestinatario) {
        return res.status(404).json({ error: 'Cliente destinatario no encontrado' });
      }
      clienteDestinatario.saldo += monto;
      await clienteDestinatario.save();
    }

    // Guardar la transferencia
    await transferencia.save();

    res.json({ message: 'Transferencia realizada con éxito' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al realizar la transferencia' });
  }
};

module.exports = { realizarTransferencia };
