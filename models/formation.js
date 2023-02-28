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
    formateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formateur',
        required:true
    },
    
     
    

});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.Formation = mongoose.model('Formation', formationSchema);
 