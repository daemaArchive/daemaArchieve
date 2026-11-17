const router = require('express').Router();
const projectController = require('../controllers/project.controller');

router.get('/', projectController.getAll);
router.get('/:id', projectController.getOne);
router.post('/', projectController.create);
router.patch('/:id', projectController.update);
router.delete('/:id', projectController.remove);

module.exports = router;
