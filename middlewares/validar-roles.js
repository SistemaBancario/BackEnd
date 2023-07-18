const { request, response  } = require('express');

const esAdminRole = ( req = request, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verficar el role sin validar el token primero'
        });
    }

    //Verificación solo el rol de Admi puede realizar la eliminación
    //Si cumple con el rol de admin se envia al controllador deleteUsuario
    const { rol, nombre  } = req.usuario
    if ( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es admin - No puede hacer esto >:v`
        });
    }

    next();

}

const esSuperAdminRole = ( req = request, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verficar el role sin validar el token primero'
        });
    }

    const { rol, nombre  } = req.usuario
    if ( rol == 'CLIENTE_ROLE') {
        return res.status(401).json({
            msg: `${ nombre }, Hola Cliente!`
        });
    }
    console.log(req.usuario)
    next();

}


const esClienteRole = ( req = request, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verficar el role sin validar el token primero'
        });
    }

    const { rol, nombre  } = req.usuario
    if ( rol !== 'SUPER_ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre }, eres admin pero no un super admin - No puede hacer esto >:v`
        });
    }
    console.log(req.usuario)
    next();

}

module.exports = {
    esAdminRole,
    esSuperAdminRole,
    esClienteRole
}