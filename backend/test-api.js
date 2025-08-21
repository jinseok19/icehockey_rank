#!/usr/bin/env node

const fetch = require('node-fetch');
require('dotenv').config();

const API_BASE = `http://localhost:${process.env.PORT || 3001}/api`;

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

// API 요청 헬퍼
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE}${endpoint}`;
        console.log(`📡 ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log(`   ${colors.green}Status: ${response.status}${colors.reset}`);
            return { success: true, data, status: response.status };
        } else {
            console.log(`   ${colors.red}Status: ${response.status}${colors.reset}`);
            return { success: false, data, status: response.status };
        }
    } catch (error) {
        console.log(`   ${colors.red}Error: ${error.message}${colors.reset}`);
        return { success: false, error: error.message };
    }
}

// 테스트 함수들
const tests = {
    // 서버 헬스 체크
    async testHealth() {
        log.title('🏥 서버 헬스 체크');
        const result = await apiRequest('/health');
        
        if (result.success) {
            log.success('서버가 정상적으로 실행 중입니다');
            console.log(`   시간: ${result.data.timestamp}`);
            console.log(`   버전: ${result.data.version}`);
        } else {
            log.error('서버 헬스 체크 실패');
        }
        
        return result.success;
    },

    // Teams API 테스트
    async testTeamsAPI() {
        log.title('🏒 Teams API 테스트');
        let passed = 0;
        let total = 0;

        // 1. 모든 팀 조회
        total++;
        console.log('\n1. 모든 팀 조회');
        const allTeams = await apiRequest('/teams');
        if (allTeams.success) {
            log.success(`${allTeams.data.data.length}개 팀 조회 성공`);
            passed++;
        } else {
            log.error('팀 목록 조회 실패');
        }

        // 2. 특정 팀 조회
        total++;
        console.log('\n2. 특정 팀 조회 (ID: 1)');
        const team = await apiRequest('/teams/1');
        if (team.success) {
            log.success(`팀 상세 정보 조회 성공: ${team.data.data.name}`);
            passed++;
        } else {
            log.error('팀 상세 정보 조회 실패');
        }

        // 3. 팀 순위 조회
        total++;
        console.log('\n3. 팀 순위 조회');
        const ranking = await apiRequest('/teams/ranking');
        if (ranking.success) {
            log.success(`팀 순위 조회 성공: ${ranking.data.data.length}개 팀`);
            passed++;
        } else {
            log.error('팀 순위 조회 실패');
        }

        // 4. 팀 최근 경기 조회
        total++;
        console.log('\n4. 팀 최근 경기 조회 (ID: 1)');
        const matches = await apiRequest('/teams/1/matches?limit=3');
        if (matches.success) {
            log.success(`최근 경기 조회 성공: ${matches.data.data.length}경기`);
            passed++;
        } else {
            log.error('최근 경기 조회 실패');
        }

        // 5. 필터링 테스트
        total++;
        console.log('\n5. 팀 필터링 테스트 (지역: 서울)');
        const filtered = await apiRequest('/teams?region=서울');
        if (filtered.success) {
            log.success(`필터링 조회 성공: ${filtered.data.data.length}개 팀`);
            passed++;
        } else {
            log.error('필터링 조회 실패');
        }

        console.log(`\n📊 Teams API: ${passed}/${total} 테스트 통과`);
        return passed === total;
    },

    // H2H API 테스트
    async testH2HAPI() {
        log.title('⚔️ H2H API 테스트');
        let passed = 0;
        let total = 0;

        // 1. 두 팀 간 상대전적 조회
        total++;
        console.log('\n1. 두 팀 간 상대전적 조회 (팀 1 vs 팀 2)');
        const h2h = await apiRequest('/h2h/1/2');
        if (h2h.success) {
            log.success('상대전적 조회 성공');
            console.log(`   총 경기: ${h2h.data.data.totalMatches}`);
            console.log(`   팀1 승: ${h2h.data.data.team1.wins}, 팀2 승: ${h2h.data.data.team2.wins}`);
            passed++;
        } else {
            log.error('상대전적 조회 실패');
        }

        // 2. 특정 팀의 모든 상대전적 조회
        total++;
        console.log('\n2. 특정 팀의 모든 상대전적 조회 (팀 1)');
        const teamH2H = await apiRequest('/h2h/1');
        if (teamH2H.success) {
            log.success(`팀 상대전적 조회 성공: ${teamH2H.data.data.opponents.length}개 상대팀`);
            passed++;
        } else {
            log.error('팀 상대전적 조회 실패');
        }

        // 3. 잘못된 팀 ID 테스트
        total++;
        console.log('\n3. 잘못된 팀 ID 테스트 (팀 999 vs 팀 1000)');
        const invalidH2H = await apiRequest('/h2h/999/1000');
        if (!invalidH2H.success && invalidH2H.status === 404) {
            log.success('잘못된 팀 ID 에러 처리 성공');
            passed++;
        } else {
            log.error('잘못된 팀 ID 에러 처리 실패');
        }

        console.log(`\n📊 H2H API: ${passed}/${total} 테스트 통과`);
        return passed === total;
    },

    // 성능 테스트
    async testPerformance() {
        log.title('⚡ 성능 테스트');
        const iterations = 10;
        const endpoints = [
            '/teams',
            '/teams/1',
            '/teams/ranking',
            '/h2h/1/2'
        ];

        for (const endpoint of endpoints) {
            console.log(`\n📈 ${endpoint} 성능 테스트 (${iterations}회)`);
            const times = [];

            for (let i = 0; i < iterations; i++) {
                const startTime = Date.now();
                await apiRequest(endpoint);
                const endTime = Date.now();
                times.push(endTime - startTime);
            }

            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            const minTime = Math.min(...times);
            const maxTime = Math.max(...times);

            console.log(`   평균 응답시간: ${avgTime.toFixed(2)}ms`);
            console.log(`   최소 응답시간: ${minTime}ms`);
            console.log(`   최대 응답시간: ${maxTime}ms`);

            if (avgTime < 500) {
                log.success('성능 양호 (500ms 미만)');
            } else if (avgTime < 1000) {
                log.warning('성능 보통 (500-1000ms)');
            } else {
                log.error('성능 개선 필요 (1000ms 초과)');
            }
        }
    },

    // CORS 테스트
    async testCORS() {
        log.title('🌐 CORS 테스트');
        
        try {
            const response = await fetch(`${API_BASE}/teams`, {
                method: 'OPTIONS'
            });
            
            const corsHeaders = {
                'Access-Control-Allow-Origin': response.headers.get('access-control-allow-origin'),
                'Access-Control-Allow-Methods': response.headers.get('access-control-allow-methods'),
                'Access-Control-Allow-Headers': response.headers.get('access-control-allow-headers')
            };
            
            console.log('CORS 헤더:');
            Object.entries(corsHeaders).forEach(([key, value]) => {
                console.log(`   ${key}: ${value || 'Not Set'}`);
            });
            
            if (corsHeaders['Access-Control-Allow-Origin']) {
                log.success('CORS 설정 확인됨');
                return true;
            } else {
                log.warning('CORS 헤더가 설정되지 않음');
                return false;
            }
        } catch (error) {
            log.error(`CORS 테스트 실패: ${error.message}`);
            return false;
        }
    }
};

// 메인 테스트 실행
async function runTests() {
    console.log(`${colors.bright}${colors.magenta}`);
    console.log('  🏒 Ice Hockey API 테스트 스위트');
    console.log('  ================================');
    console.log(`${colors.reset}`);
    
    const results = [];
    
    // 기본 테스트들
    results.push(await tests.testHealth());
    results.push(await tests.testTeamsAPI());
    results.push(await tests.testH2HAPI());
    results.push(await tests.testCORS());
    
    // 성능 테스트는 선택적
    const args = process.argv.slice(2);
    if (args.includes('--performance') || args.includes('-p')) {
        await tests.testPerformance();
    }
    
    // 결과 요약
    const passed = results.filter(Boolean).length;
    const total = results.length;
    
    console.log(`\n${colors.bright}📋 테스트 결과 요약${colors.reset}`);
    console.log(`총 ${total}개 테스트 중 ${passed}개 통과`);
    
    if (passed === total) {
        console.log(`${colors.green}🎉 모든 테스트가 성공했습니다!${colors.reset}`);
    } else {
        console.log(`${colors.red}⚠️  ${total - passed}개 테스트가 실패했습니다.${colors.reset}`);
    }
    
    console.log(`\n${colors.cyan}💡 팁:${colors.reset}`);
    console.log('- 성능 테스트: node test-api.js --performance');
    console.log('- API 문서: http://localhost:3001/api-docs (개발 예정)');
    console.log('- 헬스 체크: http://localhost:3001/health');
    
    process.exit(passed === total ? 0 : 1);
}

// 도움말
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
🏒 Ice Hockey API 테스트 스크립트

Usage: node test-api.js [options]

Options:
  --help, -h         이 도움말을 표시합니다
  --performance, -p  성능 테스트도 함께 실행합니다

Examples:
  node test-api.js              기본 테스트 실행
  node test-api.js -p           성능 테스트 포함 실행
  
테스트 항목:
  ✓ 서버 헬스 체크
  ✓ Teams API (CRUD, 필터링, 순위)
  ✓ H2H API (상대전적 조회)
  ✓ CORS 설정 확인
  ✓ 성능 테스트 (옵션)
    `);
    process.exit(0);
}

// 서버가 실행 중인지 확인 후 테스트 실행
console.log(`🔍 API 서버 확인 중... (${API_BASE})`);
setTimeout(() => {
    runTests().catch(error => {
        log.error(`테스트 실행 중 오류: ${error.message}`);
        process.exit(1);
    });
}, 1000);

module.exports = { tests, apiRequest };
