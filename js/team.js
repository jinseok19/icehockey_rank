// 팀 페이지 관리자
const TeamManager = {
  init() {
    this.currentTeam = null;
    this.currentOpponent = null;
    this.currentTab = 'overview';
    
    this.loadTeamData();
    this.bindEvents();
    this.initTabs();
  },

  async loadTeamData() {
    const urlParams = new URLSearchParams(window.location.search);
    const teamName = urlParams.get('name');
    
    if (!teamName) {
      this.showError('팀명이 지정되지 않았습니다.');
      return;
    }

    try {
      // 팀 데이터 찾기
      this.currentTeam = AppState.teams.find(team => 
        team.name === teamName || team.fullName === teamName
      );

      if (!this.currentTeam) {
        this.showError(`팀 "${teamName}"을 찾을 수 없습니다.`);
        return;
      }

      // 팀 페이지 렌더링
      this.renderTeamPage();
      
      // 상대팀 목록 렌더링
      this.renderOpponentsList();
      
      // 기본 탭 표시
      this.showTab('overview');

    } catch (error) {
      console.error('팀 데이터 로드 오류:', error);
      this.showError('팀 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  },

  renderTeamPage() {
    if (!this.currentTeam) return;

    // 페이지 제목 업데이트
    document.title = `${this.currentTeam.name} - 아이스하키 랭킹`;

    // breadcrumb 초기화
    this.updateBreadcrumb();

    // 팀 프로필 렌더링
    this.renderTeamProfile();
    
    // 팀 통계 렌더링
    this.renderTeamStats();
    
    // 최근 경기 폼 렌더링
    this.renderRecentForm();
    
    // 팀 성과 렌더링
    this.renderTeamAchievements();
    
    // 최근 경기 목록 렌더링
    this.renderRecentMatches();
  },

  renderTeamProfile() {
    const teamPanel = document.querySelector('.team-panel .team-profile');
    if (!teamPanel) return;

    teamPanel.innerHTML = `
      <div class="team-emblem" style="background-color: ${this.currentTeam.colors[0]}; color: ${this.currentTeam.colors[1]}">
        ${this.currentTeam.name.charAt(0)}
      </div>
      <h2 class="team-name">${this.currentTeam.name}</h2>
      <div class="team-info">
        <div>${this.currentTeam.fullName}</div>
        <div>${this.currentTeam.ageGroup} • ${this.currentTeam.region}</div>
        <div>창단: ${this.currentTeam.founded}년</div>
        <div>홈구장: ${this.currentTeam.homeVenue}</div>
        <div>감독: ${this.currentTeam.coach}</div>
        <div>주장: ${this.currentTeam.captain}</div>
      </div>
      <div class="team-tags">
        ${this.currentTeam.tags.map(tag => `<span class="team-tag">${tag}</span>`).join('')}
      </div>
      <p class="team-description">${this.currentTeam.description}</p>
    `;
  },

  renderTeamStats() {
    const overviewStats = document.querySelector('.overview-stats .stats-grid');
    if (!overviewStats) return;

    const stats = this.currentTeam.stats;
    
    overviewStats.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${stats.totalMatches}</div>
        <div class="stat-label">총 경기수</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.wins}</div>
        <div class="stat-label">승</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.draws}</div>
        <div class="stat-label">무</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.losses}</div>
        <div class="stat-label">패</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.winRate}%</div>
        <div class="stat-label">승률</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.goalsFor}</div>
        <div class="stat-label">득점</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.goalsAgainst}</div>
        <div class="stat-label">실점</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgGoalsFor}</div>
        <div class="stat-label">평균득점</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgGoalsAgainst}</div>
        <div class="stat-label">평균실점</div>
      </div>
    `;
  },

  renderRecentForm() {
    const recentForm = document.querySelector('.recent-form');
    if (!recentForm) return;

    const formHTML = this.currentTeam.recentForm
      .slice(-10) // 최근 10경기
      .map(result => Utils.createStatusBadge(result))
      .join('');

    recentForm.innerHTML = `
      <h3>최근 10경기 폼</h3>
      <div class="form-display">
        ${formHTML}
      </div>
    `;
  },

  renderTeamAchievements() {
    const achievements = document.querySelector('.team-achievements ul');
    if (!achievements) return;

    achievements.innerHTML = this.currentTeam.achievements
      .map(achievement => `<li>${achievement}</li>`)
      .join('');
  },

  renderRecentMatches() {
    const matchesList = document.querySelector('.matches-list');
    if (!matchesList) return;

    // 현재 팀의 최근 경기 찾기
    const teamMatches = AppState.matches.filter(match => 
      match.homeTeam === this.currentTeam.id || match.awayTeam === this.currentTeam.id
    );

    // 날짜순 정렬 (최신순)
    const sortedMatches = teamMatches.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedMatches.length === 0) {
      matchesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏒</div>
          <p>경기 데이터가 없습니다</p>
        </div>
      `;
      return;
    }

    matchesList.innerHTML = sortedMatches
      .slice(0, 10) // 최근 10경기만
      .map(match => this.renderMatchItem(match))
      .join('');
  },

  renderMatchItem(match) {
    const isHome = match.homeTeam === this.currentTeam.id;
    const opponentId = isHome ? match.awayTeam : match.homeTeam;
    const opponent = Utils.findTeamById(opponentId);
    const currentScore = isHome ? match.homeScore : match.awayScore;
    const opponentScore = isHome ? match.awayScore : match.homeScore;
    const result = Utils.getMatchResult(match.homeScore, match.awayScore, match.homeTeam, this.currentTeam.id);

    if (!opponent) return '';

    return `
      <div class="match-item">
        <div class="match-date">${Utils.formatDate(match.date)}</div>
        <div class="match-teams">
          ${isHome ? this.currentTeam.name : opponent.name}
          <span class="vs">vs</span>
          ${isHome ? opponent.name : this.currentTeam.name}
        </div>
        <div class="team-score">${currentScore}</div>
        <div class="score-separator">-</div>
        <div class="opponent-score">${opponentScore}</div>
        <div class="match-result">${Utils.createStatusBadge(result)}</div>
        <div class="match-venue">${match.venue}</div>
        <a href="match.html?id=${match.id}" class="match-link">상세보기</a>
      </div>
    `;
  },

  renderOpponentsList() {
    const opponentsList = document.querySelector('.opponents-list');
    if (!opponentsList) return;

    // 상대팀 데이터 찾기
    const rivalData = AppState.rivals.find(rival => rival.teamId === this.currentTeam.id);
    
    if (!rivalData || rivalData.opponents.length === 0) {
      opponentsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏒</div>
          <h3>상대전적 데이터가 없습니다</h3>
          <p>현재 팀과의 상대전적 데이터가 없습니다.</p>
        </div>
      `;
      return;
    }

    // 상대팀 수 업데이트
    const opponentsHeader = document.querySelector('.opponents-header h3');
    if (opponentsHeader) {
      opponentsHeader.textContent = `상대팀 목록 (${rivalData.opponents.length}팀)`;
    }
    
    // 정렬 옵션 업데이트
    this.updateSortOptions(rivalData.opponents);
    
    opponentsList.innerHTML = rivalData.opponents
      .map(opponent => this.renderOpponentItem(opponent))
      .join('');
      
    // 첫 번째 상대팀을 기본으로 선택
    if (rivalData.opponents.length > 0) {
      this.selectOpponent(rivalData.opponents[0].opponentId);
    }
  },

  renderOpponentItem(opponent) {
    const opponentTeam = Utils.findTeamById(opponent.opponentId);
    if (!opponentTeam) return '';

    const trendClass = opponent.trend === '승세' ? 'winning' : 
                      opponent.trend === '열세' ? 'losing' : 'neutral';

    return `
      <div class="opponent-item" data-opponent-id="${opponent.opponentId}">
        <div class="opponent-header">
          <div class="opponent-emblem" style="background-color: ${opponentTeam.colors[0]}; color: ${opponentTeam.colors[1]}">
            ${opponentTeam.name.charAt(0)}
          </div>
          <div class="opponent-info">
            <div class="opponent-name">${opponentTeam.name}</div>
            <div class="opponent-meta">${opponentTeam.fullName} • ${opponentTeam.ageGroup}</div>
          </div>
        </div>
        <div class="opponent-stats">
          <div class="opponent-stat">
            <div class="opponent-stat-value">${opponent.totalMatches}</div>
            <div class="opponent-stat-label">경기수</div>
          </div>
          <div class="opponent-stat">
            <div class="opponent-stat-value">${opponent.winRate}%</div>
            <div class="opponent-stat-label">승률</div>
          </div>
          <div class="opponent-stat">
            <div class="opponent-stat-value trend-${trendClass}">${opponent.trend}</div>
            <div class="opponent-stat-label">트렌드</div>
          </div>
        </div>
        <div class="opponent-actions">
          <button class="btn-secondary small">상세보기</button>
        </div>
      </div>
    `;
  },

  bindEvents() {
    // 상대팀 선택 이벤트
    document.addEventListener('click', (e) => {
      if (e.target.closest('.opponent-item')) {
        const opponentId = e.target.closest('.opponent-item').dataset.opponentId;
        this.selectOpponent(opponentId);
      }
      
      // 상세보기 버튼 클릭 이벤트
      if (e.target.matches('.opponent-actions button')) {
        const opponentItem = e.target.closest('.opponent-item');
        const opponentId = opponentItem.dataset.opponentId;
        this.selectOpponent(opponentId);
      }
    });

    // 탭 클릭 이벤트
    document.addEventListener('click', (e) => {
      if (e.target.matches('.tab-btn')) {
        const tabName = e.target.dataset.tab;
        this.showTab(tabName);
      }
    });

    // 필터 변경 이벤트
    document.addEventListener('filtersChanged', (e) => {
      this.handleFilterChange(e.detail);
    });

    // 상대팀 검색 및 정렬 이벤트
    const opponentsSearch = document.getElementById('opponents-search');
    const opponentsSort = document.getElementById('opponents-sort');
    
    if (opponentsSearch) {
      opponentsSearch.addEventListener('input', () => {
        this.filterOpponents();
      });
    }
    
    if (opponentsSort) {
      opponentsSort.addEventListener('change', () => {
        this.sortOpponents();
      });
    }
  },

  selectOpponent(opponentId) {
    // 기존 선택 해제
    document.querySelectorAll('.opponent-item').forEach(item => {
      item.classList.remove('selected');
      const actionBtn = item.querySelector('.opponent-actions button');
      if (actionBtn) {
        actionBtn.classList.remove('btn-primary');
        actionBtn.classList.add('btn-secondary');
        actionBtn.textContent = '상세보기';
      }
    });

    // 새로운 선택 표시
    const selectedItem = document.querySelector(`[data-opponent-id="${opponentId}"]`);
    if (selectedItem) {
      selectedItem.classList.add('selected');
      const actionBtn = selectedItem.querySelector('.opponent-actions button');
      if (actionBtn) {
        actionBtn.classList.remove('btn-secondary');
        actionBtn.classList.add('btn-primary');
        actionBtn.textContent = '선택됨';
      }
    }

    // 상대팀 설정
    this.currentOpponent = Utils.findTeamById(opponentId);
    
    // 로딩 상태 표시
    const h2hContainer = document.querySelector('.h2h-container');
    if (h2hContainer) {
      h2hContainer.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>${this.currentOpponent.name}와의 상대전적 데이터를 불러오는 중...</p>
        </div>
      `;
    }
    
    // 상대전적 탭으로 자동 이동
    this.showTab('h2h');
    
    // 상대팀 정보를 breadcrumb에 표시
    this.updateBreadcrumb();
    
    // H2H 데이터 렌더링 (로딩 애니메이션을 위해 약간의 지연)
    setTimeout(() => {
      this.renderH2HData();
    }, 1000);
  },

  renderH2HData() {
    if (!this.currentOpponent) return;

    const h2hData = this.getH2HData();
    if (!h2hData) {
      this.showNoH2HData();
      return;
    }

    // H2H 컨테이너 초기화
    const h2hContainer = document.querySelector('.h2h-container');
    if (!h2hContainer) return;
    
    h2hContainer.innerHTML = '';

    // H2H 요약 통계 렌더링
    this.renderH2HSummary();
    
    // H2H 상세 통계 렌더링
    this.renderH2HDetails();
    
    // H2H 차트 렌더링
    this.renderH2HCharts();
    
    // 최근 상대전적 렌더링
    this.renderH2HRecentMatches();
    
    // H2H 데이터 로딩 완료 표시
    h2hContainer.classList.add('loaded');
    
    // 로딩 상태 제거
    const loadingState = h2hContainer.querySelector('.loading-state');
    if (loadingState) {
      loadingState.remove();
    }
  },

  renderH2HSummary() {
    const h2hContainer = document.querySelector('.h2h-container');
    if (!h2hContainer) return;

    const h2hData = this.getH2HData();
    if (!h2hData) return;

    // H2H 헤더와 요약 통계를 함께 렌더링
    const headerHTML = `
      <div class="h2h-header">
        <h3>${this.currentTeam.name} vs ${this.currentOpponent.name}</h3>
        <div class="h2h-summary-stats">
          <div class="summary-stat">
            <span class="stat-label">총 경기</span>
            <span class="stat-value">${h2hData.totalMatches}</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">승</span>
            <span class="stat-value">${h2hData.wins}</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">무</span>
            <span class="stat-value">${h2hData.draws}</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">패</span>
            <span class="stat-value">${h2hData.losses}</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">승률</span>
            <span class="stat-value">${h2hData.winRate}%</span>
          </div>
        </div>
      </div>
    `;

    h2hContainer.innerHTML = headerHTML;
  },

  renderH2HDetails() {
    const h2hContainer = document.querySelector('.h2h-container');
    if (!h2hContainer) return;

    const h2hData = this.getH2HData();
    if (!h2hData) return;

    // H2H 상세 통계를 추가
    const detailsHTML = `
      <div class="h2h-main-stats">
        <div class="stats-card">
          <h4>전적</h4>
          <div class="record-display">
            <div class="record-item win">
              <span class="record-count">${h2hData.wins}</span>
              <span class="record-label">승</span>
            </div>
            <div class="record-item draw">
              <span class="record-count">${h2hData.draws}</span>
              <span class="record-label">무</span>
            </div>
            <div class="record-item loss">
              <span class="record-count">${h2hData.losses}</span>
              <span class="record-label">패</span>
            </div>
          </div>
        </div>
        <div class="stats-card">
          <h4>득실점</h4>
          <div class="goals-display">
            <div class="goals-item">
              <span class="goals-label">득점</span>
              <span class="goals-value">${h2hData.goalsFor}</span>
            </div>
            <div class="goals-item">
              <span class="goals-label">실점</span>
              <span class="goals-value">${h2hData.goalsAgainst}</span>
            </div>
          </div>
        </div>
        <div class="stats-card">
          <h4>트렌드</h4>
          <div class="trend-display">
            <div class="trend-item ${this.getTrendClass(h2hData.trend)}">
              <span class="trend-text">${h2hData.trend}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    h2hContainer.innerHTML += detailsHTML;
  },

  renderH2HCharts() {
    const h2hContainer = document.querySelector('.h2h-container');
    if (!h2hContainer) return;

    const h2hData = this.getH2HData();
    if (!h2hData) return;

    // H2H 차트를 추가
    const chartsHTML = `
      <div class="h2h-charts">
        <div class="chart-container">
          <h4>승률 분포</h4>
          <canvas id="winRateChart" width="300" height="200"></canvas>
        </div>
        <div class="chart-container">
          <h4>득실점 비교</h4>
          <canvas id="goalsChart" width="300" height="200"></canvas>
        </div>
      </div>
    `;

    h2hContainer.innerHTML += chartsHTML;

    // 차트 렌더링
    setTimeout(() => {
      this.createWinRateChart(h2hData);
      this.createGoalsChart(h2hData);
    }, 100);
  },

  createWinRateChart(h2hData) {
    const canvas = document.getElementById('winRateChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['승', '무', '패'],
        datasets: [{
          data: [h2hData.wins, h2hData.draws, h2hData.losses],
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

  createGoalsChart(h2hData) {
    const canvas = document.getElementById('goalsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['득점', '실점'],
        datasets: [{
          label: '골 수',
          data: [h2hData.goalsFor, h2hData.goalsAgainst],
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

  renderH2HRecentMatches() {
    const h2hContainer = document.querySelector('.h2h-container');
    if (!h2hContainer) return;

    const h2hData = this.getH2HData();
    if (!h2hData || !h2hData.recentMatches) return;

    // H2H 최근 경기를 추가
    const recentMatchesHTML = `
      <div class="h2h-recent-matches">
        <h4>최근 상대전적</h4>
        ${h2hData.recentMatches
          .slice(0, 5)
          .map(match => this.renderH2HMatchItem(match))
          .join('')}
      </div>
    `;

    h2hContainer.innerHTML += recentMatchesHTML;
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
          <span class="team-score ${isHome ? 'home' : 'away'}">${currentScore}</span>
          <span class="score-separator">-</span>
          <span class="team-score ${isHome ? 'away' : 'home'}">${opponentScore}</span>
        </div>
        <div class="match-result">${Utils.createStatusBadge(result)}</div>
        <div class="match-details">
          <span class="match-venue">${match.venue}</span>
        </div>
      </div>
    `;
  },

  getH2HData() {
    if (!this.currentTeam || !this.currentOpponent) return null;

    const rivalData = AppState.rivals.find(rival => rival.teamId === this.currentTeam.id);
    if (!rivalData) return null;

    return rivalData.opponents.find(opponent => opponent.opponentId === this.currentOpponent.id);
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

  handleFilterChange(filters) {
    // 필터 변경 시 필요한 데이터 업데이트
    console.log('필터 변경됨:', filters);
    
    // 여기에 필터링 로직 추가
    this.updateFilteredData(filters);
  },

  updateFilteredData(filters) {
    // 필터에 따른 데이터 업데이트
    // 예: 특정 시즌이나 연령대의 경기만 표시
  },

  filterOpponents() {
    const searchTerm = document.getElementById('opponents-search')?.value || '';
    const opponentItems = document.querySelectorAll('.opponent-item');
    let visibleCount = 0;
    
    opponentItems.forEach(item => {
      const teamName = item.querySelector('.opponent-name')?.textContent || '';
      const teamMeta = item.querySelector('.opponent-meta')?.textContent || '';
      const searchText = (teamName + ' ' + teamMeta).toLowerCase();
      
      if (searchText.includes(searchTerm.toLowerCase())) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    
    // 검색 결과가 없을 때 메시지 표시
    const opponentsList = document.querySelector('.opponents-list');
    const noResultsMsg = opponentsList.querySelector('.no-results-msg');
    
    if (visibleCount === 0 && searchTerm.trim()) {
      if (!noResultsMsg) {
        const msg = document.createElement('div');
        msg.className = 'no-results-msg empty-state';
        msg.innerHTML = `
          <div class="empty-state-icon">🔍</div>
          <h3>검색 결과가 없습니다</h3>
          <p>"${searchTerm}"에 대한 상대팀을 찾을 수 없습니다.</p>
        `;
        opponentsList.appendChild(msg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  },

  sortOpponents() {
    const sortBy = document.getElementById('opponents-sort')?.value || 'recent';
    const opponentsList = document.querySelector('.opponents-list');
    const opponentItems = Array.from(opponentsList.querySelectorAll('.opponent-item'));
    
    if (!opponentsList || opponentItems.length === 0) return;
    
    // no-results-msg는 정렬에서 제외
    const noResultsMsg = opponentsList.querySelector('.no-results-msg');
    if (noResultsMsg) {
      noResultsMsg.remove();
    }
    
    opponentItems.sort((a, b) => {
      const aData = this.getOpponentData(a.dataset.opponentId);
      const bData = this.getOpponentData(b.dataset.opponentId);
      
      if (!aData || !bData) return 0;
      
      switch (sortBy) {
        case 'winRate':
          return bData.winRate - aData.winRate;
        case 'name':
          return aData.name.localeCompare(bData.name);
        case 'region':
          return aData.region.localeCompare(bData.region);
        case 'recent':
        default:
          // 최근 경기순 (기본값) - rivals.json의 순서 유지
          return 0;
      }
    });
    
    // 정렬된 순서로 DOM 재구성
    opponentItems.forEach(item => opponentsList.appendChild(item));
  },

  getOpponentData(opponentId) {
    const rivalData = AppState.rivals.find(rival => rival.teamId === this.currentTeam.id);
    if (!rivalData) return null;
    
    const opponent = rivalData.opponents.find(opp => opp.opponentId === opponentId);
    if (!opponent) return null;
    
    const opponentTeam = Utils.findTeamById(opponentId);
    if (!opponentTeam) return null;
    
    return {
      ...opponent,
      name: opponentTeam.name,
      region: opponentTeam.region
    };
  },

  updateSortOptions(opponents) {
    const sortSelect = document.getElementById('opponents-sort');
    if (!sortSelect) return;
    
    // 기존 옵션 유지하면서 동적으로 업데이트
    const currentValue = sortSelect.value;
    
    // 지역별 정렬 옵션 추가
    const regions = [...new Set(opponents.map(opp => {
      const team = Utils.findTeamById(opp.opponentId);
      return team ? team.region : '';
    }).filter(Boolean))];
    
    // 기존 옵션 중 region 옵션 찾기
    const regionOption = sortSelect.querySelector('option[value="region"]');
    if (regionOption && regions.length > 1) {
      regionOption.textContent = `지역순 (${regions.length}개 지역)`;
    }
  },

  updateBreadcrumb() {
    const breadcrumb = document.getElementById('team-breadcrumb');
    if (!breadcrumb) return;
    
    if (this.currentOpponent) {
      breadcrumb.innerHTML = `
        <a href="/">홈</a>
        <span class="separator">/</span>
        <span>${this.currentTeam.name}</span>
        <span class="separator">/</span>
        <span>vs ${this.currentOpponent.name}</span>
      `;
    } else {
      breadcrumb.innerHTML = `
        <a href="/">홈</a>
        <span class="separator">/</span>
        <span>${this.currentTeam.name}</span>
      `;
    }
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
  }
};

// 전역으로 노출
window.TeamManager = TeamManager;
