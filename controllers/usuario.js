//Importacion
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
//Modelos
const Usuario = require('../models/usuario');

//funcion para crear un admin por defecto
const defaultAdmin = async () => {
    try {
        let user = new Usuario();
        user.nombre = "ADMINB";
        user.correo = "admin@gmail.com";
        user.password = "ADMINB";
        user.rol = "SUPER_ADMIN_ROLE";
        user.estado=  true
        const userEncontrado = await Usuario.findOne({ correo: user.correo });
        if (userEncontrado) return console.log("El administrador está listo");
        user.password = bcryptjs.hashSync(user.password, bcryptjs.genSaltSync());
        user = await user.save();
        if (!user) return console.log("El administrador no está listo!");
        return console.log("El administrador está listo!");
    } catch (err) {
        throw new Error(err);
    }
};

const getUsuarios = async (req = request, res = response) => {

    //Condición, me busca solo los usuarios que tengan estado en true
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'GET API de usuarios',
        listaUsuarios
    });

}


const postUsuario = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuarioDB = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuarioDB.password = bcryptjs.hashSync(password, salt);

    //Guardar en Base de datos
    await usuarioDB.save();

    res.status(201).json({
        msg: 'POST API de usuario',
        usuarioDB
    });

}

const putUsuario = async (req = request, res = response) => {

    const { id } = req.params;

    //Ignoramos el _id, rol, estado y google al momento de editar y mandar la petición en el req.body
    const { _id, rol, ...resto } = req.body;

    // //Encriptar password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(resto.password, salt);

    //editar y guardar
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT API de usuario',
        msg: 'Version anterior:',
        usuarioEditado
    });

}

const deleteUsuario = async (req = request, res = response) => {

    const { id } = req.params;

    //eliminar fisicamente y guardar
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE API de usuario',
        usuarioEliminado
    });

}

module.exports = {
    defaultAdmin,
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}