const { executeQuery } = require('../config/database');

class H2H {
    constructor(data) {
        this.h2h_id = data.h2h_id;
        this.team1_id = data.team1_id;
        this.team2_id = data.team2_id;
        this.team1_wins = data.team1_wins || 0;
        this.team2_wins = data.team2_wins || 0;
        this.draws = data.draws || 0;
        this.total_matches = data.total_matches || 0;
        this.team1_goals = data.team1_goals || 0;
        this.team2_goals = data.team2_goals || 0;
        this.recent_matches = data.recent_matches;
        this.last_match_date = data.last_match_date;
        this.updated_at = data.updated_at;
    }

    // 두 팀 간 H2H 조회
    static async findByTeams(team1Id, team2Id) {
        try {
            // 항상 작은 ID가 team1이 되도록 정렬
            const [smallerId, largerId] = team1Id < team2Id ? [team1Id, team2Id] : [team2Id, team1Id];
            
            const query = `
                SELECT h.*, 
                       t1.team_name as team1_name, t1.full_name as team1_full_name, t1.colors as team1_colors,
                       t2.team_name as team2_name, t2.full_name as team2_full_name, t2.colors as team2_colors
                FROM h2h_stats h
                JOIN teams t1 ON h.team1_id = t1.team_id
                JOIN teams t2 ON h.team2_id = t2.team_id
                WHERE h.team1_id = ? AND h.team2_id = ?
            `;

            const rows = await executeQuery(query, [smallerId, largerId]);
            
            if (rows.length === 0) {
                return null;
            }

            const h2hData = rows[0];
            
            // recent_matches 파싱
            if (typeof h2hData.recent_matches === 'string') {
                try {
                    h2hData.recent_matches = JSON.parse(h2hData.recent_matches);
                } catch (e) {
                    h2hData.recent_matches = [];
                }
            }

            // team colors 파싱
            ['team1_colors', 'team2_colors'].forEach(key => {
                if (typeof h2hData[key] === 'string') {
                    try {
                        h2hData[key] = JSON.parse(h2hData[key]);
                    } catch (e) {
                        h2hData[key] = null;
                    }
                }
            });

            const h2h = new H2H(h2hData);
            
            // 요청된 팀 순서가 반대인 경우 결과 조정
            if (team1Id !== smallerId) {
                h2h.flipResults();
            }

            // 팀 정보 추가
            h2h.team1_name = h2hData.team1_name;
            h2h.team1_full_name = h2hData.team1_full_name;
            h2h.team1_colors = h2hData.team1_colors;
            h2h.team2_name = h2hData.team2_name;
            h2h.team2_full_name = h2hData.team2_full_name;
            h2h.team2_colors = h2hData.team2_colors;

            return h2h;
        } catch (error) {
            throw new Error(`Error fetching H2H data: ${error.message}`);
        }
    }

    // 특정 팀의 모든 H2H 조회
    static async findByTeam(teamId) {
        try {
            const query = `
                SELECT h.*, 
                       t1.team_name as team1_name, t1.full_name as team1_full_name, t1.colors as team1_colors,
                       t2.team_name as team2_name, t2.full_name as team2_full_name, t2.colors as team2_colors
                FROM h2h_stats h
                JOIN teams t1 ON h.team1_id = t1.team_id
                JOIN teams t2 ON h.team2_id = t2.team_id
                WHERE h.team1_id = ? OR h.team2_id = ?
                ORDER BY h.total_matches DESC, h.last_match_date DESC
            `;

            const rows = await executeQuery(query, [teamId, teamId]);
            
            return rows.map(row => {
                // JSON 파싱
                if (typeof row.recent_matches === 'string') {
                    try {
                        row.recent_matches = JSON.parse(row.recent_matches);
                    } catch (e) {
                        row.recent_matches = [];
                    }
                }

                ['team1_colors', 'team2_colors'].forEach(key => {
                    if (typeof row[key] === 'string') {
                        try {
                            row[key] = JSON.parse(row[key]);
                        } catch (e) {
                            row[key] = null;
                        }
                    }
                });

                const h2h = new H2H(row);
                
                // 요청 팀이 team2인 경우 결과 뒤집기
                if (row.team2_id === teamId) {
                    h2h.flipResults();
                }

                // 팀 정보 추가
                h2h.team1_name = row.team1_name;
                h2h.team1_full_name = row.team1_full_name;
                h2h.team1_colors = row.team1_colors;
                h2h.team2_name = row.team2_name;
                h2h.team2_full_name = row.team2_full_name;
                h2h.team2_colors = row.team2_colors;

                return h2h;
            });
        } catch (error) {
            throw new Error(`Error fetching H2H data for team: ${error.message}`);
        }
    }

    // 두 팀 간 상세 경기 기록 조회
    static async getMatchHistory(team1Id, team2Id, limit = 10) {
        try {
            const query = `
                SELECT m.*, 
                       t1.team_name as team1_name, t1.full_name as team1_full_name,
                       t2.team_name as team2_name, t2.full_name as team2_full_name
                FROM matches m
                JOIN teams t1 ON m.team1_id = t1.team_id
                JOIN teams t2 ON m.team2_id = t2.team_id
                WHERE ((m.team1_id = ? AND m.team2_id = ?) OR (m.team1_id = ? AND m.team2_id = ?))
                AND m.status = 'completed'
                ORDER BY m.match_date DESC, m.match_id DESC
                LIMIT ?
            `;

            return await executeQuery(query, [team1Id, team2Id, team2Id, team1Id, limit]);
        } catch (error) {
            throw new Error(`Error fetching match history: ${error.message}`);
        }
    }

    // H2H 통계 생성 또는 업데이트
    static async createOrUpdate(team1Id, team2Id) {
        try {
            // 항상 작은 ID가 team1이 되도록 정렬
            const [smallerId, largerId] = team1Id < team2Id ? [team1Id, team2Id] : [team2Id, team1Id];
            
            // 두 팀 간의 모든 경기 조회
            const matches = await H2H.getMatchHistory(smallerId, largerId, 100);
            
            if (matches.length === 0) {
                return null;
            }

            let team1_wins = 0, team2_wins = 0, draws = 0;
            let team1_goals = 0, team2_goals = 0;
            const recentMatches = [];

            matches.forEach((match, index) => {
                // smallerId 팀 관점에서 결과 계산
                let score1, score2;
                
                if (match.team1_id === smallerId) {
                    score1 = match.team1_score;
                    score2 = match.team2_score;
                } else {
                    score1 = match.team2_score;
                    score2 = match.team1_score;
                }

                if (score1 > score2) {
                    team1_wins++;
                } else if (score1 < score2) {
                    team2_wins++;
                } else {
                    draws++;
                }

                team1_goals += score1;
                team2_goals += score2;

                // 최근 5경기만 저장
                if (index < 5) {
                    recentMatches.push({
                        date: match.match_date,
                        team1Score: score1,
                        team2Score: score2,
                        result: score1 > score2 ? 'W' : score1 < score2 ? 'L' : 'D'
                    });
                }
            });

            // H2H 통계 삽입 또는 업데이트
            const query = `
                INSERT INTO h2h_stats (
                    team1_id, team2_id, team1_wins, team2_wins, draws,
                    total_matches, team1_goals, team2_goals, recent_matches, last_match_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    team1_wins = VALUES(team1_wins),
                    team2_wins = VALUES(team2_wins),
                    draws = VALUES(draws),
                    total_matches = VALUES(total_matches),
                    team1_goals = VALUES(team1_goals),
                    team2_goals = VALUES(team2_goals),
                    recent_matches = VALUES(recent_matches),
                    last_match_date = VALUES(last_match_date)
            `;

            await executeQuery(query, [
                smallerId, largerId, team1_wins, team2_wins, draws,
                matches.length, team1_goals, team2_goals,
                JSON.stringify(recentMatches), matches[0].match_date
            ]);

            return await H2H.findByTeams(team1Id, team2Id);
        } catch (error) {
            throw new Error(`Error creating/updating H2H stats: ${error.message}`);
        }
    }

    // 결과 뒤집기 (team1과 team2 순서가 바뀔 때)
    flipResults() {
        [this.team1_wins, this.team2_wins] = [this.team2_wins, this.team1_wins];
        [this.team1_goals, this.team2_goals] = [this.team2_goals, this.team1_goals];
        
        // recent_matches의 결과도 뒤집기
        if (this.recent_matches && Array.isArray(this.recent_matches)) {
            this.recent_matches = this.recent_matches.map(match => ({
                ...match,
                team1Score: match.team2Score,
                team2Score: match.team1Score,
                result: match.result === 'W' ? 'L' : match.result === 'L' ? 'W' : 'D'
            }));
        }
    }

    // JSON 직렬화
    toJSON() {
        return {
            id: this.h2h_id,
            team1: {
                id: this.team1_id,
                name: this.team1_name,
                fullName: this.team1_full_name,
                colors: this.team1_colors,
                wins: this.team1_wins,
                goals: this.team1_goals
            },
            team2: {
                id: this.team2_id,
                name: this.team2_name,
                fullName: this.team2_full_name,
                colors: this.team2_colors,
                wins: this.team2_wins,
                goals: this.team2_goals
            },
            totalMatches: this.total_matches,
            draws: this.draws,
            recentMatches: this.recent_matches || [],
            lastMatchDate: this.last_match_date,
            updatedAt: this.updated_at
        };
    }
}

module.exports = H2H;
