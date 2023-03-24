const mongoose = require('mongoose');
const ecoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    seances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seance',
      }],
    });

      ecoleSchema.virtual('id').get(function () {
        return this._id.toHexString();
    });
    
    ecoleSchema.set('toJSON', {
        virtuals: true,
    });
    
    exports.Ecole = mongoose.model('Ecole', ecoleSchema);