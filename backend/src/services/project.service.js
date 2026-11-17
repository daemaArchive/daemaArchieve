const db = require('../db');

const FIELDS = ['title', 'description', 'demo_url'];

function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// 클라이언트가 보낸 body에서 허용된 필드만 골라냄
function pickFields(body) {
    const data = {};
    for (const field of FIELDS) {
        if (body?.[field] !== undefined) data[field] = body[field];
    }
    if (data.title !== undefined && (typeof data.title !== 'string' || !data.title.trim())) {
        throw httpError(400, 'title은 비어 있을 수 없습니다');
    }
    return data;
}

exports.getProjects = async () => {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY id DESC');
    return rows;
};

exports.getProject = async (id) => {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows.length === 0) throw httpError(404, '프로젝트를 찾을 수 없습니다');
    return rows[0];
};

exports.createProject = async (body) => {
    const data = pickFields(body);
    if (data.title === undefined) throw httpError(400, 'title은 필수입니다');

    const [result] = await db.query('INSERT INTO projects SET ?', [data]);
    return exports.getProject(result.insertId);
};

exports.updateProject = async (id, body) => {
    const data = pickFields(body);
    if (Object.keys(data).length === 0) throw httpError(400, '수정할 값이 없습니다');

    const [result] = await db.query('UPDATE projects SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) throw httpError(404, '프로젝트를 찾을 수 없습니다');
    return exports.getProject(id);
};

exports.deleteProject = async (id) => {
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw httpError(404, '프로젝트를 찾을 수 없습니다');
};
