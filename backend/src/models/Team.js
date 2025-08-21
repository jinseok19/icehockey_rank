const { executeQuery } = require('../config/database');

class Team {
    constructor(data) {
        this.team_id = data.team_id;
        this.team_name = data.team_name;
        this.full_name = data.full_name;
        this.region = data.region;
        this.age_group = data.age_group;
        this.home_venue = data.home_venue;
        this.description = data.description;
        this.coach = data.coach;
        this.captain = data.captain;
        this.founded = data.founded;
        this.logo_url = data.logo_url;
        this.colors = data.colors;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // 모든 팀 조회
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT t.*, ts.total_matches, ts.wins, ts.losses, ts.draws,
                       ts.goals_for, ts.goals_against, ts.win_rate, ts.points
                FROM teams t
                LEFT JOIN team_stats ts ON t.team_id = ts.team_id AND ts.season = '2024'
            `;
            let params = [];
            let conditions = [];

            // 필터 조건 추가
            if (filters.region) {
                conditions.push('t.region = ?');
                params.push(filters.region);
            }

            if (filters.age_group) {
                conditions.push('t.age_group = ?');
                params.push(filters.age_group);
            }

            if (filters.search) {
                conditions.push('(t.team_name LIKE ? OR t.full_name LIKE ?)');
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            // 정렬
            const orderBy = filters.sort_by || 'points';
            const orderDir = filters.order_dir || 'DESC';
            query += ` ORDER BY ts.${orderBy} ${orderDir}, t.team_name ASC`;

            const rows = await executeQuery(query, params);
            return rows.map(row => {
                // colors가 JSON 문자열인 경우 파싱
                if (typeof row.colors === 'string') {
                    try {
                        row.colors = JSON.parse(row.colors);
                    } catch (e) {
                        row.colors = null;
                    }
                }
                return new Team(row);
            });
        } catch (error) {
            throw new Error(`Error fetching teams: ${error.message}`);
        }
    }

    // ID로 팀 조회
    static async findById(teamId) {
        try {
            const query = `
                SELECT t.*, ts.total_matches, ts.wins, ts.losses, ts.draws,
                       ts.goals_for, ts.goals_against, ts.win_rate, ts.points,
                       ts.goal_difference
                FROM teams t
                LEFT JOIN team_stats ts ON t.team_id = ts.team_id AND ts.season = '2024'
                WHERE t.team_id = ?
            `;
            
            const rows = await executeQuery(query, [teamId]);
            
            if (rows.length === 0) {
                return null;
            }

            const teamData = rows[0];
            
            // colors 파싱
            if (typeof teamData.colors === 'string') {
                try {
                    teamData.colors = JSON.parse(teamData.colors);
                } catch (e) {
                    teamData.colors = null;
                }
            }

            return new Team(teamData);
        } catch (error) {
            throw new Error(`Error fetching team by ID: ${error.message}`);
        }
    }

    // 팀 이름으로 조회
    static async findByName(teamName) {
        try {
            const query = `
                SELECT t.*, ts.total_matches, ts.wins, ts.losses, ts.draws,
                       ts.goals_for, ts.goals_against, ts.win_rate, ts.points
                FROM teams t
                LEFT JOIN team_stats ts ON t.team_id = ts.team_id AND ts.season = '2024'
                WHERE t.team_name = ?
            `;
            
            const rows = await executeQuery(query, [teamName]);
            
            if (rows.length === 0) {
                return null;
            }

            const teamData = rows[0];
            if (typeof teamData.colors === 'string') {
                try {
                    teamData.colors = JSON.parse(teamData.colors);
                } catch (e) {
                    teamData.colors = null;
                }
            }

            return new Team(teamData);
        } catch (error) {
            throw new Error(`Error fetching team by name: ${error.message}`);
        }
    }

    // 팀 생성
    static async create(teamData) {
        try {
            const query = `
                INSERT INTO teams (
                    team_name, full_name, region, age_group, home_venue,
                    description, coach, captain, founded, logo_url, colors
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const colors = teamData.colors ? JSON.stringify(teamData.colors) : null;
            
            const values = [
                teamData.team_name,
                teamData.full_name,
                teamData.region,
                teamData.age_group,
                teamData.home_venue,
                teamData.description,
                teamData.coach,
                teamData.captain,
                teamData.founded,
                teamData.logo_url,
                colors
            ];

            const result = await executeQuery(query, values);
            
            // 생성된 팀 반환
            return await Team.findById(result.insertId);
        } catch (error) {
            throw new Error(`Error creating team: ${error.message}`);
        }
    }

    // 팀 수정
    async update(updateData) {
        try {
            const fields = [];
            const values = [];

            // 업데이트할 필드만 동적으로 추가
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined && key !== 'team_id') {
                    fields.push(`${key} = ?`);
                    if (key === 'colors' && typeof updateData[key] === 'object') {
                        values.push(JSON.stringify(updateData[key]));
                    } else {
                        values.push(updateData[key]);
                    }
                }
            });

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(this.team_id);

            const query = `UPDATE teams SET ${fields.join(', ')} WHERE team_id = ?`;
            await executeQuery(query, values);

            // 업데이트된 팀 정보 반환
            return await Team.findById(this.team_id);
        } catch (error) {
            throw new Error(`Error updating team: ${error.message}`);
        }
    }

    // 팀 삭제
    async delete() {
        try {
            const query = 'DELETE FROM teams WHERE team_id = ?';
            await executeQuery(query, [this.team_id]);
            return true;
        } catch (error) {
            throw new Error(`Error deleting team: ${error.message}`);
        }
    }

    // 팀의 최근 경기 조회
    async getRecentMatches(limit = 5) {
        try {
            const query = `
                SELECT m.*, 
                       t1.team_name as team1_name, t1.full_name as team1_full_name,
                       t2.team_name as team2_name, t2.full_name as team2_full_name
                FROM matches m
                JOIN teams t1 ON m.team1_id = t1.team_id
                JOIN teams t2 ON m.team2_id = t2.team_id
                WHERE (m.team1_id = ? OR m.team2_id = ?) AND m.status = 'completed'
                ORDER BY m.match_date DESC, m.match_id DESC
                LIMIT ?
            `;

            return await executeQuery(query, [this.team_id, this.team_id, limit]);
        } catch (error) {
            throw new Error(`Error fetching recent matches: ${error.message}`);
        }
    }

    // 팀 순위 조회
    static async getRanking(season = '2024') {
        try {
            const query = `
                SELECT t.team_id, t.team_name, t.full_name, t.region, t.age_group,
                       ts.total_matches, ts.wins, ts.losses, ts.draws,
                       ts.goals_for, ts.goals_against, ts.win_rate, ts.points,
                       ts.goal_difference,
                       RANK() OVER (ORDER BY ts.points DESC, ts.goal_difference DESC, ts.goals_for DESC) as rank_position
                FROM teams t
                LEFT JOIN team_stats ts ON t.team_id = ts.team_id AND ts.season = ?
                ORDER BY ts.points DESC, ts.goal_difference DESC, ts.goals_for DESC
            `;

            return await executeQuery(query, [season]);
        } catch (error) {
            throw new Error(`Error fetching team ranking: ${error.message}`);
        }
    }

    // JSON 직렬화 시 반환할 데이터
    toJSON() {
        return {
            id: this.team_id,
            name: this.team_name,
            fullName: this.full_name,
            region: this.region,
            ageGroup: this.age_group,
            homeVenue: this.home_venue,
            description: this.description,
            coach: this.coach,
            captain: this.captain,
            founded: this.founded,
            logoUrl: this.logo_url,
            colors: this.colors,
            // 통계 정보 (있는 경우)
            totalMatches: this.total_matches || 0,
            wins: this.wins || 0,
            losses: this.losses || 0,
            draws: this.draws || 0,
            goalsFor: this.goals_for || 0,
            goalsAgainst: this.goals_against || 0,
            winRate: this.win_rate || 0,
            points: this.points || 0,
            goalDifference: this.goal_difference || 0,
            createdAt: this.created_at,
            updatedAt: this.updated_at
        };
    }
}

module.exports = Team;
