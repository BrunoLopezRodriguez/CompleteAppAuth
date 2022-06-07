const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, resp=response)=> {
    const {email ,name, password} = req.body;
    try {  
    // Verificar el email
        const usuario = await Usuario.findOne({email});

        if(usuario){
            return resp.status(400).json({
                ok:false,
                msg: 'Ese email ya esta en uso'
            });
        }
    //Crear usuario con el modelo
    const dbUser = new Usuario(req.body);
    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync( password , salt);
    //Generar el JSON Web Token
    const token = await generarJWT(dbUser.id, dbUser.name, dbUser.email);
    //Crear usuario en BD
    await dbUser.save();
    //Generar Respuesta Exitosa
    return resp.status(201).json({
        ok: true,
        uid: dbUser.id,
        name,
        email: dbUser.email,
        token
    });      
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUsuario = async(req, resp=response)=> {
    const {email , password} = req.body;
    try {
        const usuarioDB= await Usuario.findOne({email});
        if(!usuarioDB){
            return resp.status(400).json({
                ok:false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }
        // Confirmar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validPassword){
            return resp.status(400).json({
                ok:false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }
        // Generar el JWT
        const token = await generarJWT(usuarioDB.id, usuarioDB.name, usuarioDB.email);
        // Respuesta
        return resp.json({
            ok:true,
            uid: usuarioDB.id,
            name: usuarioDB.name,
            email: usuarioDB.email,
            token
        });
    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const validacionToken = async(req, resp=response)=> {

    const {uid, name, email}=req;

    //Leer bd para el email
    const dbUser = await Usuario.findById(uid);



    const token = await generarJWT(uid, name, email);
    return resp.json({
        ok: true,
        uid,
        name,
        email: dbUser.email,
        token
    });
}






module.exports = {
    crearUsuario,
    loginUsuario,
    validacionToken
}