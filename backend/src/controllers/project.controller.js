const projectService = require('../services/project.service');

// params는 항상 문자열 → 숫자로 바꾸고, 숫자가 아니면 404
function parseId(req) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        const err = new Error('프로젝트를 찾을 수 없습니다');
        err.status = 404;
        throw err;
    }
    return id;
}

// 컨트롤러는 req에서 값 꺼내고 res로 응답만 함. 로직은 서비스에.
exports.getAll = async (req, res) => {
    res.json(await projectService.getProjects());
};

exports.getOne = async (req, res) => {
    res.json(await projectService.getProject(parseId(req)));
};

exports.create = async (req, res) => {
    res.status(201).json(await projectService.createProject(req.body));
};

exports.update = async (req, res) => {
    res.json(await projectService.updateProject(parseId(req), req.body));
};

exports.remove = async (req, res) => {
    await projectService.deleteProject(parseId(req));
    res.sendStatus(204);
};
