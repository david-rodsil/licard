import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import usuarioModel from '../mongodb/models/usuario.js'
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

import sharp from 'sharp';
import { Readable } from 'stream';
import linkModel from '../mongodb/models/link.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// ------------------------------ Registro de Usuarios ------------------------------
const createUser = async (req, res) => {
  try {
    const { email, password, username, createdAt } = req.body;

    // Verificar correo único
    const existingEmail = await usuarioModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "email"
      });
    }

    // Verificar usuario único
    const existingUser = await usuarioModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "username"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new usuarioModel({
      email,
      password: hashedPassword, 
      username,
      createdAt,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ success: true, message: "Usuario Creado exitosamente", user: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------------ Login de Usuarios ------------------------------
const loginUser = async (req, res) => {
  let existingUser

  try {
    const { access, password } = req.body;
    
    existingUser = await usuarioModel.findOne({ email: access });
    if (!existingUser) {
      existingUser = await usuarioModel.findOne({ username: access });
      if (!existingUser) {
        return res.status(401).json({ success: false, message: "El correo o usuario no está registrado" });
      }
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }

    const { email, profile, allLinks, username } = existingUser;

    const accessToken = jwt.sign(
      { userId: existingUser._id },
      "tu_clave_secreta_aquí",
      { expiresIn: "5000h" } 
    );

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      accessToken,
      user: {
        email,
        username,
        profile,
        allLinks,
      }
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// ------------------------------ Editar Perfil ------------------------------
const updateProfile = async (req,res) => {
  try {
    const { color, description, email, name, work, sortedlinks } = req.body
    
    const user = await usuarioModel.findOne({email: email}).populate('allLinks')

    // Actualizar orden de link
    if(sortedlinks){
      for (const sortedLink of sortedlinks) {
        await linkModel.findByIdAndUpdate(sortedLink._id,  { $set: { order: sortedLink.order }});
      }
    }

    // Actualizar datos del usuario
    await usuarioModel.findByIdAndUpdate(user._id, { $set: { 'profile.color': color, 'profile.name': name, 'profile.work': work, 'profile.description': description} });
    

    res.status(200).json({success: true, result:{_id:user._id}, message: 'Ediciones realizadas exitosamente'})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

// ------------------------------ Editar Vcard ------------------------------
const updateVcard = async (req,res) => {
  try {
    const { email, lastname, name, organization, phone, position, visible, web, workphone, username } = req.body
    
    const user = await usuarioModel.findOne({username: username}).populate('allLinks').populate('allLinks');  

    // Actualizar datos del usuario
    await usuarioModel.findByIdAndUpdate(user._id, { $set: { 'vcard.workphone': workphone, 'vcard.web': web, 'vcard.visible': visible, 'vcard.email': email, 'vcard.lastname': lastname, 'vcard.name': name, 'vcard.organization': organization, 'vcard.phone': phone, 'vcard.position': position } });
    
    res.status(200).json({success: true, result:{_id:user._id}, message: 'Ediciones realizadas exitosamente'})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

// ------------------------------ Obtener datos del perfil ------------------------------

const getProfile = async (req,res) => {
  try {
    const  email  = req.query.email;
    const id = await usuarioModel.findOne({email: email})

    if (!id || !id._id) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = await usuarioModel
      .findOne({_id : id._id})
      .select('-password')
      .populate('allLinks');

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

// ------------------------------ Obtener datos del público ------------------------------

const getPublicProfile = async (req,res) => {
  try {
    const {username}= req.params
    const id = await usuarioModel.findOne({username: username})

    const user = await usuarioModel
        .findOne({_id : id._id})
        .select('-password')
        .populate('allLinks');

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

// ------------------------------ Actualizar Foto ------------------------------
const updatePhoto = async (req,res) => {
  try {
    const { email, photo } = req.body
    const id = await usuarioModel.findOne({email: email})
  
    // Encontrar  en la base de datos
    const toUpdateUser = await usuarioModel.findById(id._id);

    // Convertir la imagen a un objeto buffer
    const photoBuffer = Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  
    // Comprimir la imagen antes de subirla a Cloudinary
    const compressedImageBuffer = await sharp(photoBuffer)
      .resize({ width: 300 })
      .jpeg({ quality: 75 })
      .toBuffer();

    // Convertir el buffer en un stream de lectura
    const readablePhotoStream = new Readable();
    readablePhotoStream.push(compressedImageBuffer);
    readablePhotoStream.push(null);

    // Subir la imagen a Cloudinary
    const photoUrl = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          use_filename:true,
          format: 'webp',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      readablePhotoStream.pipe(cloudinaryStream);
    });

    // Eliminar la imagen anterior en Cloudinary
    const currentPhotoUrl = toUpdateUser.profile.photo;
    if (currentPhotoUrl) {
      const publicId = currentPhotoUrl.match(/\/([^/]+)\.webp$/)[1];
      try {
        const result = await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(error);
      }
    }    
  
    await usuarioModel.findByIdAndUpdate(id._id, { $set: { 'profile.photo': photoUrl } });

    res.status(200).json({message: 'Foto subida exitosamente'})
  } catch (error) {
    res.status(500).json({message: error.message})
    
  }
}

// ------------------------------ Eliminar Fotografía ------------------------------
const deleteImage = async (req,res) => {
  try {
    const { email } = req.query

    const id = await usuarioModel.findOne({email: email})
  
    // Encontrar  en la base de datos
    const toUpdateUser = await usuarioModel.findById(id._id);

    // Eliminar la imagen anterior en Cloudinary
    const currentPhotoUrl = toUpdateUser.profile.photo;
    if (currentPhotoUrl) {
      const publicId = currentPhotoUrl.match(/\/([^/]+)\.webp$/)[1];
      try {
        const result = await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(error);
      }
    }    

    // Actualizar el perfil del usuario para eliminar la referencia a la imagen
    toUpdateUser.profile.photo = '';
    await toUpdateUser.save();

    res.status(200).json({message: 'Foto eliminada exitosamente'})
  } catch (error){
    res.status(500).json({message: error.message})
  }
}

export {
    getPublicProfile,
    createUser,
    loginUser,
    updateProfile,
    getProfile,
    updatePhoto,
    updateVcard,
    deleteImage,
}