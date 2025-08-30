#!/usr/bin/env node

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

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
    title: (msg) => console.log(`\n${colors.bright}${colors.cyan}🏒 ${msg}${colors.reset}\n`)
};

// 환경 변수 확인
const checkEnvironment = () => {
    log.title('환경 설정 확인');
    
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        log.error(`필요한 환경 변수가 설정되지 않았습니다: ${missing.join(', ')}`);
        log.info('env.example 파일을 .env로 복사하고 값을 설정해주세요.');
        process.exit(1);
    }
    
    log.success('환경 변수 설정 완료');
    log.info(`데이터베이스: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
    log.info(`데이터베이스명: ${process.env.DB_NAME}`);
};

// 데이터베이스 연결 테스트
const testConnection = async () => {
    log.title('데이터베이스 연결 테스트');
    
    try {
        log.info(`연결 시도: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
        log.info(`사용자: ${process.env.DB_USER}`);
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectTimeout: 120000,
            acquireTimeout: 120000,
            timeout: 120000
        });
        
        await connection.ping();
        log.success('데이터베이스 연결 성공');
        await connection.end();
        return true;
    } catch (error) {
        log.error(`데이터베이스 연결 실패: ${error.code} - ${error.message}`);
        log.error(`오류 상세: ${JSON.stringify(error, null, 2)}`);
        return false;
    }
};

// 데이터베이스 생성
const createDatabase = async () => {
    log.title('데이터베이스 생성');
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        log.success(`데이터베이스 '${process.env.DB_NAME}' 생성 완료`);
        
        await connection.end();
    } catch (error) {
        log.error(`데이터베이스 생성 실패: ${error.message}`);
        throw error;
    }
};

// 스키마 실행
const executeSchema = async () => {
    log.title('데이터베이스 스키마 생성');
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        const schemaPath = path.join(__dirname, 'src', 'database', 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        // 각 SQL 문을 개별적으로 실행
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt && !stmt.startsWith('--') && !stmt.startsWith('/*'));
            
        for (const statement of statements) {
            if (statement.toLowerCase().includes('create table') || 
                statement.toLowerCase().includes('insert into')) {
                await connection.execute(statement);
                log.info(`실행 완료: ${statement.split('(')[0].trim()}...`);
            }
        }
        
        log.success('데이터베이스 스키마 생성 완료');
        
        await connection.end();
    } catch (error) {
        log.error(`스키마 생성 실패: ${error.message}`);
        throw error;
    }
};

// 시드 데이터 실행
const runSeed = async () => {
    log.title('시드 데이터 생성');
    
    try {
        const { runSeed } = require('./src/database/seed');
        await runSeed();
        log.success('시드 데이터 생성 완료');
    } catch (error) {
        log.error(`시드 데이터 생성 실패: ${error.message}`);
        throw error;
    }
};

// 서버 시작 확인
const testServer = async () => {
    log.title('서버 시작 테스트');
    
    try {
        const { testConnection } = require('./src/config/database');
        const isConnected = await testConnection();
        
        if (isConnected) {
            log.success('서버 준비 완료! 다음 명령어로 서버를 시작하세요:');
            log.info('npm run dev    (개발 모드)');
            log.info('npm start      (프로덕션 모드)');
        } else {
            log.error('서버 설정에 문제가 있습니다.');
        }
    } catch (error) {
        log.error(`서버 테스트 실패: ${error.message}`);
    }
};

// 메인 설정 함수
const setup = async () => {
    try {
        console.log(`${colors.bright}${colors.magenta}`);
        console.log('  🏒 Ice Hockey Statistics API Setup');
        console.log('  ===================================');
        console.log(`${colors.reset}`);
        
        // 1. 환경 설정 확인
        checkEnvironment();
        
        // 2. 데이터베이스 연결 테스트
        const isConnected = await testConnection();
        if (!isConnected) {
            process.exit(1);
        }
        
        // 3. 데이터베이스 생성
        await createDatabase();
        
        // 4. 스키마 생성
        await executeSchema();
        
        // 5. 시드 데이터 생성
        await runSeed();
        
        // 6. 서버 테스트
        await testServer();
        
        console.log(`\n${colors.bright}${colors.green}🎉 설정이 완료되었습니다!${colors.reset}\n`);
        
    } catch (error) {
        log.error(`설정 중 오류 발생: ${error.message}`);
        console.log(`\n${colors.bright}${colors.red}💥 설정 실패${colors.reset}\n`);
        process.exit(1);
    }
};

// 명령행 인수 처리
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🏒 Ice Hockey API Setup Script

Usage: node setup.js [options]

Options:
  --help, -h     이 도움말을 표시합니다
  --schema-only  스키마만 생성합니다 (시드 데이터 제외)
  --seed-only    시드 데이터만 생성합니다
  --reset        기존 데이터를 모두 삭제하고 다시 생성합니다

Examples:
  node setup.js                전체 설정 실행
  node setup.js --schema-only  스키마만 생성
  node setup.js --seed-only    시드 데이터만 생성
  node setup.js --reset        전체 리셋 후 설정
    `);
    process.exit(0);
}

// 개별 작업 실행
if (args.includes('--schema-only')) {
    log.title('스키마 전용 모드');
    checkEnvironment();
    testConnection().then(isConnected => {
        if (isConnected) {
            return Promise.all([createDatabase(), executeSchema()]);
        }
    }).then(() => {
        log.success('스키마 생성 완료');
    }).catch(error => {
        log.error(`스키마 생성 실패: ${error.message}`);
        process.exit(1);
    });
} else if (args.includes('--seed-only')) {
    log.title('시드 데이터 전용 모드');
    checkEnvironment();
    runSeed().then(() => {
        log.success('시드 데이터 생성 완료');
    }).catch(error => {
        log.error(`시드 데이터 생성 실패: ${error.message}`);
        process.exit(1);
    });
} else {
    // 전체 설정 실행
    setup();
}

module.exports = { setup, checkEnvironment, testConnection, createDatabase, executeSchema, runSeed };
