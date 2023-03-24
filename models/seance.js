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

    dateSeance: {
        type: Date,
        default: Date.now,
     },
    formation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formation',
        required:true
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    
  procesVerbal :{ 
    type: [String],  
    default: [],
   },

   picture: {
    type: String,
  },
  

});
seanceSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

seanceSchema.set('toJSON', {
    virtuals: true,
});

exports.Seance = mongoose.model('Seance', seanceSchema);
exports.seanceSchema = seanceSchema;
