const mongoose = require('mongoose');

const formateurSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,

    },
    adress: { 
        type: String,
        required: true,

    },
    phone: { 
        type: String,
        required: true,

    },
    image:{ 
        type:String,
    }, 
    formations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formation',
      }],
    
     
})

formateurSchema.virtual('id').get(function () {
        return this._id.toHexString();
    });
    
    formateurSchema.set('toJSON', {
        virtuals: true,
    });
    
 

exports.Formateur = mongoose.model('Formateur',  formateurSchema);
exports.formateurSchema = formateurSchema;
