CREATE DATABASE IF NOT EXISTS daema_archive DEFAULT CHARACTER SET utf8mb4;
USE daema_archive;

-- 컬럼은 snake_case → 조회 결과가 그대로 JSON 규칙(snake_case)과 맞음
CREATE TABLE IF NOT EXISTS projects (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    demo_url    VARCHAR(500),
    status      ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 프로젝트별 기술 스택 이름 목록 (F-05 필터, API 10)
CREATE TABLE IF NOT EXISTS project_tech_stacks (
    project_id INT         NOT NULL,
    name       VARCHAR(50) NOT NULL,
    PRIMARY KEY (project_id, name),
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);
