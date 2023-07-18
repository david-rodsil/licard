import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    color: {type: String, required: false},
    photo: {type: String, required: false},
    name: {type: String, required: false},
    work: {type: String, required: false},
    description: {type: String, required: false},
});

const vcardSchema = new mongoose.Schema({
    visible: {type: Boolean, required: false},
    name: {type: String, required: false},
    lastname: {type: String, required: false},
    position: {type: String, required: false},
    organization: {type: String, required: false},
    phone: {type: String, required: false},
    workphone: {type: String, required: false},
    email: {type: String, required: false},
    web: {type: String, required: false},
})

const UsuarioSchema = new mongoose.Schema({
    username: {type: String, required: false, unique: true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    createdAt: {type: String, required:true},
    profile: {type: profileSchema, required: false},
    vcard: {type: vcardSchema, required: false},
    allLinks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Link'}],
});

const usuarioModel = mongoose.model('Usuario', UsuarioSchema);

export default usuarioModel;