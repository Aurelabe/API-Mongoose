const Profile = require('./model');


exports.getProfiles = async (req, res) => {
  try {
    console.log('Requête reçue avec les paramètres :', req.query);

    const { name, email, location, experience, skills } = req.query;
    const filter = {};

    if (name) {
      filter.name = new RegExp(name, 'i');
    }

    if (email) {
      filter.email = new RegExp(email, 'i');
    }

    if (location) {
      filter.location = new RegExp(information.location, 'i');
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      filter.skills = { $all: skillsArray };
    }

    const profiles = await Profile.find(filter);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Récupérer un profil par ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un nouveau profil
exports.createProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newProfile = new Profile({ name, email });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un profil par ID
exports.updateProfile = async (req, res) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email },
      { new: true }
    );
    if (!updatedProfile) return res.status(404).json({ message: 'Profile not found' });
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un profil par ID
exports.deleteProfile = async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter une expérience à un profil
exports.addExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, dates, description } = req.body;

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const newExperience = { title, company, dates, description };
    profile.experience.push(newExperience);

    // const editedProfile = await Profile.updateOne({_id:id,idDeleted:{$ne:false}}, {experience: {$push: newExperience}});

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une expérience d'un profile par l'ID d'expérience
exports.deleteExperience = async (req, res) => {
  try {
    const { id, exp } = req.params;

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.experience = profile.experience.filter((experience) => experience._id.toString() !== exp);

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter une compétence à un profil
exports.addSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skill } = req.body;

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.skills.includes(skill)) {
      return res.status(400).json({ error: 'Skill already exists' });
    }

    profile.skills.push(skill);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une compétence d'un profil
exports.deleteSkill = async (req, res) => {
  try {
    const { id, skill } = req.params;

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.skills = profile.skills.filter((s) => s !== skill);

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer ou mettre à jour les informations d'un profile
exports.updateInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, location, website } = req.body;

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.information = {
      bio: bio || profile.information?.bio || '',
      location: location || profile.information?.location || '',
      website: website || profile.information?.website || ''
    };

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Route pour ajouter un ami
exports.addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    // Vérification que les deux utilisateurs existent
    const user = await Profile.findById(userId);
    const friend = await Profile.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'Utilisateur ou ami non trouvé' });
    }

    // Ajouter l'ami à la liste des amis de l'utilisateur
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    // Ajouter l'utilisateur à la liste des amis de l'ami
    if (!friend.friends.includes(userId)) {
      friend.friends.push(userId);
      await friend.save();
    }

    res.status(200).json({ message: 'Ami ajouté avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
