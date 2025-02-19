const express = require('express');
const router = express.Router();
const {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  addExperience,
  deleteExperience,
  addSkill,
  deleteSkill,
  updateInformation,
  addFriend,
} = require('./controller');

router.get('/', getProfiles);
router.get('/:id', getProfileById);
router.post('/', createProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);
router.post('/:id/experience', addExperience);
router.delete('/:id/experience/:exp', deleteExperience);
router.post('/:id/skills', addSkill);
router.delete('/:id/skills/:skill', deleteSkill);
router.put('/:id/information', updateInformation);
router.post('/addFriend', addFriend);

module.exports = router;
