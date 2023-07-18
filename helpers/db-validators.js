const Usuario = require('../models/usuario');
const Role = require('../models/role');
const Cliente = require('../models/cliente');
const Cuenta = require('../models/cuenta');



//Validamos en contro de la db si ese correo ya existe
const emailExiste = async( correo = '' ) => {
    //Verficar si el correo existe
    const existeEmailDeUsuario = await Usuario.findOne( { correo } );
    if ( existeEmailDeUsuario) {
        throw new Error(`El correo ${ correo }, ya esta registrado en la DB `);
    }
}

const emailClienteExiste = async( correo = '' ) => {
    //Verficar si el correo existe
    const existeEmailDelCliente = await Cliente.findOne( { correo } );
    if ( existeEmailDelCliente) {
        throw new Error(`El correo ${ correo }, ya esta registrado en la DB `);
    }
}

const esRoleValido = async( rol = '') => {
    //Verificar si el rol es valido y existe en la DB
    const existeRolDB = await Role.findOne( { rol } );
    if ( !existeRolDB ) {
        throw new Error(`El rol ${ rol }, no existe en la DB `);
    }
}


const existeUsuarioPorId = async( id ) => {

    //Verificar si existe el ID
    const existIdOfUser = await Usuario.findById( id );
    if ( !existIdOfUser ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const esTipoValido = async( tipo = '') => {
    //Verificar si el rol es valido y existe en la DB
    const existeTipoDB = await Cuenta.findOne( { tipo } );
    if ( !existeTipoDB ) {
        throw new Error(`El tipo ${ tipo }, no existe en la DB `);
    }
}


const existeClientePorId = async( id ) => {

    //Verificar si existe el ID
    const existIdOfClient= await Cliente.findById( id );
    if ( !existIdOfClient ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}



module.exports = {
    emailExiste,
    esRoleValido,
    existeUsuarioPorId,
    emailClienteExiste,
    existeClientePorId,
    esTipoValido
}