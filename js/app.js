// API 설정
const API = {
    baseURL: 'http://localhost:3001/api',
    endpoints: {
        teams: '/teams',
        matches: '/matches',
        stats: '/stats',
        h2h: '/h2h'
    },
    
    // 공통 fetch 함수
    async fetch(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            const data = await response.json();
            
            if (!data.success && response.status >= 400) {
                throw new Error(data.message || 'API 요청 실패');
            }
            
            return data;
        } catch (error) {
            console.error('API 요청 오류:', error);
            // 개발 중에는 더미 데이터 사용
            if (endpoint.includes('/teams')) {
                console.warn('API 연결 실패, 더미 데이터 사용');
                return { success: true, data: AppState.teams };
            }
            throw error;
        }
    }
};

// 전역 상태 관리
const AppState = {
  currentSeason: '2024',
  currentAgeGroup: 'all',
  teams: [
    {
      id: 1,
      name: "레오파즈",
      fullName: "서울 레오파즈",
      region: "서울",
      ageGroup: "U16",
      winRate: 78.5,
      totalMatches: 24,
      wins: 19,
      losses: 4,
      draws: 1,
      avgScore: 3.2,
      recentMatches: ['W', 'L', 'W', 'D', 'W'],
      founded: 2010,
      logo: "레",
      stats: {
        winRate: 78.5,
        totalMatches: 24
      },
      recentForm: ['W', 'L', 'W', 'D', 'W'],
      colors: ['#3b82f6', '#ffffff']
    },
    {
      id: 2,
      name: "타이거스",
      fullName: "부산 타이거스",
      region: "부산",
      ageGroup: "U18",
      winRate: 67.3,
      totalMatches: 52,
      wins: 35,
      losses: 9,
      draws: 8,
      avgScore: 1.50,
      recentMatches: ['W', 'D', 'W', 'W', 'L'],
      founded: 2016,
      logo: "타",
      stats: {
        winRate: 67.3,
        totalMatches: 52
      },
      recentForm: ['W', 'D', 'W', 'W', 'L', 'W', 'W', 'D', 'W', 'W'],
      colors: ['#FF6B35', '#000000']
    },
    {
      id: 3,
      name: "이글스",
      fullName: "대구 이글스",
      region: "대구",
      ageGroup: "U12",
      winRate: 57.9,
      totalMatches: 38,
      wins: 22,
      losses: 10,
      draws: 6,
      avgScore: 1.76,
      recentMatches: ['L', 'W', 'W', 'D', 'W'],
      founded: 2020,
      logo: "이",
      stats: {
        winRate: 57.9,
        totalMatches: 38
      },
      recentForm: ['L', 'W', 'W', 'D', 'W', 'L', 'W', 'W', 'D', 'W'],
      colors: ['#20C997', '#FFFFFF']
    },
    {
      id: 4,
      name: "베어스",
      fullName: "인천 베어스",
      region: "인천",
      ageGroup: "U15",
      winRate: 57.1,
      totalMatches: 42,
      wins: 24,
      losses: 11,
      draws: 7,
      avgScore: 1.69,
      recentMatches: ['W', 'L', 'D', 'W', 'L'],
      founded: 2019,
      logo: "베",
      stats: {
        winRate: 57.1,
        totalMatches: 42
      },
      recentForm: ['W', 'L', 'D', 'W', 'L', 'W', 'D', 'W', 'L', 'W'],
      colors: ['#8B4513', '#FFFFFF']
    },
    {
      id: 5,
      name: "샤크스",
      fullName: "울산 샤크스",
      region: "울산",
      ageGroup: "U10",
      winRate: 51.4,
      totalMatches: 35,
      wins: 18,
      losses: 9,
      draws: 8,
      avgScore: 1.49,
      recentMatches: ['D', 'W', 'L', 'W', 'D'],
      founded: 2021,
      logo: "샤",
      stats: {
        winRate: 51.4,
        totalMatches: 35
      },
      recentForm: ['D', 'W', 'L', 'W', 'D', 'W', 'L', 'W', 'D', 'W'],
      colors: ['#1E3A8A', '#FFFFFF']
    },
    {
      id: 6,
      name: "드래곤스",
      fullName: "광주 드래곤스",
      region: "광주",
      ageGroup: "U18",
      winRate: 62.5,
      totalMatches: 48,
      wins: 30,
      losses: 12,
      draws: 6,
      avgScore: 1.98,
      recentMatches: ['W', 'W', 'L', 'D', 'W'],
      founded: 2017,
      logo: "드",
      stats: {
        winRate: 62.5,
        totalMatches: 48
      },
      recentForm: ['W', 'W', 'L', 'D', 'W', 'W', 'L', 'W', 'D', 'W'],
      colors: ['#DC2626', '#FFD700']
    },
    {
      id: 7,
      name: "라이온스",
      fullName: "대전 라이온스",
      region: "대전",
      ageGroup: "U12",
      winRate: 53.6,
      totalMatches: 28,
      wins: 15,
      losses: 9,
      draws: 4,
      avgScore: 1.61,
      recentMatches: ['W', 'L', 'W', 'D', 'L'],
      founded: 2022,
      logo: "라",
      stats: {
        winRate: 53.6,
        totalMatches: 28
      },
      recentForm: ['W', 'L', 'W', 'D', 'L', 'W', 'W', 'L', 'D', 'W'],
      colors: ['#FFD700', '#000000']
    },
    {
      id: 8,
      name: "팔콘스",
      fullName: "제주 팔콘스",
      region: "제주",
      ageGroup: "U15",
      winRate: 50.0,
      totalMatches: 32,
      wins: 16,
      losses: 10,
      draws: 6,
      avgScore: 1.50,
      recentMatches: ['L', 'W', 'D', 'W', 'L'],
      founded: 2020,
      logo: "팔",
      stats: {
        winRate: 50.0,
        totalMatches: 32
      },
      recentForm: ['L', 'W', 'D', 'W', 'L', 'D', 'W', 'L', 'W', 'D'],
      colors: ['#059669', '#FFFFFF']
    }
  ],
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
      
      // API에서 팀 데이터 로드 시도
      try {
        const response = await API.fetch(API.endpoints.teams);
        console.log('API 응답:', response);
        
        if (response.success && response.data) {
          // API 데이터 구조를 프론트엔드 형식으로 변환
          const teams = response.data.map(team => ({
            id: team.id || team.team_id,
            name: team.name || team.team_name,
            fullName: team.fullName || team.full_name,
            region: team.region,
            ageGroup: team.ageGroup || team.age_group,
            winRate: parseFloat(team.winRate || team.win_rate || 0),
            totalMatches: team.totalMatches || team.total_matches || 0,
            wins: team.wins || 0,
            losses: team.losses || 0,
            draws: team.draws || 0,
            goalsFor: team.goalsFor || team.goals_for || 0,
            goalsAgainst: team.goalsAgainst || team.goals_against || 0,
            points: team.points || 0,
            coach: team.coach,
            captain: team.captain,
            founded: team.founded,
            homeVenue: team.homeVenue || team.home_venue,
            description: team.description,
            colors: team.colors || ['#3b82f6', '#ffffff'],
            logo: team.name ? team.name.charAt(0) : '팀',
            // 계산된 필드들
            avgScore: team.totalMatches > 0 ? (team.goalsFor / team.totalMatches).toFixed(2) : 0,
            recentForm: ['W', 'W', 'L', 'D', 'W'], // TODO: API에서 가져오기
            recentMatches: ['W', 'W', 'L', 'D', 'W'] // TODO: API에서 가져오기
          }));
          
          AppState.teams = teams;
          console.log('API에서 팀 데이터 로드됨:', teams.length);
          return teams;
        }
      } catch (apiError) {
        console.warn('API 로드 실패, JSON 파일에서 로드 시도:', apiError.message);
      }
      
      // API 실패 시 JSON 파일에서 로드
      const response = await fetch('data/teams.json');
      if (!response.ok) throw new Error('팀 데이터를 불러올 수 없습니다');
      const data = await response.json();
      
      if (!data.teams) {
        console.error('data.teams가 undefined입니다');
        return AppState.teams; // 기존 더미 데이터 사용
      }
      
      AppState.teams = data.teams;
      console.log('JSON에서 팀 데이터 로드됨:', AppState.teams.length);
      return data.teams;
    } catch (error) {
      Utils.handleError(error, 'loadTeams');
      console.log('기존 더미 데이터 사용');
      return AppState.teams; // 기존 더미 데이터 반환
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
        <a href="team.html?id=${team.id}" class="team-link">팀 상세보기</a>
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
