const express = require('express');
const router = express.Router();
const H2H = require('../models/H2H');
const Team = require('../models/Team');

// GET /api/h2h/:team1Id/:team2Id - 두 팀 간 상대전적 조회
router.get('/:team1Id/:team2Id', async (req, res) => {
    try {
        const team1Id = parseInt(req.params.team1Id);
        const team2Id = parseInt(req.params.team2Id);
        
        if (isNaN(team1Id) || isNaN(team2Id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team IDs'
            });
        }

        if (team1Id === team2Id) {
            return res.status(400).json({
                success: false,
                message: 'Team IDs must be different'
            });
        }

        // 두 팀이 존재하는지 확인
        const [team1, team2] = await Promise.all([
            Team.findById(team1Id),
            Team.findById(team2Id)
        ]);

        if (!team1 || !team2) {
            return res.status(404).json({
                success: false,
                message: 'One or both teams not found'
            });
        }

        // H2H 데이터 조회
        let h2h = await H2H.findByTeams(team1Id, team2Id);
        
        // H2H 데이터가 없으면 생성
        if (!h2h) {
            h2h = await H2H.createOrUpdate(team1Id, team2Id);
            
            if (!h2h) {
                return res.json({
                    success: true,
                    data: {
                        team1: team1.toJSON(),
                        team2: team2.toJSON(),
                        totalMatches: 0,
                        team1Wins: 0,
                        team2Wins: 0,
                        draws: 0,
                        team1Goals: 0,
                        team2Goals: 0,
                        recentMatches: [],
                        lastMatchDate: null
                    },
                    message: 'No matches found between these teams'
                });
            }
        }

        // 경기 기록도 함께 조회
        const matchHistory = await H2H.getMatchHistory(team1Id, team2Id, 10);

        res.json({
            success: true,
            data: {
                ...h2h.toJSON(),
                matchHistory: matchHistory.map(match => ({
                    matchId: match.match_id,
                    date: match.match_date,
                    team1: {
                        id: match.team1_id,
                        name: match.team1_name,
                        score: match.team1_score
                    },
                    team2: {
                        id: match.team2_id,
                        name: match.team2_name,
                        score: match.team2_score
                    },
                    venue: match.venue,
                    status: match.status
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching H2H data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch H2H data',
            error: error.message
        });
    }
});

// GET /api/h2h/:teamId - 특정 팀의 모든 상대전적 조회
router.get('/:teamId', async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        
        if (isNaN(teamId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team ID'
            });
        }

        // 팀이 존재하는지 확인
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // 해당 팀의 모든 H2H 데이터 조회
        const h2hList = await H2H.findByTeam(teamId);
        
        res.json({
            success: true,
            data: {
                team: team.toJSON(),
                opponents: h2hList.map(h2h => {
                    const opponent = h2h.team1_id === teamId ? 
                        {
                            id: h2h.team2_id,
                            name: h2h.team2_name,
                            fullName: h2h.team2_full_name,
                            colors: h2h.team2_colors,
                            wins: h2h.team2_wins,
                            goals: h2h.team2_goals
                        } : 
                        {
                            id: h2h.team1_id,
                            name: h2h.team1_name,
                            fullName: h2h.team1_full_name,
                            colors: h2h.team1_colors,
                            wins: h2h.team1_wins,
                            goals: h2h.team1_goals
                        };

                    const myWins = h2h.team1_id === teamId ? h2h.team1_wins : h2h.team2_wins;
                    const myGoals = h2h.team1_id === teamId ? h2h.team1_goals : h2h.team2_goals;
                    
                    return {
                        opponent,
                        myWins,
                        opponentWins: opponent.wins,
                        draws: h2h.draws,
                        totalMatches: h2h.total_matches,
                        myGoals,
                        opponentGoals: opponent.goals,
                        winRate: h2h.total_matches > 0 ? ((myWins / h2h.total_matches) * 100).toFixed(1) : 0,
                        recentMatches: h2h.recent_matches || [],
                        lastMatchDate: h2h.last_match_date
                    };
                })
            },
            total: h2hList.length
        });
    } catch (error) {
        console.error('Error fetching team H2H data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team H2H data',
            error: error.message
        });
    }
});

// POST /api/h2h/calculate - H2H 통계 재계산 (관리자 기능)
router.post('/calculate', async (req, res) => {
    try {
        const { team1Id, team2Id } = req.body;
        
        if (!team1Id || !team2Id) {
            return res.status(400).json({
                success: false,
                message: 'Both team IDs are required'
            });
        }

        if (team1Id === team2Id) {
            return res.status(400).json({
                success: false,
                message: 'Team IDs must be different'
            });
        }

        // H2H 통계 재계산
        const h2h = await H2H.createOrUpdate(team1Id, team2Id);
        
        if (!h2h) {
            return res.json({
                success: true,
                message: 'No matches found between these teams',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'H2H statistics recalculated successfully',
            data: h2h.toJSON()
        });
    } catch (error) {
        console.error('Error recalculating H2H data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to recalculate H2H data',
            error: error.message
        });
    }
});

// POST /api/h2h/calculate-all - 모든 H2H 통계 재계산 (관리자 기능)
router.post('/calculate-all', async (req, res) => {
    try {
        // 모든 팀 조회
        const teams = await Team.findAll();
        let calculatedCount = 0;

        // 모든 팀 조합에 대해 H2H 계산
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                try {
                    await H2H.createOrUpdate(teams[i].team_id, teams[j].team_id);
                    calculatedCount++;
                } catch (error) {
                    console.error(`Error calculating H2H for teams ${teams[i].team_id} and ${teams[j].team_id}:`, error);
                }
            }
        }

        res.json({
            success: true,
            message: `H2H statistics recalculated for ${calculatedCount} team pairs`,
            totalTeams: teams.length,
            calculatedPairs: calculatedCount
        });
    } catch (error) {
        console.error('Error recalculating all H2H data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to recalculate all H2H data',
            error: error.message
        });
    }
});

module.exports = router;
