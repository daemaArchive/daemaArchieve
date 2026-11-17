const router = require('express').Router();
const techStackController = require('../controllers/techStack.controller');

router.get('/', techStackController.getAll);

module.exports = router;
