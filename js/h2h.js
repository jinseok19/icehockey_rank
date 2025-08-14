// H2H (Head-to-Head) 분석 관리자
const H2HManager = {
  init() {
    this.currentTeam = null;
    this.currentOpponent = null;
    this.h2hData = null;
    
    this.bindEvents();
  },

  setTeams(team, opponent) {
    this.currentTeam = team;
    this.currentOpponent = opponent;
    this.h2hData = this.getH2HData();
    
    if (this.h2hData) {
      this.renderH2H();
    } else {
      this.showNoH2HData();
    }
  },

  getH2HData() {
    if (!this.currentTeam || !this.currentOpponent) return null;

    const rivalData = AppState.rivals.find(rival => rival.teamId === this.currentTeam.id);
    if (!rivalData) return null;

    return rivalData.opponents.find(opponent => opponent.opponentId === this.currentOpponent.id);
  },

  renderH2H() {
    if (!this.h2hData) return;

    // H2H 헤더 렌더링
    this.renderH2HHeader();
    
    // H2H 요약 통계 렌더링
    this.renderH2HSummary();
    
    // H2H 상세 통계 렌더링
    this.renderH2HDetails();
    
    // H2H 차트 렌더링
    this.renderH2HCharts();
    
    // 최근 상대전적 렌더링
    this.renderH2HRecentMatches();
  },

  renderH2HHeader() {
    const h2hHeader = document.querySelector('.h2h-header');
    if (!h2hHeader) return;

    h2hHeader.innerHTML = `
      <h3>${this.currentTeam.name} vs ${this.currentOpponent.name}</h3>
      <div class="h2h-summary-stats">
        <div class="summary-stat">
          <span class="stat-label">총 경기</span>
          <span class="stat-value">${this.h2hData.totalMatches}</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">승</span>
          <span class="stat-value">${this.h2hData.wins}</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">무</span>
          <span class="stat-value">${this.h2hData.draws}</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">패</span>
          <span class="stat-value">${this.h2hData.losses}</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">승률</span>
          <span class="stat-value">${this.h2hData.winRate}%</span>
        </div>
      </div>
    `;
  },

  renderH2HSummary() {
    const mainStats = document.querySelector('.h2h-main-stats');
    if (!mainStats) return;

    mainStats.innerHTML = `
      <div class="stats-card">
        <h4>전적</h4>
        <div class="record-display">
          <div class="record-item win">
            <span class="record-count">${this.h2hData.wins}</span>
            <span class="record-label">승</span>
          </div>
          <div class="record-item draw">
            <span class="record-count">${this.h2hData.draws}</span>
            <span class="record-label">무</span>
          </div>
          <div class="record-item loss">
            <span class="record-count">${this.h2hData.losses}</span>
            <span class="record-label">패</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <h4>득실점</h4>
        <div class="goals-display">
          <div class="goals-item">
            <span class="goals-label">득점</span>
            <span class="goals-value">${this.h2hData.goalsFor}</span>
          </div>
          <div class="goals-item">
            <span class="goals-label">실점</span>
            <span class="goals-value">${this.h2hData.goalsAgainst}</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <h4>평균 득실점</h4>
        <div class="goals-display">
          <div class="goals-item">
            <span class="goals-label">평균 득점</span>
            <span class="goals-value">${this.h2hData.avgGoalsFor}</span>
          </div>
          <div class="goals-item">
            <span class="goals-label">평균 실점</span>
            <span class="goals-value">${this.h2hData.avgGoalsAgainst}</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <h4>트렌드</h4>
        <div class="trend-display">
          <div class="trend-item ${this.getTrendClass(this.h2hData.trend)}">
            <span class="trend-text">${this.h2hData.trend}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderH2HDetails() {
    const mainStats = document.querySelector('.h2h-main-stats');
    if (!mainStats) return;

    mainStats.innerHTML = `
      <div class="stats-card">
        <h4>전적</h4>
        <div class="record-display">
          <div class="record-item win">
            <span class="record-count">${this.h2hData.wins}</span>
            <span class="record-label">승</span>
          </div>
          <div class="record-item draw">
            <span class="record-count">${this.h2hData.draws}</span>
            <span class="record-label">무</span>
          </div>
          <div class="record-item loss">
            <span class="record-count">${this.h2hData.losses}</span>
            <span class="record-label">패</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <h4>득실점</h4>
        <div class="goals-display">
          <div class="goals-item">
            <span class="goals-label">득점</span>
            <span class="goals-value">${this.h2hData.goalsFor}</span>
          </div>
          <div class="goals-item">
            <span class="goals-label">실점</span>
            <span class="goals-value">${this.h2hData.goalsAgainst}</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <h4>평균 득실점</h4>
        <div class="goals-display">
          <div class="goals-item">
            <span class="goals-label">평균 득점</span>
            <span class="goals-value">${this.h2hData.avgGoalsFor}</span>
          </div>
          <div class="goals-item">
            <span class="goals-label">평균 실점</span>
            <span class="goals-value">${this.h2hData.avgGoalsAgainst}</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <h4>트렌드</h4>
        <div class="trend-display">
          <div class="trend-item ${this.getTrendClass(this.h2hData.trend)}">
            <span class="trend-text">${this.h2hData.trend}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderH2HCharts() {
    const chartsContainer = document.querySelector('.h2h-charts');
    if (!chartsContainer) return;

    chartsContainer.innerHTML = `
      <div class="chart-container">
        <h4>승률 분포</h4>
        <canvas id="winRateChart" width="300" height="200"></canvas>
      </div>
      <div class="chart-container">
        <h4>득실점 비교</h4>
        <canvas id="goalsChart" width="300" height="200"></canvas>
      </div>
      <div class="chart-container">
        <h4>경기 결과 트렌드</h4>
        <canvas id="trendChart" width="300" height="200"></canvas>
      </div>
    `;

    // 차트 렌더링
    setTimeout(() => {
      this.createWinRateChart();
      this.createGoalsChart();
      this.createTrendChart();
    }, 100);
  },

  createWinRateChart() {
    const canvas = document.getElementById('winRateChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['승', '무', '패'],
        datasets: [{
          data: [this.h2hData.wins, this.h2hData.draws, this.h2hData.losses],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
            }
          }
        }
      }
    });
  },

  createGoalsChart() {
    const canvas = document.getElementById('goalsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['득점', '실점'],
        datasets: [{
          label: '골 수',
          data: [this.h2hData.goalsFor, this.h2hData.goalsAgainst],
          backgroundColor: ['#2D6CF6', '#20C997'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
            }
          },
          x: {
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  },

  createTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;

    // 최근 5경기 결과를 기반으로 트렌드 차트 생성
    const recentResults = this.h2hData.recentMatches.slice(-5).map(match => {
      const isHome = match.homeTeam === this.currentTeam.id;
      const currentScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;
      
      if (currentScore > opponentScore) return 3; // 승
      if (currentScore < opponentScore) return 0; // 패
      return 1; // 무
    });

    const labels = recentResults.map((_, index) => `${index + 1}경기전`);
    const data = recentResults;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: '경기 결과',
          data: data,
          borderColor: '#2D6CF6',
          backgroundColor: 'rgba(45, 108, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 3,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                if (value === 3) return '승';
                if (value === 1) return '무';
                if (value === 0) return '패';
                return '';
              },
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
            }
          },
          x: {
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  },

  renderH2HRecentMatches() {
    const recentMatches = document.querySelector('.h2h-recent-matches');
    if (!recentMatches) return;

    if (!this.h2hData.recentMatches || this.h2hData.recentMatches.length === 0) {
      recentMatches.innerHTML = `
        <h4>최근 상대전적</h4>
        <p>최근 상대전적 데이터가 없습니다.</p>
      `;
      return;
    }

    const matchesHTML = this.h2hData.recentMatches
      .slice(0, 5)
      .map(match => this.renderH2HMatchItem(match))
      .join('');

    recentMatches.innerHTML = `
      <h4>최근 상대전적</h4>
      ${matchesHTML}
    `;
  },

  renderH2HMatchItem(match) {
    const isHome = match.homeTeam === this.currentTeam.id;
    const currentScore = isHome ? match.homeScore : match.awayScore;
    const opponentScore = isHome ? match.awayScore : match.homeScore;
    const result = Utils.getMatchResult(match.homeScore, match.awayScore, match.homeTeam, this.currentTeam.id);

    return `
      <div class="recent-match-item">
        <div class="match-info">
          <div class="match-date">${Utils.formatDate(match.date)}</div>
          <div class="match-venue">${match.venue}</div>
        </div>
        <div class="match-score">
          ${currentScore} - ${opponentScore}
        </div>
        <div class="match-result">${Utils.createStatusBadge(result)}</div>
      </div>
    `;
  },

  getTrendClass(trend) {
    switch (trend) {
      case '승세':
        return 'winning';
      case '열세':
        return 'losing';
      case '균형':
        return 'balanced';
      default:
        return 'neutral';
    }
  },

  showNoH2HData() {
    const h2hContainer = document.querySelector('.h2h-container');
    if (!h2hContainer) return;

    h2hContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏒</div>
        <h3>H2H 데이터가 없습니다</h3>
        <p>${this.currentTeam.name}와 ${this.currentOpponent.name} 간의 상대전적 데이터가 없습니다.</p>
      </div>
    `;
  },

  // 고급 H2H 분석 기능
  analyzeH2HPatterns() {
    if (!this.h2hData || !this.h2hData.recentMatches) return null;

    const patterns = {
      homeAdvantage: this.analyzeHomeAdvantage(),
      scoringPatterns: this.analyzeScoringPatterns(),
      momentumShifts: this.analyzeMomentumShifts(),
      keyFactors: this.identifyKeyFactors()
    };

    return patterns;
  },

  analyzeHomeAdvantage() {
    const homeMatches = this.h2hData.recentMatches.filter(match => 
      match.homeTeam === this.currentTeam.id
    );
    
    const awayMatches = this.h2hData.recentMatches.filter(match => 
      match.awayTeam === this.currentTeam.id
    );

    const homeWins = homeMatches.filter(match => {
      const isHome = match.homeTeam === this.currentTeam.id;
      const currentScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;
      return currentScore > opponentScore;
    }).length;

    const awayWins = awayMatches.filter(match => {
      const isHome = match.homeTeam === this.currentTeam.id;
      const currentScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;
      return currentScore > opponentScore;
    }).length;

    return {
      homeWinRate: homeMatches.length > 0 ? (homeWins / homeMatches.length * 100).toFixed(1) : 0,
      awayWinRate: awayMatches.length > 0 ? (awayWins / awayMatches.length * 100).toFixed(1) : 0,
      homeAdvantage: homeMatches.length > 0 && awayMatches.length > 0 ? 
        ((homeWins / homeMatches.length) - (awayWins / awayMatches.length)) > 0 : false
    };
  },

  analyzeScoringPatterns() {
    const matches = this.h2hData.recentMatches;
    
    // 득점 패턴 분석
    const scoringByPeriod = { 1: 0, 2: 0, 3: 0 };
    const concedingByPeriod = { 1: 0, 2: 0, 3: 0 };
    
    // 실제로는 경기별 기간별 득점 데이터가 필요
    // 여기서는 간단한 예시로 대체
    
    return {
      scoringByPeriod,
      concedingByPeriod,
      avgGoalsPerMatch: (this.h2hData.goalsFor / this.h2hData.totalMatches).toFixed(2),
      avgConcededPerMatch: (this.h2hData.goalsAgainst / this.h2hData.totalMatches).toFixed(2)
    };
  },

  analyzeMomentumShifts() {
    // 연속 승/패 패턴 분석
    const results = this.h2hData.recentMatches.map(match => {
      const isHome = match.homeTeam === this.currentTeam.id;
      const currentScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;
      
      if (currentScore > opponentScore) return 'W';
      if (currentScore < opponentScore) return 'L';
      return 'D';
    });

    let currentStreak = 1;
    let maxStreak = 1;
    let currentResult = results[0];

    for (let i = 1; i < results.length; i++) {
      if (results[i] === currentResult) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
        currentResult = results[i];
      }
    }

    return {
      currentStreak,
      maxStreak,
      lastResult: results[results.length - 1],
      momentum: this.calculateMomentum(results)
    };
  },

  calculateMomentum(results) {
    // 최근 3경기 결과를 기반으로 모멘텀 계산
    const recentResults = results.slice(-3);
    let momentum = 0;
    
    recentResults.forEach((result, index) => {
      const weight = index + 1; // 최근 경기일수록 가중치 높음
      if (result === 'W') momentum += weight;
      else if (result === 'L') momentum -= weight;
      // 무승부는 0점
    });
    
    if (momentum > 2) return '강한 상승세';
    if (momentum > 0) return '상승세';
    if (momentum === 0) return '균형';
    if (momentum > -2) return '하락세';
    return '강한 하락세';
  },

  identifyKeyFactors() {
    const factors = [];
    
    // 승률이 높은 경우
    if (this.h2hData.winRate > 60) {
      factors.push('상대팀에 대한 높은 승률');
    }
    
    // 득점이 많은 경우
    if (this.h2hData.avgGoalsFor > 2.0) {
      factors.push('공격력 우위');
    }
    
    // 실점이 적은 경우
    if (this.h2hData.avgGoalsAgainst < 1.5) {
      factors.push('수비력 우위');
    }
    
    // 최근 경기에서 승세인 경우
    if (this.h2hData.trend === '승세') {
      factors.push('최근 상승세');
    }
    
    return factors.length > 0 ? factors : ['특별한 우위 요인 없음'];
  },

  bindEvents() {
    // H2H 관련 이벤트 바인딩
    document.addEventListener('opponentSelected', (e) => {
      const { team, opponent } = e.detail;
      this.setTeams(team, opponent);
    });
  }
};

// 전역으로 노출
window.H2HManager = H2HManager;
