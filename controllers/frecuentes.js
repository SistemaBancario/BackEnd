const Cliente = require('../models/cliente');

const clientesOrdenados = async (req, res) => {
  try {
    // Obtener la lista de clientes ordenados por la cantidad de transferencias
    const clientes = await Cliente.aggregate([
      {
        $lookup: {
          from: 'transferencia',
          localField: '_id',
          foreignField: 'clienteId',
          as: 'transferencias',
        },
      },
      {
        $project: {
          _id: 1,
          nombre: 1,
          transferencias: { $size: '$transferencia' },
        },
      },
      { $sort: { transferencias: -1 } },
    ]);

    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los clientes ordenados' });
  }
};

module.exports = {
  clientesOrdenados,
};

