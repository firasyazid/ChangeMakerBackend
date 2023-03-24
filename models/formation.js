const mongoose = require('mongoose');
const formationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    file: {
        type: [String], // array of file paths
        default: [],
      },
    
      seances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seance',
      }],
    

});

formationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

formationSchema.set('toJSON', {
    virtuals: true,
});

exports.Formation = mongoose.model('Formation', formationSchema);
 