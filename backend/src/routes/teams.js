const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { validateTeam, validateTeamUpdate } = require('../middleware/validation');

// GET /api/teams - 모든 팀 조회
router.get('/', async (req, res) => {
    try {
        const filters = {
            region: req.query.region,
            age_group: req.query.age_group,
            search: req.query.search,
            sort_by: req.query.sort_by || 'points',
            order_dir: req.query.order_dir || 'DESC'
        };

        const teams = await Team.findAll(filters);
        
        res.json({
            success: true,
            data: teams,
            total: teams.length,
            filters: filters
        });
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teams',
            error: error.message
        });
    }
});

// GET /api/teams/ranking - 팀 순위 조회
router.get('/ranking', async (req, res) => {
    try {
        const season = req.query.season || '2024';
        const ranking = await Team.getRanking(season);
        
        res.json({
            success: true,
            data: ranking,
            season: season
        });
    } catch (error) {
        console.error('Error fetching ranking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ranking',
            error: error.message
        });
    }
});

// GET /api/teams/:id - 특정 팀 상세 조회
router.get('/:id', async (req, res) => {
    try {
        const teamId = parseInt(req.params.id);
        
        if (isNaN(teamId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team ID'
            });
        }

        const team = await Team.findById(teamId);
        
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.json({
            success: true,
            data: team
        });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team',
            error: error.message
        });
    }
});

// GET /api/teams/:id/matches - 팀의 최근 경기 조회
router.get('/:id/matches', async (req, res) => {
    try {
        const teamId = parseInt(req.params.id);
        const limit = parseInt(req.query.limit) || 5;
        
        if (isNaN(teamId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team ID'
            });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const matches = await team.getRecentMatches(limit);
        
        res.json({
            success: true,
            data: matches,
            team: {
                id: team.team_id,
                name: team.team_name,
                fullName: team.full_name
            }
        });
    } catch (error) {
        console.error('Error fetching team matches:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team matches',
            error: error.message
        });
    }
});

// POST /api/teams - 새 팀 생성 (관리자 기능)
router.post('/', validateTeam, async (req, res) => {
    try {
        const team = await Team.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            data: team
        });
    } catch (error) {
        console.error('Error creating team:', error);
        
        // 중복 팀명 에러
        if (error.message.includes('Duplicate entry')) {
            return res.status(409).json({
                success: false,
                message: 'Team name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create team',
            error: error.message
        });
    }
});

// PUT /api/teams/:id - 팀 정보 수정
router.put('/:id', validateTeamUpdate, async (req, res) => {
    try {
        const teamId = parseInt(req.params.id);
        
        if (isNaN(teamId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team ID'
            });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const updatedTeam = await team.update(req.body);
        
        res.json({
            success: true,
            message: 'Team updated successfully',
            data: updatedTeam
        });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update team',
            error: error.message
        });
    }
});

// DELETE /api/teams/:id - 팀 삭제
router.delete('/:id', async (req, res) => {
    try {
        const teamId = parseInt(req.params.id);
        
        if (isNaN(teamId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team ID'
            });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        await team.delete();
        
        res.json({
            success: true,
            message: 'Team deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete team',
            error: error.message
        });
    }
});

module.exports = router;
