const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
     },
    email: {
        type: String,
        required: true,
    },
     
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,   
        default:false, 
    },
    adress: {
        type: String,
        default: ''
    },
    image:{ 
        type:String,
    }, 
    formations: [{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation' }],
        validate: {
          validator: function (formations) {
             const user = this;
    
             if (user.isAdmin) {
              return formations.length === 0;
            }
    
             return true;
    },
          message: 'Only non-admin users can have formations.',
        },
    }],
    
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});
 
exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
