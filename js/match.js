// 경기 상세 페이지 관리자
const MatchManager = {
  init() {
    this.currentMatch = null;
    this.currentTab = 'summary';
    
    this.loadMatchData();
    this.bindEvents();
    this.initTabs();
  },

  async loadMatchData() {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('id');
    
    if (!matchId) {
      this.showError('경기 ID가 지정되지 않았습니다.');
      return;
    }

    try {
      // 경기 데이터 찾기
      this.currentMatch = AppState.matches.find(match => match.id === matchId);

      if (!this.currentMatch) {
        this.showError(`경기 ID "${matchId}"에 해당하는 경기를 찾을 수 없습니다.`);
        return;
      }

      // 경기 페이지 렌더링
      this.renderMatchPage();
      
      // 기본 탭 표시
      this.showTab('summary');

    } catch (error) {
      console.error('경기 데이터 로드 오류:', error);
      this.showError('경기 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  },

  renderMatchPage() {
    if (!this.currentMatch) return;

    // 페이지 제목 업데이트
    const homeTeam = Utils.findTeamById(this.currentMatch.homeTeam);
    const awayTeam = Utils.findTeamById(this.currentMatch.awayTeam);
    
    if (homeTeam && awayTeam) {
      document.title = `${homeTeam.name} vs ${awayTeam.name} - 아이스하키 랭킹`;
    }

    // 경기 요약 렌더링
    this.renderMatchSummary();
    
    // 경기 통계 요약 렌더링
    this.renderMatchStatsSummary();
    
    // 스코어보드 렌더링
    this.renderScoreboard();
    
    // 타임라인 렌더링
    this.renderTimeline();
    
    // 선수 명단 렌더링
    this.renderPlayers();
    
    // 반칙 로그 렌더링
    this.renderPenalties();
  },

  renderMatchSummary() {
    const matchSummary = document.querySelector('.match-summary');
    if (!matchSummary) return;

    const homeTeam = Utils.findTeamById(this.currentMatch.homeTeam);
    const awayTeam = Utils.findTeamById(this.currentMatch.awayTeam);
    
    if (!homeTeam || !awayTeam) return;

    matchSummary.innerHTML = `
      <div class="match-header-info">
        <div class="match-teams">
          <div class="team home-team">
            <div class="team-emblem" style="background-color: ${homeTeam.colors[0]}; color: ${homeTeam.colors[1]}">
              ${homeTeam.name.charAt(0)}
            </div>
            <div class="team-details">
              <div class="team-name">${homeTeam.name}</div>
              <div class="team-meta">${homeTeam.fullName} • ${homeTeam.ageGroup}</div>
            </div>
          </div>
          
          <div class="match-score">
            <div class="score-display">
              <span class="score">${this.currentMatch.homeScore}</span>
              <span class="score-separator">-</span>
              <span class="score">${this.currentMatch.awayScore}</span>
            </div>
            <div class="match-status">${this.currentMatch.competition}</div>
          </div>
          
          <div class="team away-team">
            <div class="team-details">
              <div class="team-name">${awayTeam.name}</div>
              <div class="team-meta">${awayTeam.fullName} • ${awayTeam.ageGroup}</div>
            </div>
            <div class="team-emblem" style="background-color: ${awayTeam.colors[0]}; color: ${awayTeam.colors[1]}">
              ${awayTeam.name.charAt(0)}
            </div>
          </div>
        </div>
        
        <div class="match-meta">
          <div class="meta-item">
            <i data-lucide="calendar"></i>
            <span>${Utils.formatDate(this.currentMatch.date)}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="map-pin"></i>
            <span>${this.currentMatch.venue}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="users"></i>
            <span>${this.currentMatch.ageGroup}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderMatchStatsSummary() {
    const statsSummary = document.querySelector('.match-stats-summary');
    if (!statsSummary) return;

    statsSummary.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${this.currentMatch.homeShots}</div>
        <div class="stat-label">홈팀 슛</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${this.currentMatch.awayShots}</div>
        <div class="stat-label">원정팀 슛</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${this.currentMatch.homePenalties}</div>
        <div class="stat-label">홈팀 반칙</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${this.currentMatch.awayPenalties}</div>
        <div class="stat-label">원정팀 반칙</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${this.currentMatch.homePP}</div>
        <div class="stat-label">홈팀 파워플레이</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${this.currentMatch.awayPP}</div>
        <div class="stat-label">원정팀 파워플레이</div>
      </div>
    `;
  },

  renderScoreboard() {
    const scoreboardContainer = document.querySelector('.scoreboard-container');
    if (!scoreboardContainer) return;

    // 기간별 스코어
    const periodsSummary = this.renderPeriodsSummary();
    
    // 득점자 목록
    const scorersSummary = this.renderScorersSummary();
    
    // 파워플레이 요약
    const powerPlaySummary = this.renderPowerPlaySummary();

    scoreboardContainer.innerHTML = `
      ${periodsSummary}
      ${scorersSummary}
      ${powerPlaySummary}
    `;
  },

  renderPeriodsSummary() {
    if (!this.currentMatch.periods || this.currentMatch.periods.length === 0) {
      return `
        <div class="periods-summary">
          <h3>기간별 스코어</h3>
          <p>기간별 스코어 데이터가 없습니다.</p>
        </div>
      `;
    }

    const periodsHTML = this.currentMatch.periods
      .map(period => `
        <div class="period-item">
          <div class="period-number">${period.period}기</div>
          <div class="period-score">${period.homeScore} - ${period.awayScore}</div>
        </div>
      `)
      .join('');

    return `
      <div class="periods-summary">
        <h3>기간별 스코어</h3>
        <div class="periods-grid">
          ${periodsHTML}
        </div>
      </div>
    `;
  },

  renderScorersSummary() {
    if (!this.currentMatch.scorers || this.currentMatch.scorers.length === 0) {
      return `
        <div class="scorers-summary">
          <h3>득점자</h3>
          <p>득점자 데이터가 없습니다.</p>
        </div>
      `;
    }

    const scorersHTML = this.currentMatch.scorers
      .map(scorer => `
        <div class="scorer-item ${scorer.team === 'home' ? 'home-scorer' : 'away-scorer'}">
          <div class="scorer-info">
            <div class="scorer-name">${scorer.player}</div>
            <div class="scorer-team">${scorer.team === 'home' ? '홈팀' : '원정팀'}</div>
          </div>
          <div class="scorer-time">
            <span>${scorer.period}기</span>
            <span>${scorer.time}</span>
          </div>
        </div>
      `)
      .join('');

    return `
      <div class="scorers-summary">
        <h3>득점자</h3>
        <div class="scorers-list">
          ${scorersHTML}
        </div>
      </div>
    `;
  },

  renderPowerPlaySummary() {
    const homeTeam = Utils.findTeamById(this.currentMatch.homeTeam);
    const awayTeam = Utils.findTeamById(this.currentMatch.awayTeam);
    
    if (!homeTeam || !awayTeam) return '';

    return `
      <div class="power-play-summary">
        <h3>파워플레이 통계</h3>
        <div class="pp-stats">
          <div class="pp-stat">
            <span class="pp-label">${homeTeam.name} 파워플레이</span>
            <span class="pp-value">${this.currentMatch.homePP}/${this.currentMatch.homePenalties}</span>
          </div>
          <div class="pp-stat">
            <span class="pp-label">${awayTeam.name} 파워플레이</span>
            <span class="pp-value">${this.currentMatch.awayPP}/${this.currentMatch.awayPenalties}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderTimeline() {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    // 득점과 반칙을 시간순으로 정렬
    const events = this.createTimelineEvents();
    
    if (events.length === 0) {
      timelineContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏒</div>
          <p>타임라인 데이터가 없습니다</p>
        </div>
      `;
      return;
    }

    const timelineHTML = events
      .map(event => `
        <div class="timeline-event ${event.type} ${event.team}">
          <div class="event-time">
            <span>${event.period}기</span>
            <span>${event.time}</span>
          </div>
          <div class="event-icon">
            ${event.type === 'goal' ? '⚽' : '🚨'}
          </div>
          <div class="event-description">
            ${event.description}
          </div>
        </div>
      `)
      .join('');

    timelineContainer.innerHTML = `
      <h3>경기 타임라인</h3>
      <div class="timeline">
        ${timelineHTML}
      </div>
    `;
  },

  createTimelineEvents() {
    const events = [];
    
    // 득점 이벤트 추가
    if (this.currentMatch.scorers) {
      this.currentMatch.scorers.forEach(scorer => {
        events.push({
          type: 'goal',
          team: scorer.team,
          period: scorer.period,
          time: scorer.time,
          description: `${scorer.player} 득점`
        });
      });
    }
    
    // 반칙 이벤트 추가
    if (this.currentMatch.penalties) {
      this.currentMatch.penalties.forEach(penalty => {
        events.push({
          type: 'penalty',
          team: penalty.team,
          period: penalty.period,
          time: penalty.time,
          description: `${penalty.player} ${penalty.reason} (${penalty.duration}분)`
        });
      });
    }
    
    // 시간순 정렬 (기간, 시간)
    return events.sort((a, b) => {
      if (a.period !== b.period) return a.period - b.period;
      return this.parseTime(a.time) - this.parseTime(b.time);
    });
  },

  parseTime(timeString) {
    // "MM:SS" 형식을 초로 변환
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  },

  renderPlayers() {
    const playersContainer = document.querySelector('.players-container');
    if (!playersContainer) return;

    // 임시 선수 데이터 (실제로는 별도 데이터가 필요)
    const homePlayers = this.generateSamplePlayers('home');
    const awayPlayers = this.generateSamplePlayers('away');

    playersContainer.innerHTML = `
      <div class="team-players">
        <h3>홈팀 선수 명단</h3>
        <div class="players-list">
          ${homePlayers.map(player => `
            <div class="player-item">
              <div class="player-name">${player.name}</div>
              <div class="player-position">${player.position}</div>
              <div class="player-number">#${player.number}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="team-players">
        <h3>원정팀 선수 명단</h3>
        <div class="players-list">
          ${awayPlayers.map(player => `
            <div class="player-item">
              <div class="player-name">${player.name}</div>
              <div class="player-position">${player.position}</div>
              <div class="player-number">#${player.number}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  generateSamplePlayers(team) {
    // 임시 선수 데이터 생성 (실제로는 데이터베이스에서 가져와야 함)
    const positions = ['GK', 'D', 'F'];
    const names = ['김철수', '박영희', '이민수', '최지영', '정현우', '한소영', '윤태호', '임수진'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      name: names[i],
      position: positions[i % positions.length],
      number: i + 1
    }));
  },

  renderPenalties() {
    const penaltiesContainer = document.querySelector('.penalties-container');
    if (!penaltiesContainer) return;

    if (!this.currentMatch.penalties || this.currentMatch.penalties.length === 0) {
      penaltiesContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏒</div>
          <p>반칙 데이터가 없습니다</p>
        </div>
      `;
      return;
    }

    const penaltiesHTML = this.currentMatch.penalties
      .map(penalty => `
        <div class="penalty-item ${penalty.team}">
          <div class="penalty-time">
            <span>${penalty.period}기</span>
            <span>${penalty.time}</span>
          </div>
          <div class="penalty-team">${penalty.team === 'home' ? '홈팀' : '원정팀'}</div>
          <div class="penalty-player">${penalty.player}</div>
          <div class="penalty-reason">${penalty.reason}</div>
          <div class="penalty-duration">${penalty.duration}분</div>
        </div>
      `)
      .join('');

    penaltiesContainer.innerHTML = `
      <h3>반칙 로그</h3>
      <div class="penalties-list">
        ${penaltiesHTML}
      </div>
    `;
  },

  bindEvents() {
    // 탭 클릭 이벤트
    document.addEventListener('click', (e) => {
      if (e.target.matches('.tab-btn')) {
        const tabName = e.target.dataset.tab;
        this.showTab(tabName);
      }
    });

    // 팀 이름 클릭 시 팀 페이지로 이동
    document.addEventListener('click', (e) => {
      if (e.target.closest('.team-name')) {
        const teamName = e.target.closest('.team-name').textContent;
        this.navigateToTeam(teamName);
      }
    });
  },

  navigateToTeam(teamName) {
    window.location.href = `team.html?name=${encodeURIComponent(teamName)}`;
  },

  initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
      tabButtons[0].classList.add('active');
    }
  },

  showTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    // 선택된 탭 활성화
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedPanel = document.querySelector(`#${tabName}-panel`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedPanel) selectedPanel.classList.add('active');

    this.currentTab = tabName;
  },

  showError(message) {
    const main = document.querySelector('.main');
    if (main) {
      main.innerHTML = `
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <h1>오류가 발생했습니다</h1>
          <p>${message}</p>
          <div class="error-actions">
            <a href="/" class="btn-secondary">홈으로 돌아가기</a>
          </div>
        </div>
      `;
    }
  }
};

// 전역으로 노출
window.MatchManager = MatchManager;
