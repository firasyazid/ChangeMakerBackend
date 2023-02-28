const mongoose = require('mongoose');

const formateurSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    adress: { 
        type: String,
    },
    phone: { 
        type: String,
    },

    image:{ 
        type:String,
    }, 
    
     
    
     
})

   collaboraterSchema.virtual('id').get(function () {
        return this._id.toHexString();
    });
    
    collaboraterSchema.set('toJSON', {
        virtuals: true,
    });
    
 

exports.Formateur = mongoose.model('Formateur',  formateurSchema);
exports.formateurSchema = formateurSchema;
