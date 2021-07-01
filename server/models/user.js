import mongoose from 'mongoose';
import crypto from 'crypto';
import uuidv1 from 'uuid/v1';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    userinfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods = {
  authenticate(plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },

  securePassword(plainPassword) {
    if (!plainPassword) return '';
    try {
      return crypto.createHmac('sha256', this.salt).update(plainPassword).digest('hex');
    } catch (err) {
      return '';
    }
  },
};

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

export default mongoose.model('User', userSchema);

/*
1) crypto.createHmac('sha256', secret) - Self explanatory initializes a crypto hmac object.

2) .update('I love cupcakes') - The second missing argument is the encoding of the data you are passing in to be hashed, since it is left out it is forced to utf-8 string, you could pass in a buffer and specify the encoding, or a typed array and specify the encoding, etc. The update method can be called multiple times to add additional strings, buffers, etc onto the end of the data being passed in that way if you are receiving chunks of data you can pass them in as they arrive.

3) digest('base64') - this is the final call after you digest you are essentially saying I am done adding data to this hash and compute the results in the base64 format, you could also pass in other formats to return the hash in. An important thing to remember is that once you call digest the hash is done no more data can be added and you would need to create a new hmac variable to create another hmac, even if using the same parameters. */
