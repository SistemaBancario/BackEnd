const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const Cliente = require('../models/cliente');

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        const cliente = await Cliente.findOne({ correo });


        if (!usuario && !cliente) {
            return res.status(404).json({
                msg: 'El correo de usuario no existe en la base de datos'
            });
        }

        //Verificar la password el usuario    //comporeSync, encripta ambas passwords y las compara
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'La password es incorrecta'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login Auth Funciona!',
            nombre: usuario.nombre,
            rol: usuario.rol,
            correo, password,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el admin'
        })
    }


}


module.exports = {
    login
}