const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: [
    {
      title: { type: String },
      company: { type: String },
      dates: { type: String },
      description: { type: String }
    }
  ],
  skills: [String],
  information: [
    {
      bio: { type: String },
      location: { type: String },
      website: { type: String }
    },
  ],

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
});

module.exports = mongoose.model('Profile', ProfileSchema);
