const techStackService = require('../services/techStack.service');

exports.getAll = async (req, res) => {
    res.json({ tech_stacks: await techStackService.getTechStacks() });
};
