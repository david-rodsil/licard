import mongoose from 'mongoose';
import linkModel from '../mongodb/models/link.js';
import * as dotenv from 'dotenv';
import usuarioModel from '../mongodb/models/usuario.js';

dotenv.config();

// ------------------------------------- Crear Link -------------------------------------
const createNewLink = async (req, res) => {
  try {
    const { email, icon, text, link } = req.body

    // Iniciar sesión y transacción en mongodb
    const session = await mongoose.startSession();
    session.startTransaction();

    // Encontrar Usuario
    const user = await usuarioModel.findOne({ email }).session(session);
    if (!user) throw new Error("Usuario no Encontrado");

      // Obtener el último enlace registrado para obtener su orden 
      const lastLink = await linkModel.findOne().sort('-order');
      // Calcular el siguiente orden
      const nextOrder = lastLink ? lastLink.order + 1 : 1;

    // CrearLink
    const newLink = await linkModel.create({ icon, text, link, creator: user._id, order: nextOrder });

    // Agregar Link al usuario
    user.allLinks.push(newLink._id);
    await user.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Link Creado Exitosamente" });
  } catch (error){
    res.status(500).json({error: errror.message})
  }
};

// ------------------------------------- Eliminar Link -------------------------------------

const deleteLink = async (req,res) => {
  let toDeleteLink;

  try {
    const { id } = req.query

    // Encontrar Link 
    toDeleteLink = await linkModel.findById({_id: id}).populate('creator');
    if (!toDeleteLink) {
      throw new Error('Link no encontrado');
    }

    // Iniciar sesión y transacción en mongodb
    const session = await mongoose.startSession();
    session.startTransaction();

    // Eliminar link y link del usuario
    await toDeleteLink.deleteOne({ _id: id }, { session })
    toDeleteLink.creator.allLinks.pull(toDeleteLink);

    await toDeleteLink.creator.save({ session });
    await session.commitTransaction();

  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export {
  createNewLink,
  deleteLink,
};