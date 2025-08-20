// 공통 헤더/푸터 로드 및 네비게이션 관리
const CommonManager = {
  init() {
    this.loadHeader();
    this.loadFooter();
    this.setActiveNavigation();
  },

  // 헤더 로드
  async loadHeader() {
    try {
      const response = await fetch('header.html');
      const headerHtml = await response.text();
      document.body.insertAdjacentHTML('afterbegin', headerHtml);
      
      // 헤더 로드 후 필요한 초기화 작업
      this.initializeHeader();
    } catch (error) {
      console.error('헤더 로드 실패:', error);
    }
  },

  // 푸터 로드
  async loadFooter() {
    try {
      const response = await fetch('footer.html');
      const footerHtml = await response.text();
      document.body.insertAdjacentHTML('beforeend', footerHtml);
    } catch (error) {
      console.error('푸터 로드 실패:', error);
    }
  },

  // 헤더 초기화
  initializeHeader() {
    // 전역 검색 기능 초기화
    if (window.SearchManager) {
      window.SearchManager.init();
    }
    
    // Lucide 아이콘 초기화
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  // 현재 페이지에 맞는 네비게이션 활성화
  setActiveNavigation() {
    const currentPage = this.getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.id === `nav-${currentPage}`) {
        link.classList.add('active');
      }
    });
  },

  // 현재 페이지 식별
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename === 'index.html' || filename === '' || filename === '/') {
      return 'home';
    } else if (filename === 'teams.html') {
      return 'teams';
    } else if (filename === 'matches.html') {
      return 'matches';
    } else if (filename === 'stats.html') {
      return 'stats';
    } else if (filename === 'team.html') {
      return 'teams';
    } else if (filename === 'match.html') {
      return 'matches';
    }
    
    return 'home';
  }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  CommonManager.init();
});

// 전역으로 노출
window.CommonManager = CommonManager;
