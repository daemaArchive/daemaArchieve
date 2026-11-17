const db = require('../db');

// 승인된 프로젝트에서 쓰인 기술 스택과 사용 개수 (많이 쓰인 순)
exports.getTechStacks = async () => {
    const [rows] = await db.query(
        `SELECT t.name, COUNT(*) AS count
         FROM project_tech_stacks t
         JOIN projects p ON p.id = t.project_id
         WHERE p.status = 'APPROVED'
         GROUP BY t.name
         ORDER BY count DESC, t.name`
    );
    return rows;
};
