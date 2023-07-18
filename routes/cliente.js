//importaciones
const { Router } = require('express');
const { check } = require('express-validator');


const { getCliente, postCliente, putCliente, deleteCliente, getHistorialCuenta, getSaldoActual } = require('../controllers/cliente');
const { emailClienteExiste, esRoleValido, existeClientePorId, esTipoValido } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');
const { validarJWT } = require('../middlewares/validar-jwt'); // Importar el middleware para validar el token
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();


router.get('/mostrar', getCliente);


router.post('/agregar', [
  validarJWT,
  esAdminRole,
  check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
  check('username', 'El nombre de usuario es obligatorio para el post').not().isEmpty(),
  check('direccion', 'La dirección de usuario es obligatorio para el post').not().isEmpty(),
  check('celular', 'El celular es obligatorio para el post').not().isEmpty(),
  check('celular', 'El celular debe ser mayor a 8 digitos').isLength({ max: 8 }),
  check('password', 'La password es obligatorio para el post').not().isEmpty(),
  check('password', 'La passwarod debe ser mayor a 6 letras').isLength({ min: 6 }),
  check('correo', 'El correo no es valido').isEmail(),
  check('correo').custom(emailClienteExiste),
  check('ingresosmensuales', 'Los ingresos mensuales deben ser al menos de Q100').isInt({ min: 100 }),
  check('saldo', 'El saldo debe ser al menos Q100').isInt({ min: 100 }),
  check('nombretrabajo', 'El nombre del trabajo es obligatorio para el post').not().isEmpty(),
  check('rol').custom(esRoleValido),
  check('tipoCuenta').custom(esTipoValido),
  validarCampos
], postCliente);

router.put('/editar/:clienteId', [
  validarJWT,
  esAdminRole,
  check('id').custom( existeClientePorId ),
  check('correo', 'El correo no es valido').isEmail(),
  check('correo').custom( emailClienteExiste ),
  check('password', 'La password es obligatorio para el post').not().isEmpty(),
  check('password', 'La passwarod debe ser mayor a 6 letras').isLength({ min: 6 }),
  check('rol').custom( esRoleValido ),
  check('tipoCuenta').custom(esTipoValido),
  validarCampos
],putCliente);

router.delete('/eliminar/:clienteId', [
  validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeClientePorId ),
    validarCampos
],deleteCliente);


router.get('/historial', validarJWT, getHistorialCuenta);
router.get('/saldo', validarJWT, getSaldoActual);




module.exports = router;