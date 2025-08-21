const Joi = require('joi');

// 팀 생성 시 검증 스키마
const teamSchema = Joi.object({
    team_name: Joi.string().min(2).max(50).required()
        .messages({
            'string.empty': 'Team name is required',
            'string.min': 'Team name must be at least 2 characters',
            'string.max': 'Team name must not exceed 50 characters'
        }),
    
    full_name: Joi.string().min(2).max(100).required()
        .messages({
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 2 characters',
            'string.max': 'Full name must not exceed 100 characters'
        }),
    
    region: Joi.string().min(2).max(50).required()
        .messages({
            'string.empty': 'Region is required',
            'string.min': 'Region must be at least 2 characters',
            'string.max': 'Region must not exceed 50 characters'
        }),
    
    age_group: Joi.string().valid('U10', 'U12', 'U15', 'U16', 'U18', 'Senior').required()
        .messages({
            'any.only': 'Age group must be one of: U10, U12, U15, U16, U18, Senior',
            'any.required': 'Age group is required'
        }),
    
    home_venue: Joi.string().max(100).optional().allow(''),
    
    description: Joi.string().max(1000).optional().allow(''),
    
    coach: Joi.string().max(50).optional().allow(''),
    
    captain: Joi.string().max(50).optional().allow(''),
    
    founded: Joi.date().max('now').optional(),
    
    logo_url: Joi.string().uri().optional().allow(''),
    
    colors: Joi.array().items(Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/)).max(3).optional()
        .messages({
            'array.max': 'Maximum 3 colors allowed',
            'string.pattern.base': 'Colors must be valid hex codes (e.g., #FF0000)'
        })
});

// 팀 수정 시 검증 스키마 (모든 필드 선택적)
const teamUpdateSchema = Joi.object({
    team_name: Joi.string().min(2).max(50).optional(),
    full_name: Joi.string().min(2).max(100).optional(),
    region: Joi.string().min(2).max(50).optional(),
    age_group: Joi.string().valid('U10', 'U12', 'U15', 'U16', 'U18', 'Senior').optional(),
    home_venue: Joi.string().max(100).optional().allow(''),
    description: Joi.string().max(1000).optional().allow(''),
    coach: Joi.string().max(50).optional().allow(''),
    captain: Joi.string().max(50).optional().allow(''),
    founded: Joi.date().max('now').optional(),
    logo_url: Joi.string().uri().optional().allow(''),
    colors: Joi.array().items(Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/)).max(3).optional()
}).min(1); // 최소 1개 필드는 있어야 함

// 경기 생성 시 검증 스키마
const matchSchema = Joi.object({
    team1_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Team 1 ID must be a number',
            'number.positive': 'Team 1 ID must be positive',
            'any.required': 'Team 1 ID is required'
        }),
    
    team2_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Team 2 ID must be a number',
            'number.positive': 'Team 2 ID must be positive',
            'any.required': 'Team 2 ID is required'
        }),
    
    team1_score: Joi.number().integer().min(0).default(0),
    team2_score: Joi.number().integer().min(0).default(0),
    
    match_date: Joi.date().required()
        .messages({
            'date.base': 'Match date must be a valid date',
            'any.required': 'Match date is required'
        }),
    
    match_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
        .messages({
            'string.pattern.base': 'Match time must be in HH:MM format'
        }),
    
    venue: Joi.string().max(100).optional().allow(''),
    
    match_type: Joi.string().valid('regular', 'playoff', 'friendly').default('regular'),
    
    status: Joi.string().valid('scheduled', 'live', 'completed', 'cancelled').default('scheduled'),
    
    season: Joi.string().pattern(/^\d{4}$/).default('2024')
        .messages({
            'string.pattern.base': 'Season must be a 4-digit year'
        }),
    
    match_details: Joi.object().optional()
}).custom((value, helpers) => {
    // team1_id와 team2_id가 같으면 안됨
    if (value.team1_id === value.team2_id) {
        return helpers.error('custom.sameTeams');
    }
    return value;
}, 'Different teams validation').messages({
    'custom.sameTeams': 'Team 1 and Team 2 must be different'
});

// 검증 미들웨어 함수들
const validateTeam = (req, res, next) => {
    const { error, value } = teamSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorDetails = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorDetails
        });
    }
    
    req.body = value; // 검증된 데이터로 교체
    next();
};

const validateTeamUpdate = (req, res, next) => {
    const { error, value } = teamUpdateSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorDetails = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorDetails
        });
    }
    
    req.body = value;
    next();
};

const validateMatch = (req, res, next) => {
    const { error, value } = matchSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errorDetails = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorDetails
        });
    }
    
    req.body = value;
    next();
};

// 쿼리 파라미터 검증
const validateTeamQuery = (req, res, next) => {
    const querySchema = Joi.object({
        region: Joi.string().max(50).optional(),
        age_group: Joi.string().valid('U10', 'U12', 'U15', 'U16', 'U18', 'Senior').optional(),
        search: Joi.string().max(100).optional(),
        sort_by: Joi.string().valid('points', 'wins', 'win_rate', 'goals_for', 'team_name').default('points'),
        order_dir: Joi.string().valid('ASC', 'DESC').default('DESC'),
        limit: Joi.number().integer().min(1).max(100).default(20),
        offset: Joi.number().integer().min(0).default(0)
    });
    
    const { error, value } = querySchema.validate(req.query);
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid query parameters',
            error: error.details[0].message
        });
    }
    
    req.query = value;
    next();
};

module.exports = {
    validateTeam,
    validateTeamUpdate,
    validateMatch,
    validateTeamQuery,
    teamSchema,
    teamUpdateSchema,
    matchSchema
};
