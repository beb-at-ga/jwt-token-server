const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1
  },
  lastname: {
    type: String,
    required: false  
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    validate: {
      validator: (input) => {
        return /.*@?*\./test(input)
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 5000
    }
  }
})

// use bcrypt to hash the password
// a "lifecycle hook" in mongoose is "presave"
userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, 12)
  next();
})

// ensure the password doesn't get sent with the rest of the data
// to do this, we'll override the toJson functionality to exclude the password

userSchema.set('toJson', {
  transform: (doc, user) => {
    // can whitelist of blacklist returned attribs. this is blacklist.
    delete user.password;
    return user;
  }
});

// create a helper function to compare the password hashes.
userSchema.methods.isAuthenticated = function(typedPassword) {
  return bcrypt.compareSync(typedPassword, this.password);
}

module.exports - mongoose.model('User', userSchema);

