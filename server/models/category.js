const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, require: [true, 'Es necesario la descripcion de la categoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    estado: { type: Boolean, default: true }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Category', categoriaSchema);