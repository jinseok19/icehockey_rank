const { executeQuery } = require('../config/database');

// 시드 데이터 - 실제 프론트엔드 데이터와 일치
const seedData = {
    teams: [
        {
            team_name: '레오파즈',
            full_name: '서울 레오파즈',
            region: '서울',
            age_group: 'U15',
            home_venue: '서울 아이스링크',
            description: '서울 지역을 대표하는 강력한 U15 팀',
            coach: '김철수',
            captain: '박민수',
            founded: '2018-01-01',
            colors: JSON.stringify(['#2D6CF6', '#FFFFFF'])
        },
        {
            team_name: '타이거스',
            full_name: '부산 타이거스',
            region: '부산',
            age_group: 'U18',
            home_venue: '부산 아이스링크',
            description: '부산 지역 최고의 U18 팀으로 강력한 수비를 자랑',
            coach: '이영수',
            captain: '최준호',
            founded: '2016-01-01',
            colors: JSON.stringify(['#FF6B35', '#000000'])
        },
        {
            team_name: '이글스',
            full_name: '대구 이글스',
            region: '대구',
            age_group: 'U12',
            home_venue: '대구 아이스링크',
            description: '대구 지역의 유망한 U12 팀으로 빠른 성장세',
            coach: '박지성',
            captain: '김태현',
            founded: '2020-01-01',
            colors: JSON.stringify(['#20C997', '#FFFFFF'])
        },
        {
            team_name: '베어스',
            full_name: '인천 베어스',
            region: '인천',
            age_group: 'U15',
            home_venue: '인천 아이스링크',
            description: '인천 지역의 균형잡힌 U15 팀',
            coach: '정민호',
            captain: '이동현',
            founded: '2019-01-01',
            colors: JSON.stringify(['#8B4513', '#FFFFFF'])
        },
        {
            team_name: '샤크스',
            full_name: '울산 샤크스',
            region: '울산',
            age_group: 'U10',
            home_venue: '울산 아이스링크',
            description: '울산 지역의 젊은 U10 팀으로 기본기 중시',
            coach: '김수진',
            captain: '박소연',
            founded: '2021-01-01',
            colors: JSON.stringify(['#1E3A8A', '#FFFFFF'])
        },
        {
            team_name: '드래곤스',
            full_name: '광주 드래곤스',
            region: '광주',
            age_group: 'U18',
            home_venue: '광주 아이스링크',
            description: '광주 지역의 전통있는 U18 팀으로 강력한 공격력',
            coach: '최영철',
            captain: '김성민',
            founded: '2017-01-01',
            colors: JSON.stringify(['#DC2626', '#FFD700'])
        },
        {
            team_name: '라이온스',
            full_name: '대전 라이온스',
            region: '대전',
            age_group: 'U12',
            home_venue: '대전 아이스링크',
            description: '대전 지역의 새로운 U12 팀으로 기본기 중시',
            coach: '이민수',
            captain: '김준호',
            founded: '2022-01-01',
            colors: JSON.stringify(['#FFD700', '#000000'])
        },
        {
            team_name: '팔콘스',
            full_name: '제주 팔콘스',
            region: '제주',
            age_group: 'U15',
            home_venue: '제주 아이스링크',
            description: '제주 지역의 유일한 U15 팀으로 자연 친화적',
            coach: '박제주',
            captain: '김제주',
            founded: '2020-01-01',
            colors: JSON.stringify(['#059669', '#FFFFFF'])
        }
    ],
    
    // 샘플 경기 데이터 (최근 3개월)
    matches: [
        { team1_id: 1, team2_id: 4, team1_score: 3, team2_score: 2, match_date: '2024-12-01', status: 'completed' },
        { team1_id: 2, team2_id: 6, team1_score: 1, team2_score: 4, match_date: '2024-12-02', status: 'completed' },
        { team1_id: 3, team2_id: 7, team1_score: 2, team2_score: 2, match_date: '2024-12-03', status: 'completed' },
        { team1_id: 1, team2_id: 8, team1_score: 4, team2_score: 1, match_date: '2024-12-05', status: 'completed' },
        { team1_id: 4, team2_id: 2, team1_score: 0, team2_score: 3, match_date: '2024-12-07', status: 'completed' },
        { team1_id: 6, team2_id: 3, team1_score: 2, team2_score: 1, match_date: '2024-12-10', status: 'completed' },
        { team1_id: 5, team2_id: 7, team1_score: 1, team2_score: 1, match_date: '2024-12-12', status: 'completed' },
        { team1_id: 1, team2_id: 2, team1_score: 2, team2_score: 3, match_date: '2024-12-15', status: 'completed' },
        { team1_id: 4, team2_id: 6, team1_score: 1, team2_score: 2, match_date: '2024-12-18', status: 'completed' },
        { team1_id: 3, team2_id: 5, team1_score: 3, team2_score: 0, match_date: '2024-12-20', status: 'completed' },
        { team1_id: 8, team2_id: 7, team1_score: 2, team2_score: 1, match_date: '2024-12-22', status: 'completed' },
        { team1_id: 1, team2_id: 6, team1_score: 1, team2_score: 1, match_date: '2024-12-25', status: 'completed' }
    ]
};

// 팀 데이터 삽입
const seedTeams = async () => {
    try {
        console.log('🌱 Seeding teams...');
        
        for (const team of seedData.teams) {
            const query = `
                INSERT INTO teams (
                    team_name, full_name, region, age_group, home_venue, 
                    description, coach, captain, founded, colors
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                team.team_name, team.full_name, team.region, team.age_group,
                team.home_venue, team.description, team.coach, team.captain,
                team.founded, team.colors
            ];
            
            await executeQuery(query, values);
        }
        
        console.log('✅ Teams seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding teams:', error.message);
        throw error;
    }
};

// 경기 데이터 삽입
const seedMatches = async () => {
    try {
        console.log('🌱 Seeding matches...');
        
        for (const match of seedData.matches) {
            const query = `
                INSERT INTO matches (
                    team1_id, team2_id, team1_score, team2_score, 
                    match_date, status, season
                ) VALUES (?, ?, ?, ?, ?, ?, '2024')
            `;
            
            const values = [
                match.team1_id, match.team2_id, match.team1_score, 
                match.team2_score, match.match_date, match.status
            ];
            
            await executeQuery(query, values);
        }
        
        console.log('✅ Matches seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding matches:', error.message);
        throw error;
    }
};

// 팀 통계 계산 및 삽입
const calculateAndSeedTeamStats = async () => {
    try {
        console.log('🌱 Calculating and seeding team stats...');
        
        // 각 팀의 통계 계산
        const teams = await executeQuery('SELECT team_id FROM teams');
        
        for (const team of teams) {
            const { team_id } = team;
            
            // 홈경기 통계
            const homeStats = await executeQuery(`
                SELECT 
                    COUNT(*) as total_home,
                    SUM(CASE WHEN team1_score > team2_score THEN 1 ELSE 0 END) as home_wins,
                    SUM(CASE WHEN team1_score < team2_score THEN 1 ELSE 0 END) as home_losses,
                    SUM(CASE WHEN team1_score = team2_score THEN 1 ELSE 0 END) as home_draws,
                    SUM(team1_score) as home_goals_for,
                    SUM(team2_score) as home_goals_against
                FROM matches 
                WHERE team1_id = ? AND status = 'completed'
            `, [team_id]);
            
            // 원정경기 통계
            const awayStats = await executeQuery(`
                SELECT 
                    COUNT(*) as total_away,
                    SUM(CASE WHEN team2_score > team1_score THEN 1 ELSE 0 END) as away_wins,
                    SUM(CASE WHEN team2_score < team1_score THEN 1 ELSE 0 END) as away_losses,
                    SUM(CASE WHEN team2_score = team1_score THEN 1 ELSE 0 END) as away_draws,
                    SUM(team2_score) as away_goals_for,
                    SUM(team1_score) as away_goals_against
                FROM matches 
                WHERE team2_id = ? AND status = 'completed'
            `, [team_id]);
            
            // 전체 통계 합계
            const home = homeStats[0];
            const away = awayStats[0];
            
            const totalMatches = (home.total_home || 0) + (away.total_away || 0);
            const wins = (home.home_wins || 0) + (away.away_wins || 0);
            const losses = (home.home_losses || 0) + (away.away_losses || 0);
            const draws = (home.home_draws || 0) + (away.away_draws || 0);
            const goalsFor = (home.home_goals_for || 0) + (away.away_goals_for || 0);
            const goalsAgainst = (home.home_goals_against || 0) + (away.away_goals_against || 0);
            const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(2) : 0;
            const goalDifference = goalsFor - goalsAgainst;
            const points = (wins * 3) + (draws * 1); // 승점 계산 (승리 3점, 무승부 1점)
            
            // 팀 통계 삽입
            await executeQuery(`
                INSERT INTO team_stats (
                    team_id, season, total_matches, wins, losses, draws,
                    goals_for, goals_against, win_rate, goal_difference, points
                ) VALUES (?, '2024', ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    total_matches = VALUES(total_matches),
                    wins = VALUES(wins),
                    losses = VALUES(losses),
                    draws = VALUES(draws),
                    goals_for = VALUES(goals_for),
                    goals_against = VALUES(goals_against),
                    win_rate = VALUES(win_rate),
                    goal_difference = VALUES(goal_difference),
                    points = VALUES(points)
            `, [team_id, totalMatches, wins, losses, draws, goalsFor, goalsAgainst, winRate, goalDifference, points]);
        }
        
        console.log('✅ Team stats calculated and seeded successfully');
    } catch (error) {
        console.error('❌ Error calculating team stats:', error.message);
        throw error;
    }
};

// H2H 통계 계산 및 삽입
const calculateAndSeedH2HStats = async () => {
    try {
        console.log('🌱 Calculating and seeding H2H stats...');
        
        // 모든 팀 조합 가져오기
        const teams = await executeQuery('SELECT team_id FROM teams ORDER BY team_id');
        
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                const team1_id = teams[i].team_id;
                const team2_id = teams[j].team_id;
                
                // 두 팀 간의 모든 경기 조회
                const matches = await executeQuery(`
                    SELECT team1_id, team2_id, team1_score, team2_score, match_date
                    FROM matches 
                    WHERE ((team1_id = ? AND team2_id = ?) OR (team1_id = ? AND team2_id = ?))
                    AND status = 'completed'
                    ORDER BY match_date DESC
                `, [team1_id, team2_id, team2_id, team1_id]);
                
                if (matches.length > 0) {
                    let team1_wins = 0, team2_wins = 0, draws = 0;
                    let team1_goals = 0, team2_goals = 0;
                    const recentMatches = [];
                    
                    matches.forEach((match, index) => {
                        // 팀1 관점에서 결과 계산
                        let result, score1, score2;
                        
                        if (match.team1_id === team1_id) {
                            score1 = match.team1_score;
                            score2 = match.team2_score;
                        } else {
                            score1 = match.team2_score;
                            score2 = match.team1_score;
                        }
                        
                        if (score1 > score2) {
                            team1_wins++;
                            result = 'W';
                        } else if (score1 < score2) {
                            team2_wins++;
                            result = 'L';
                        } else {
                            draws++;
                            result = 'D';
                        }
                        
                        team1_goals += score1;
                        team2_goals += score2;
                        
                        // 최근 5경기만 저장
                        if (index < 5) {
                            recentMatches.push({
                                date: match.match_date,
                                score: `${score1}:${score2}`,
                                result: result
                            });
                        }
                    });
                    
                    // H2H 통계 삽입
                    await executeQuery(`
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
                    `, [
                        team1_id, team2_id, team1_wins, team2_wins, draws,
                        matches.length, team1_goals, team2_goals, 
                        JSON.stringify(recentMatches), matches[0].match_date
                    ]);
                }
            }
        }
        
        console.log('✅ H2H stats calculated and seeded successfully');
    } catch (error) {
        console.error('❌ Error calculating H2H stats:', error.message);
        throw error;
    }
};

// 전체 시딩 실행
const runSeed = async () => {
    try {
        console.log('🚀 Starting database seeding...');
        
        await seedTeams();
        await seedMatches();
        await calculateAndSeedTeamStats();
        await calculateAndSeedH2HStats();
        
        console.log('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('💥 Database seeding failed:', error.message);
        process.exit(1);
    }
};

// 스크립트 직접 실행 시
if (require.main === module) {
    runSeed();
}

module.exports = {
    seedTeams,
    seedMatches,
    calculateAndSeedTeamStats,
    calculateAndSeedH2HStats,
    runSeed
};
