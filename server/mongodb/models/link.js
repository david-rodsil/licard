import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
    link: {type: String, required: true},
    text: {type: String, required: false},
    icon: {type: String, required: true},
    order: {type: Number, required: true},
    creator: {type:mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
})

const linkModel = mongoose.model('Link', LinkSchema)

export default linkModel;