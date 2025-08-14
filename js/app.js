// 전역 상태 관리
const AppState = {
  currentSeason: '2024',
  currentAgeGroup: 'all',
  teams: [],
  matches: [],
  rivals: [],
  currentTeam: null,
  currentOpponent: null,
  isLoading: false
};

// 유틸리티 함수들
const Utils = {
  // 배열 그룹화
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // 배열 합계 계산
  sumBy: (array, key) => {
    return array.reduce((sum, item) => sum + (item[key] || 0), 0);
  },

  // 최근 N경기 폼 계산
  getRecentForm: (formArray, count = 5) => {
    return formArray.slice(-count);
  },

  // 승률 계산
  calculateWinRate: (wins, draws, losses) => {
    const total = wins + draws + losses;
    return total > 0 ? ((wins + draws * 0.5) / total * 100).toFixed(1) : 0;
  },

  // 날짜 포맷팅
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // 시간 포맷팅
  formatTime: (timeString) => {
    return timeString;
  },

  // 상태 뱃지 생성
  createStatusBadge: (result) => {
    const badges = {
      'W': '<span class="status-badge status-win">승</span>',
      'L': '<span class="status-badge status-loss">패</span>',
      'D': '<span class="status-badge status-draw">무</span>'
    };
    return badges[result] || '';
  },

  // 팀 이름으로 팀 찾기
  findTeamByName: (name) => {
    return AppState.teams.find(team =>
      team.name.toLowerCase().includes(name.toLowerCase()) ||
      team.fullName.toLowerCase().includes(name.toLowerCase())
    );
  },

  // 팀 ID로 팀 찾기
  findTeamById: (id) => {
    return AppState.teams.find(team => team.id === id);
  },

  // 경기 결과 판정
  getMatchResult: (homeScore, awayScore, homeTeamId, currentTeamId) => {
    if (homeTeamId === currentTeamId) {
      if (homeScore > awayScore) return 'W';
      if (homeScore < awayScore) return 'L';
      return 'D';
    } else {
      if (awayScore > homeScore) return 'W';
      if (awayScore < homeScore) return 'L';
      return 'D';
    }
  },

  // 로딩 상태 토글
  setLoading: (loading) => {
    AppState.isLoading = loading;
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
      el.style.display = loading ? 'block' : 'none';
    });
  },

  // 에러 처리
  handleError: (error, context = '') => {
    console.error(`Error in ${context}:`, error);
    // 사용자에게 에러 메시지 표시
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = `오류가 발생했습니다: ${error.message}`;
    document.body.appendChild(errorMessage);

    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }
};

// 데이터 로더
const DataLoader = {
  async loadTeams() {
    try {
      Utils.setLoading(true);
      console.log('팀 데이터 로딩 시작...');
      const response = await fetch('data/teams.json');
      if (!response.ok) throw new Error('팀 데이터를 불러올 수 없습니다');
      const data = await response.json();
      console.log('팀 JSON 데이터:', data);
      console.log('data.teams:', data.teams);
      console.log('data.teams 타입:', typeof data.teams);
      console.log('data.teams 길이:', data.teams?.length);
      
      if (!data.teams) {
        console.error('data.teams가 undefined입니다');
        return [];
      }
      
      AppState.teams = data.teams;
      console.log('팀 데이터 로드됨:', AppState.teams.length);
      return data.teams;
    } catch (error) {
      Utils.handleError(error, 'loadTeams');
      return [];
    } finally {
      Utils.setLoading(false);
    }
  },

  async loadMatches() {
    try {
      Utils.setLoading(true);
      const response = await fetch('data/matches.json');
      if (!response.ok) throw new Error('경기 데이터를 불러올 수 없습니다');
      const data = await response.json();
      AppState.matches = data.matches;
      console.log('경기 데이터 로드됨:', AppState.matches.length);
      return data.matches;
    } catch (error) {
      Utils.handleError(error, 'loadMatches');
      return [];
    } finally {
      Utils.setLoading(false);
    }
  },

  async loadRivals() {
    try {
      Utils.setLoading(true);
      const response = await fetch('data/rivals.json');
      if (!response.ok) throw new Error('상대전적 데이터를 불러올 수 없습니다');
      const data = await response.json();
      AppState.rivals = data.rivals;
      console.log('상대전적 데이터 로드됨:', AppState.rivals.length);
      return data.rivals;
    } catch (error) {
      Utils.handleError(error, 'loadRivals');
      return [];
    } finally {
      Utils.setLoading(false);
    }
  },

  async loadAllData() {
    console.log('모든 데이터 로딩 시작...');
    try {
      const [teams, matches, rivals] = await Promise.all([
        this.loadTeams(),
        this.loadMatches(),
        this.loadRivals()
      ]);
      console.log('모든 데이터 로딩 완료');
      console.log('로드된 데이터:', {
        teams: teams.length,
        matches: matches.length,
        rivals: rivals.length
      });
      return { teams, matches, rivals };
    } catch (error) {
      console.error('데이터 로딩 중 오류:', error);
      throw error;
    }
  }
};

// 필터 관리
const FilterManager = {
  init() {
    this.bindEvents();
    this.updateFilters();
  },

  bindEvents() {
    const seasonFilter = document.getElementById('season-filter');
    const ageFilter = document.getElementById('age-filter');

    if (seasonFilter) {
      seasonFilter.addEventListener('change', (e) => {
        AppState.currentSeason = e.target.value;
        this.updateFilters();
        this.notifyFilterChange();
      });
    }

    if (ageFilter) {
      ageFilter.addEventListener('change', (e) => {
        AppState.currentAgeGroup = e.target.value;
        this.updateFilters();
        this.notifyFilterChange();
      });
    }
  },

  updateFilters() {
    console.log('Filters updated:', {
      season: AppState.currentSeason,
      ageGroup: AppState.currentAgeGroup
    });
  },

  notifyFilterChange() {
    const event = new CustomEvent('filtersChanged', {
      detail: {
        season: AppState.currentSeason,
        ageGroup: AppState.currentAgeGroup
      }
    });
    document.dispatchEvent(event);
  },

  getFilteredMatches() {
    let filtered = AppState.matches;

    if (AppState.currentSeason !== 'all') {
      filtered = filtered.filter(match => match.season === AppState.currentSeason);
    }

    if (AppState.currentAgeGroup !== 'all') {
      filtered = filtered.filter(match => match.ageGroup === AppState.currentAgeGroup);
    }

    return filtered;
  },

  getFilteredTeams() {
    let filtered = AppState.teams;

    if (AppState.currentAgeGroup !== 'all') {
      filtered = filtered.filter(team => team.ageGroup === AppState.currentAgeGroup);
    }

    return filtered;
  }
};

// 라우터
const Router = {
  init() {
    this.bindEvents();
    this.handleRoute();
  },

  bindEvents() {
    window.addEventListener('popstate', () => this.handleRoute());

    document.addEventListener('click', (e) => {
      if (e.target.matches('a[data-route]')) {
        e.preventDefault();
        const route = e.target.getAttribute('data-route');
        this.navigateTo(route);
      }
    });
  },

  navigateTo(route) {
    history.pushState({}, '', route);
    this.handleRoute();
  },

  handleRoute() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    if (path === '/' || path === '/index.html') {
      this.showHomePage();
    } else if (path === '/team.html') {
      const teamName = searchParams.get('name');
      if (teamName) {
        this.showTeamPage(teamName);
      } else {
        this.show404Page();
      }
    } else if (path === '/match.html') {
      const matchId = searchParams.get('id');
      if (matchId) {
        this.showMatchPage(matchId);
      } else {
        this.show404Page();
      }
    } else {
      this.show404Page();
    }
  },

  showHomePage() {
    console.log('Showing home page');
  },

  showTeamPage(teamName) {
    console.log('Showing team page for:', teamName);
  },

  showMatchPage(matchId) {
    console.log('Showing match page for:', matchId);
  },

  show404Page() {
    console.log('Showing 404 page');
  }
};

// 홈페이지 렌더링
const HomePageManager = {
  init() {
    console.log('HomePageManager 초기화 시작');
    this.renderHotMatches();
    this.renderTopTeams();
    this.renderAllTeams();
    this.bindTeamsEvents();
    console.log('HomePageManager 초기화 완료');
  },

  renderHotMatches() {
    const hotMatchesGrid = document.getElementById('hot-matches-grid');
    if (!hotMatchesGrid) {
      console.log('hot-matches-grid를 찾을 수 없음');
      return;
    }

    const recentMatches = AppState.matches
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    console.log('최근 경기 렌더링:', recentMatches.length);

    if (recentMatches.length === 0) {
      hotMatchesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏒</div>
          <p>최근 경기 데이터가 없습니다</p>
        </div>
      `;
      return;
    }

    hotMatchesGrid.innerHTML = recentMatches
      .map(match => this.renderMatchCard(match))
      .join('');
  },

  renderTopTeams() {
    const topTeamsGrid = document.getElementById('top-teams-grid');
    if (!topTeamsGrid) {
      console.log('top-teams-grid를 찾을 수 없음');
      return;
    }

    const topTeams = AppState.teams
      .sort((a, b) => b.stats.winRate - a.stats.winRate)
      .slice(0, 6);

    console.log('인기 팀 렌더링:', topTeams.length);

    if (topTeams.length === 0) {
      topTeamsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏒</div>
          <p>팀 데이터가 없습니다</p>
        </div>
      `;
      return;
    }

    topTeamsGrid.innerHTML = topTeams
      .map(team => this.renderTeamCard(team))
      .join('');
  },

  renderAllTeams() {
    const allTeamsGrid = document.getElementById('all-teams-grid');
    if (!allTeamsGrid) {
      console.log('all-teams-grid를 찾을 수 없음');
      return;
    }

    const sortedTeams = this.getSortedTeams();
    const filteredTeams = this.getFilteredTeams(sortedTeams);

    console.log('전체 팀 렌더링:', filteredTeams.length);

    if (filteredTeams.length === 0) {
      allTeamsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏒</div>
          <p>검색 조건에 맞는 팀이 없습니다</p>
        </div>
      `;
      return;
    }

    allTeamsGrid.innerHTML = filteredTeams
      .map(team => this.renderTeamCard(team))
      .join('');
  },

  getSortedTeams() {
    const sortBy = document.getElementById('teams-sort')?.value || 'winRate';
    const teams = [...AppState.teams];

    switch (sortBy) {
      case 'winRate':
        return teams.sort((a, b) => b.stats.winRate - a.stats.winRate);
      case 'name':
        return teams.sort((a, b) => a.name.localeCompare(b.name));
      case 'region':
        return teams.sort((a, b) => a.region.localeCompare(b.region));
      case 'ageGroup':
        return teams.sort((a, b) => a.ageGroup.localeCompare(b.ageGroup));
      case 'totalMatches':
        return teams.sort((a, b) => b.stats.totalMatches - a.stats.totalMatches);
      default:
        return teams;
    }
  },

  getFilteredTeams(teams) {
    const searchTerm = document.getElementById('teams-search')?.value || '';
    if (!searchTerm.trim()) return teams;

    const term = searchTerm.toLowerCase();
    return teams.filter(team => 
      team.name.toLowerCase().includes(term) ||
      team.fullName.toLowerCase().includes(term) ||
      team.region.toLowerCase().includes(term) ||
      team.ageGroup.toLowerCase().includes(term)
    );
  },

  bindTeamsEvents() {
    const sortSelect = document.getElementById('teams-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.renderAllTeams();
      });
    }

    const searchInput = document.getElementById('teams-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.renderAllTeams();
      });
    }
  },

  renderMatchCard(match) {
    const homeTeam = Utils.findTeamById(match.homeTeam);
    const awayTeam = Utils.findTeamById(match.awayTeam);

    if (!homeTeam || !awayTeam) return '';

    return `
      <div class="card match-card">
        <div class="match-teams">
          <div class="team-name">${homeTeam.name}</div>
          <div class="vs">vs</div>
          <div class="team-name">${awayTeam.name}</div>
        </div>
        <div class="match-score">
          ${match.homeScore} - ${match.awayScore}
        </div>
        <div class="match-info">
          <div>${Utils.formatDate(match.date)}</div>
          <div>${match.competition}</div>
          <div>${match.venue}</div>
        </div>
        <a href="match.html?id=${match.id}" class="match-link">상세보기</a>
      </div>
    `;
  },

  renderTeamCard(team) {
    const recentForm = Utils.getRecentForm(team.recentForm, 5);
    const formHTML = recentForm.map(result => Utils.createStatusBadge(result)).join('');

    return `
      <div class="card team-card">
        <div class="team-emblem" style="background-color: ${team.colors[0]}; color: ${team.colors[1]}">
          ${team.name.charAt(0)}
        </div>
        <h3 class="team-name">${team.name}</h3>
        <div class="team-info">
          <div>${team.fullName}</div>
          <div>${team.ageGroup} • ${team.region}</div>
          <div>승률: ${team.stats.winRate}%</div>
        </div>
        <div class="team-form">
          <div class="form-label">최근 5경기:</div>
          <div class="form-display">${formHTML}</div>
        </div>
        <a href="team.html?name=${encodeURIComponent(team.name)}" class="team-link">팀 상세보기</a>
      </div>
    `;
  }
};

// 애플리케이션 초기화
const App = {
  async init() {
    try {
      console.log('아이스하키 랭킹 앱 초기화 시작...');

      // 데이터 로드
      await DataLoader.loadAllData();

      // 필터 초기화
      FilterManager.init();

      // 라우터 초기화
      Router.init();

      // 검색 초기화
      if (typeof SearchManager !== 'undefined') {
        SearchManager.init();
      }

      // 홈페이지 매니저 초기화
      console.log('현재 경로:', window.location.pathname);
      if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '/icehockey_rank/') {
        console.log('홈페이지 매니저 초기화 시작');
        HomePageManager.init();
      } else {
        console.log('홈페이지가 아님, 경로:', window.location.pathname);
      }

      // 팀 페이지 초기화
      if (window.location.pathname.includes('team.html') && typeof TeamManager !== 'undefined') {
        TeamManager.init();
      }

      // 경기 페이지 초기화
      if (window.location.pathname.includes('match.html') && typeof MatchManager !== 'undefined') {
        MatchManager.init();
      }

      console.log('앱 초기화 완료');
    } catch (error) {
      Utils.handleError(error, 'App.init');
    }
  }
};

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// 전역으로 노출
window.AppState = AppState;
window.Utils = Utils;
window.DataLoader = DataLoader;
window.FilterManager = FilterManager;
window.Router = Router;
window.HomePageManager = HomePageManager;
