-- Ice Hockey Statistics Database Schema
-- 아이스하키 통계 데이터베이스 스키마

-- 데이터베이스는 setup.js에서 생성됨

-- 팀 정보 테이블
CREATE TABLE teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    age_group VARCHAR(10) NOT NULL,
    home_venue VARCHAR(100),
    description TEXT,
    coach VARCHAR(50),
    captain VARCHAR(50),
    founded DATE,
    logo_url VARCHAR(255),
    colors JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_team_region (region),
    INDEX idx_team_age_group (age_group)
);

-- 선수 정보 테이블
CREATE TABLE players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    player_name VARCHAR(50) NOT NULL,
    position ENUM('goalkeeper', 'defender', 'forward', 'center') NOT NULL,
    jersey_number INT,
    birth_date DATE,
    nationality VARCHAR(50),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_jersey (team_id, jersey_number),
    INDEX idx_player_team (team_id),
    INDEX idx_player_position (position)
);

-- 경기 정보 테이블
CREATE TABLE matches (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    match_date DATE NOT NULL,
    match_time TIME,
    venue VARCHAR(100),
    match_type ENUM('regular', 'playoff', 'friendly') DEFAULT 'regular',
    status ENUM('scheduled', 'live', 'completed', 'cancelled') DEFAULT 'scheduled',
    season VARCHAR(10) DEFAULT '2024',
    match_details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (team1_id) REFERENCES teams(team_id),
    FOREIGN KEY (team2_id) REFERENCES teams(team_id),
    CHECK (team1_id != team2_id),
    INDEX idx_match_teams (team1_id, team2_id),
    INDEX idx_match_date (match_date),
    INDEX idx_match_season (season),
    INDEX idx_match_status (status)
);

-- 팀별 시즌 통계 테이블
CREATE TABLE team_stats (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    season VARCHAR(10) NOT NULL,
    total_matches INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    draws INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    goal_difference INT DEFAULT 0,
    points INT DEFAULT 0,
    additional_stats JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_season (team_id, season),
    INDEX idx_stats_season (season),
    INDEX idx_stats_points (points DESC)
);

-- 상대전적 통계 테이블 (H2H)
CREATE TABLE h2h_stats (
    h2h_id INT PRIMARY KEY AUTO_INCREMENT,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    team1_wins INT DEFAULT 0,
    team2_wins INT DEFAULT 0,
    draws INT DEFAULT 0,
    total_matches INT DEFAULT 0,
    team1_goals INT DEFAULT 0,
    team2_goals INT DEFAULT 0,
    recent_matches JSON, -- 최근 5경기 결과 저장
    last_match_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (team1_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (team2_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    UNIQUE KEY unique_h2h (team1_id, team2_id),
    CHECK (team1_id < team2_id), -- 중복 방지: 항상 작은 ID가 team1
    INDEX idx_h2h_teams (team1_id, team2_id),
    INDEX idx_h2h_last_match (last_match_date)
);

-- 선수별 경기 통계 테이블
CREATE TABLE player_stats (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    penalties INT DEFAULT 0,
    penalty_minutes INT DEFAULT 0,
    shots INT DEFAULT 0,
    saves INT DEFAULT 0,
    playing_time INT DEFAULT 0, -- 분 단위
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    UNIQUE KEY unique_player_match (player_id, match_id),
    INDEX idx_player_stats_match (match_id),
    INDEX idx_player_stats_player (player_id)
);

-- 시스템 설정 테이블
CREATE TABLE system_config (
    config_id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_config_key (config_key)
);

-- 초기 시스템 설정 데이터
INSERT INTO system_config (config_key, config_value, description) VALUES
('current_season', '2024', '현재 활성 시즌'),
('stats_last_updated', NOW(), '통계 마지막 업데이트 시간'),
('api_version', '1.0.0', 'API 버전'),
('maintenance_mode', 'false', '점검 모드 여부');
