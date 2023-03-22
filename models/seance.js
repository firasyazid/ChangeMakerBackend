const mongoose = require('mongoose');

const seanceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    dateFormation: {
        type: Date,
        default: Date.now,
     },
    formateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formateur',
        required:true
    },
    
    formation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formation',
        required: true,
      },
    
  procesVerbal :{ 
    type: String,  
    required: true,
  }


});
seanceSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

seanceSchema.set('toJSON', {
    virtuals: true,
});

exports.Seance = mongoose.model('Seance', seanceSchema);
exports.seanceSchema = seanceSchema;
