CREATE DATABASE IF NOT EXISTS daema_archive DEFAULT CHARACTER SET utf8mb4;
USE daema_archive;

-- 컬럼은 snake_case → 조회 결과가 그대로 JSON 규칙(snake_case)과 맞음
CREATE TABLE IF NOT EXISTS projects (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    demo_url    VARCHAR(500),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
