// 검색 관리자
const SearchManager = {
  init() {
    this.bindEvents();
    this.initGlobalSearch();
  },

  bindEvents() {
    // 전역 검색 이벤트
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.handleGlobalSearch(e.target.value);
      });

      globalSearch.addEventListener('focus', () => {
        this.showSuggestions();
      });

      // 검색 버튼 클릭 이벤트
      const searchBtn = document.querySelector('.search-btn');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          this.performSearch(globalSearch.value);
        });
      }

      // Enter 키 이벤트
      globalSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch(e.target.value);
        }
      });
    }

    // 히어로 검색 이벤트
    const heroSearch = document.getElementById('hero-search');
    if (heroSearch) {
      heroSearch.addEventListener('input', (e) => {
        this.handleHeroSearch(e.target.value);
      });

      heroSearch.addEventListener('focus', () => {
        this.showHeroSuggestions();
      });

      // 히어로 검색 버튼 클릭 이벤트
      const heroSearchBtn = document.querySelector('.hero-search-btn');
      if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => {
          this.performHeroSearch(heroSearch.value);
        });
      }

      // Enter 키 이벤트
      heroSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performHeroSearch(e.target.value);
        }
      });
    }

    // 검색 제안 클릭 이벤트
    document.addEventListener('click', (e) => {
      if (e.target.matches('.suggestion-item')) {
        const teamName = e.target.textContent;
        this.selectTeam(teamName);
      }
    });

    // 검색 제안 외부 클릭 시 숨김
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper') && !e.target.closest('.hero-search-wrapper')) {
        this.hideSuggestions();
        this.hideHeroSuggestions();
      }
    });
  },

  initGlobalSearch() {
    // 검색 입력 필드에 포커스 시 제안 표시
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
      globalSearch.addEventListener('focus', () => {
        if (globalSearch.value.trim()) {
          this.showSuggestions();
        }
      });
    }
  },

  handleGlobalSearch(query) {
    if (!query.trim()) {
      this.hideSuggestions();
      return;
    }

    const suggestions = this.getSearchSuggestions(query);
    this.renderSuggestions(suggestions);
    this.showSuggestions();
  },

  getSearchSuggestions(query) {
    const term = query.toLowerCase();
    const suggestions = [];

    // 팀명으로 검색
    AppState.teams.forEach(team => {
      if (team.name.toLowerCase().includes(term) || 
          team.fullName.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'team',
          id: team.id,
          name: team.name,
          fullName: team.fullName,
          displayText: `${team.name} (${team.fullName})`
        });
      }
    });

    // 지역으로 검색
    const regionTeams = AppState.teams.filter(team => 
      team.region.toLowerCase().includes(term)
    );
    
    regionTeams.forEach(team => {
      if (!suggestions.find(s => s.id === team.id)) {
        suggestions.push({
          type: 'region',
          id: team.id,
          name: team.name,
          fullName: team.fullName,
          displayText: `${team.name} - ${team.region}`
        });
      }
    });

    // 연령대로 검색
    const ageTeams = AppState.teams.filter(team => 
      team.ageGroup.toLowerCase().includes(term)
    );
    
    ageTeams.forEach(team => {
      if (!suggestions.find(s => s.id === team.id)) {
        suggestions.push({
          type: 'age',
          id: team.id,
          name: team.name,
          fullName: team.fullName,
          displayText: `${team.name} - ${team.ageGroup}`
        });
      }
    });

    return suggestions.slice(0, 8); // 최대 8개 제안
  },

  renderSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
      suggestionsContainer.innerHTML = `
        <div class="suggestion-item">
          <em>검색 결과가 없습니다</em>
        </div>
      `;
      return;
    }

    suggestionsContainer.innerHTML = suggestions
      .map(suggestion => `
        <div class="suggestion-item" data-team-id="${suggestion.id}">
          ${suggestion.displayText}
        </div>
      `)
      .join('');
  },

  showSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.classList.add('show');
    }
  },

  hideSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.classList.remove('show');
    }
  },

  selectTeam(teamName) {
    // 팀 이름으로 팀 찾기
    const team = AppState.teams.find(t => 
      t.name === teamName || t.fullName === teamName
    );

    if (team) {
      // 팀 페이지로 이동
      window.location.href = `team.html?name=${encodeURIComponent(team.name)}`;
    }

    // 검색 제안 숨기기
    this.hideSuggestions();
    
    // 검색 입력 필드 초기화
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
      globalSearch.value = '';
    }
  },

  performSearch(query) {
    if (!query.trim()) return;

    const suggestions = this.getSearchSuggestions(query);
    
    if (suggestions.length > 0) {
      // 첫 번째 제안 선택
      this.selectTeam(suggestions[0].name);
    } else {
      // 검색 결과가 없을 때 처리
      this.showNoResults(query);
    }
  },

  showNoResults(query) {
    // 검색 결과가 없을 때의 처리
    console.log(`검색 결과 없음: ${query}`);
    
    // 사용자에게 피드백 제공
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.innerHTML = `
        <div class="suggestion-item">
          <em>"${query}"에 대한 검색 결과가 없습니다</em>
        </div>
      `;
      this.showSuggestions();
      
      // 3초 후 자동으로 숨김
      setTimeout(() => {
        this.hideSuggestions();
      }, 3000);
    }
  },

  performHeroSearch(query) {
    if (!query.trim()) return;

    const suggestions = this.getSearchSuggestions(query);
    
    if (suggestions.length > 0) {
      // 첫 번째 제안 선택
      this.selectTeam(suggestions[0].name);
    } else {
      // 검색 결과가 없을 때 처리
      this.showHeroNoResults(query);
    }
  },

  handleHeroSearch(query) {
    if (!query.trim()) {
      this.hideHeroSuggestions();
      return;
    }

    const suggestions = this.getSearchSuggestions(query);
    this.renderHeroSuggestions(suggestions);
    this.showHeroSuggestions();
  },

  showHeroSuggestions() {
    const suggestionsContainer = document.getElementById('hero-search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'block';
    }
  },

  hideHeroSuggestions() {
    const suggestionsContainer = document.getElementById('hero-search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  },

  renderHeroSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('hero-search-suggestions');
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
      suggestionsContainer.innerHTML = `
        <div class="suggestion-item">
          <em>검색 결과가 없습니다</em>
        </div>
      `;
      return;
    }

    const suggestionsHTML = suggestions.map(suggestion => `
      <div class="suggestion-item" data-team-id="${suggestion.id}">
        <div class="suggestion-content">
          <span class="suggestion-name">${suggestion.displayText}</span>
          <span class="suggestion-type">팀</span>
        </div>
      </div>
    `).join('');

    suggestionsContainer.innerHTML = suggestionsHTML;
  },

  showHeroNoResults(query) {
    const suggestionsContainer = document.getElementById('hero-search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.innerHTML = `
        <div class="suggestion-item">
          <em>"${query}"에 대한 검색 결과가 없습니다</em>
        </div>
      `;
      this.showHeroSuggestions();
      
      // 3초 후 자동으로 숨김
      setTimeout(() => {
        this.hideHeroSuggestions();
      }, 3000);
    }
  },

  // 고급 검색 기능
  advancedSearch(criteria) {
    const { teamName, region, ageGroup, minWinRate, maxWinRate } = criteria;
    
    let results = [...AppState.teams];

    if (teamName) {
      const term = teamName.toLowerCase();
      results = results.filter(team => 
        team.name.toLowerCase().includes(term) || 
        team.fullName.toLowerCase().includes(term)
      );
    }

    if (region) {
      results = results.filter(team => team.region === region);
    }

    if (ageGroup) {
      results = results.filter(team => team.ageGroup === ageGroup);
    }

    if (minWinRate !== undefined) {
      results = results.filter(team => team.stats.winRate >= minWinRate);
    }

    if (maxWinRate !== undefined) {
      results = results.filter(team => team.stats.winRate <= maxWinRate);
    }

    return results;
  },

  // 검색 히스토리 관리
  addToHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // 중복 제거
    history = history.filter(item => item !== query);
    
    // 맨 앞에 추가
    history.unshift(query);
    
    // 최대 10개만 유지
    history = history.slice(0, 10);
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
  },

  getSearchHistory() {
    return JSON.parse(localStorage.getItem('searchHistory') || '[]');
  },

  clearSearchHistory() {
    localStorage.removeItem('searchHistory');
  }
};

// 전역으로 노출
window.SearchManager = SearchManager;
