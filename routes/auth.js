const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, validacionToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router(); 

// Crear un nuevo usirario
router.post( '/new',[  
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La password es incorrecta').isLength({ min: 6}),
    validarCampos
 ], crearUsuario );

// Login de  usirario
router.post( '/', [  
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La password es incorrecta').isLength({ min: 6}),
    validarCampos
 ] ,loginUsuario);

// Validacion y revalidacion de jsonwebtoken
router.get( '/renew', validarJWT, validacionToken);




module.exports = router;
