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
    const self = this;
    document.addEventListener('click', (e) => {
      console.log('클릭 이벤트 발생:', e.target); // 디버깅용
      console.log('클릭된 요소 클래스:', e.target.className); // 디버깅용
      
      const suggestionItem = e.target.closest('.suggestion-item');
      if (suggestionItem) {
        e.preventDefault(); // 기본 동작 방지
        e.stopPropagation(); // 이벤트 버블링 방지
        
        console.log('클릭된 제안 요소:', suggestionItem); // 디버깅용
        console.log('suggestion-item HTML:', suggestionItem.outerHTML); // 디버깅용
        
        // data-team-id 추출 (여러 방법 시도)
        let teamId = suggestionItem.getAttribute('data-team-id') || 
                     suggestionItem.dataset.teamId ||
                     suggestionItem.getAttribute('data-team-id');
                     
        console.log('추출된 팀 ID (방법 1):', teamId); // 디버깅용
        console.log('dataset:', suggestionItem.dataset); // 디버깅용
        
        // 팀 ID가 없으면 텍스트에서 추출 시도
        if (!teamId) {
          const text = suggestionItem.textContent.trim();
          console.log('텍스트에서 팀 ID 추출 시도:', text);
          
          // 팀 이름으로 ID 찾기 (실제 팀명 기준)
          const teamMappings = {
            '레오파즈': 1,    // 서울 레오파즈
            '타이거스': 2,    // 부산 타이거스
            '이글스': 3,      // 대구 이글스
            '베어스': 4,      // 인천 베어스
            '샤크스': 5,      // 울산 샤크스
            '드래곤스': 6,    // 광주 드래곤스
            '라이온스': 7,    // 대전 라이온스
            '팔콘스': 8       // 제주 팔콘스
          };
          
          for (const [name, id] of Object.entries(teamMappings)) {
            if (text.includes(name)) {
              teamId = id;
              console.log(`텍스트 "${text}"에서 팀 "${name}" 발견, ID: ${id}`);
              break;
            }
          }
        }
        
        console.log('최종 팀 ID:', teamId); // 디버깅용
        
        if (teamId) {
          console.log('팀 상세 페이지로 이동 시도');
          self.selectTeamById(teamId);
        } else {
          console.error('팀 ID를 찾을 수 없습니다');
          alert('팀을 찾을 수 없습니다. 다시 시도해주세요.');
        }
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

    console.log('검색어:', term); // 디버깅용
    console.log('AppState.teams:', AppState.teams); // 디버깅용
    console.log('팀 개수:', AppState.teams?.length); // 디버깅용

    // AppState.teams가 비어있거나 올바르지 않은 경우 대체 데이터 사용
    let teamsToSearch = AppState.teams;
    if (!teamsToSearch || teamsToSearch.length === 0) {
      console.log('AppState.teams가 비어있음, 대체 데이터 사용');
      teamsToSearch = [
        {
          id: 1,
          name: "레오파즈",
          fullName: "서울 레오파즈",
          region: "서울",
          ageGroup: "U16"
        },
        {
          id: 2,
          name: "타이거스",
          fullName: "부산 타이거스",
          region: "부산",
          ageGroup: "U18"
        },
        {
          id: 3,
          name: "이글스",
          fullName: "대구 이글스",
          region: "대구",
          ageGroup: "U12"
        },
        {
          id: 4,
          name: "베어스",
          fullName: "인천 베어스",
          region: "인천",
          ageGroup: "U15"
        },
        {
          id: 5,
          name: "아이스드래곤즈",
          fullName: "서울 아이스드래곤즈",
          region: "서울",
          ageGroup: "U16"
        },
        {
          id: 6,
          name: "프로스트울브즈",
          fullName: "부산 프로스트울브즈",
          region: "부산",
          ageGroup: "U18"
        }
      ];
    }

    // 팀명으로 검색
    teamsToSearch.forEach(team => {
      const teamNameMatch = team.name.toLowerCase().includes(term);
      const fullNameMatch = team.fullName && team.fullName.toLowerCase().includes(term);
      console.log(`팀 확인: ${team.name}, ID: ${team.id}, 매칭: ${teamNameMatch || fullNameMatch}`); // 디버깅용
      
      if (teamNameMatch || fullNameMatch) {
        // 팀 ID 매핑 (실제 JSON 데이터 기준)
        const teamIdMapping = {
          'leopards': 1,  // 레오파즈 (서울)
          'tigers': 2,    // 타이거스 (부산)
          'eagles': 3,    // 이글스 (대구)
          'bears': 4,     // 베어스 (인천)
          'sharks': 5,    // 샤크스 (울산)
          'dragons': 6,   // 드래곤스 (광주)
          'lions': 7,     // 라이온스 (대전)
          'falcons': 8    // 팔콘스 (제주)
        };
        
        let numericId = teamIdMapping[team.id] || parseInt(team.id, 10);
        if (isNaN(numericId)) {
          // 팀 이름으로 ID 찾기 (실제 팀명 기준)
          const nameMapping = {
            '레오파즈': 1,    // 서울 레오파즈
            '타이거스': 2,    // 부산 타이거스
            '이글스': 3,      // 대구 이글스
            '베어스': 4,      // 인천 베어스
            '샤크스': 5,      // 울산 샤크스
            '드래곤스': 6,    // 광주 드래곤스
            '라이온스': 7,    // 대전 라이온스
            '팔콘스': 8       // 제주 팔콘스
          };
          numericId = nameMapping[team.name] || 1;
        }
        
        const suggestion = {
          type: 'team',
          id: numericId,
          name: team.name,
          fullName: team.fullName || team.name,
          displayText: `${team.name}${team.fullName ? ` (${team.fullName})` : ''}`
        };
        console.log('생성된 제안:', suggestion); // 디버깅용
        suggestions.push(suggestion);
      }
    });

    // 지역으로 검색
    const regionTeams = teamsToSearch.filter(team => 
      team.region && team.region.toLowerCase().includes(term)
    );
    
    regionTeams.forEach(team => {
      // 실제 JSON 데이터 기준 ID 매핑
      const teamIdMapping = {
        'leopards': 1, 'tigers': 2, 'eagles': 3, 'bears': 4,
        'sharks': 5, 'dragons': 6, 'lions': 7, 'falcons': 8
      };
      const nameMapping = {
        '레오파즈': 1, '타이거스': 2, '이글스': 3, '베어스': 4,
        '샤크스': 5, '드래곤스': 6, '라이온스': 7, '팔콘스': 8
      };
      
      let numericId = teamIdMapping[team.id] || nameMapping[team.name] || parseInt(team.id, 10) || 1;
      
      if (!suggestions.find(s => s.id === numericId)) {
        suggestions.push({
          type: 'region',
          id: numericId,
          name: team.name,
          fullName: team.fullName || team.name,
          displayText: `${team.name} - ${team.region}`
        });
      }
    });

    // 연령대로 검색
    const ageTeams = teamsToSearch.filter(team => 
      team.ageGroup && team.ageGroup.toLowerCase().includes(term)
    );
    
    ageTeams.forEach(team => {
      // 실제 JSON 데이터 기준 ID 매핑
      const teamIdMapping = {
        'leopards': 1, 'tigers': 2, 'eagles': 3, 'bears': 4,
        'sharks': 5, 'dragons': 6, 'lions': 7, 'falcons': 8
      };
      const nameMapping = {
        '레오파즈': 1, '타이거스': 2, '이글스': 3, '베어스': 4,
        '샤크스': 5, '드래곤스': 6, '라이온스': 7, '팔콘스': 8
      };
      
      let numericId = teamIdMapping[team.id] || nameMapping[team.name] || parseInt(team.id, 10) || 1;
      
      if (!suggestions.find(s => s.id === numericId)) {
        suggestions.push({
          type: 'age',
          id: numericId,
          name: team.name,
          fullName: team.fullName || team.name,
          displayText: `${team.name} - ${team.ageGroup}`
        });
      }
    });

    return suggestions.slice(0, 8); // 최대 8개 제안
  },

  renderSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) {
      console.log('search-suggestions 컨테이너를 찾을 수 없음');
      return;
    }

    if (suggestions.length === 0) {
      suggestionsContainer.innerHTML = `
        <div class="suggestion-item">
          <em>검색 결과가 없습니다</em>
        </div>
      `;
      return;
    }

    console.log('렌더링할 제안들:', suggestions); // 디버깅용

    // 각 제안에 대해 개별적으로 HTML 생성 및 검증
    const htmlParts = suggestions.map(suggestion => {
      console.log('제안 처리 중:', suggestion);
      console.log('제안 ID:', suggestion.id, '타입:', typeof suggestion.id);
      
      // ID가 숫자인지 확인하고 강제 변환
      const teamId = parseInt(suggestion.id, 10);
      if (isNaN(teamId)) {
        console.error('잘못된 팀 ID:', suggestion.id);
        return '';
      }
      
      const html = `<div class="suggestion-item" data-team-id="${teamId}">${suggestion.displayText}</div>`;
      console.log('생성된 HTML:', html);
      return html;
    }).filter(html => html); // 빈 문자열 제거

    suggestionsContainer.innerHTML = htmlParts.join('');
      
    console.log('최종 렌더링된 HTML:', suggestionsContainer.innerHTML); // 디버깅용
    
    // 렌더링 후 실제 DOM 요소들 확인
    const renderedItems = suggestionsContainer.querySelectorAll('.suggestion-item');
    console.log('렌더링된 DOM 요소들:', renderedItems);
    renderedItems.forEach((item, index) => {
      console.log(`아이템 ${index}:`, item.outerHTML);
      console.log(`데이터 속성:`, item.dataset);
    });
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
      window.location.href = `team.html?id=${team.id}`;
    }

    // 검색 제안 숨기기
    this.hideSuggestions();
    
    // 검색 입력 필드 초기화
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
      globalSearch.value = '';
    }
  },

  selectTeamById(teamId) {
    console.log('selectTeamById 호출됨, 팀 ID:', teamId); // 디버깅용
    console.log('팀 ID 타입:', typeof teamId); // 디버깅용
    
    // 팀 ID를 숫자로 확실히 변환
    const numericTeamId = parseInt(teamId, 10);
    console.log('변환된 숫자 ID:', numericTeamId); // 디버깅용
    
    if (isNaN(numericTeamId) || numericTeamId < 1 || numericTeamId > 6) {
      console.error('잘못된 팀 ID:', teamId);
      return;
    }
    
    // 팀 ID로 팀 상세 페이지로 이동
    const url = `team.html?id=${numericTeamId}`;
    console.log('이동할 URL:', url); // 디버깅용
    console.log('현재 URL:', window.location.href); // 디버깅용
    
    // 강제로 페이지 리로드하면서 이동
    window.location.assign(url);

    // 검색 제안 숨기기
    this.hideSuggestions();
    this.hideHeroSuggestions();
    
    // 검색 입력 필드 초기화
    const globalSearch = document.getElementById('global-search');
    const heroSearch = document.getElementById('hero-search');
    if (globalSearch) {
      globalSearch.value = '';
    }
    if (heroSearch) {
      heroSearch.value = '';
    }
  },

  performSearch(query) {
    if (!query.trim()) return;

    const suggestions = this.getSearchSuggestions(query);
    
    if (suggestions.length > 0) {
      // 첫 번째 제안 선택
      this.selectTeamById(suggestions[0].id);
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
      this.selectTeamById(suggestions[0].id);
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

window.SearchManager = SearchManager;
