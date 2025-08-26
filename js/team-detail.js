// 팀 데이터 (teams.html과 동일한 데이터)
const teamsData = [
    {
        id: 1,
        name: "레오파즈",
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
        logoImage: "assets/emblems/leopards.png",
        description: "서울을 기반으로 한 강력한 U16 아이스하키 팀으로, 뛰어난 팀워크와 공격적인 플레이 스타일로 유명합니다.",
        coach: "김철수",
        captain: "박민준",
        homeRink: "서울아이스링크",
        players: 23,
        goals: 76,
        assists: 94,
        penalties: 42,
        powerPlayGoals: 18,
        shortHandedGoals: 3,
        goalsAgainst: 35
    },
    {
        id: 2,
        name: "타이거스",
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
        logoImage: "assets/emblems/tigers.png",
        description: "부산의 차세대 아이스하키 스타들이 모인 U18 팀으로, 빠른 스케이팅과 정확한 패싱이 강점입니다.",
        coach: "이영수",
        captain: "최준호",
        homeRink: "부산 아이스링크",
        players: 20,
        goals: 78,
        assists: 67,
        penalties: 28,
        powerPlayGoals: 12,
        shortHandedGoals: 2,
        goalsAgainst: 31
    },
    {
        id: 3,
        name: "이글스",
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
        description: "대구 지역의 유망한 U12 팀으로 빠른 성장세를 보이고 있습니다.",
        coach: "박지성",
        captain: "김태현",
        homeRink: "대구 아이스링크",
        players: 18,
        goals: 67,
        assists: 85,
        penalties: 32,
        powerPlayGoals: 15,
        shortHandedGoals: 3,
        goalsAgainst: 45
    },
    {
        id: 4,
        name: "베어스",
        region: "인천",
        ageGroup: "U12",
        winRate: 55.0,
        totalMatches: 20,
        wins: 11,
        losses: 8,
        draws: 1,
        avgScore: 2.1,
        recentMatches: ['L', 'W', 'L', 'W', 'W'],
        founded: 2015,
        logo: "베",
        description: "인천의 유망한 U12 아이스하키 팀으로, 기본기가 탄탄하고 성장 잠재력이 높습니다.",
        coach: "안미래",
        captain: "윤성민",
        homeRink: "인천빙상장",
        players: 18,
        goals: 42,
        assists: 53,
        penalties: 35,
        powerPlayGoals: 8,
        shortHandedGoals: 1,
        goalsAgainst: 48
    },
    {
        id: 5,
        name: "아이스드래곤즈",
        region: "서울",
        ageGroup: "U16",
        winRate: 70.8,
        totalMatches: 24,
        wins: 17,
        losses: 6,
        draws: 1,
        avgScore: 3.5,
        recentMatches: ['W', 'W', 'L', 'W', 'D'],
        founded: 2011,
        logo: "드",
        description: "서울 기반의 강력한 U16 팀으로, 창의적인 플레이와 강한 정신력이 특징입니다.",
        coach: "문태일",
        captain: "한지우",
        homeRink: "서울올림픽빙상장",
        players: 22,
        goals: 84,
        assists: 101,
        penalties: 44,
        powerPlayGoals: 20,
        shortHandedGoals: 4,
        goalsAgainst: 41
    },
    {
        id: 6,
        name: "프로스트울브즈",
        region: "부산",
        ageGroup: "U18",
        winRate: 45.5,
        totalMatches: 22,
        wins: 10,
        losses: 11,
        draws: 1,
        avgScore: 1.8,
        recentMatches: ['L', 'L', 'W', 'L', 'W'],
        founded: 2013,
        logo: "울",
        description: "부산의 도전적인 U18 팀으로, 끈질긴 투지와 단단한 수비가 강점입니다.",
        coach: "조성진",
        captain: "김동현",
        homeRink: "부산아이스파크",
        players: 21,
        goals: 39,
        assists: 52,
        penalties: 56,
        powerPlayGoals: 7,
        shortHandedGoals: 1,
        goalsAgainst: 58
    }
];

// 색상 팔레트
const colors = [
    { bg: 'linear-gradient(135deg, #3b82f6, #60a5fa)', border: '#3b82f6', text: '#ffffff', stats: '#3b82f6' },
    { bg: 'linear-gradient(135deg, #10b981, #34d399)', border: '#10b981', text: '#ffffff', stats: '#10b981' },
    { bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)', border: '#f59e0b', text: '#000000', stats: '#f59e0b' },
    { bg: 'linear-gradient(135deg, #ef4444, #f87171)', border: '#ef4444', text: '#ffffff', stats: '#ef4444' },
    { bg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', border: '#8b5cf6', text: '#ffffff', stats: '#8b5cf6' },
    { bg: 'linear-gradient(135deg, #06b6d4, #67e8f9)', border: '#06b6d4', text: '#000000', stats: '#06b6d4' }
];

// URL에서 팀 ID 가져오기
function getTeamIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

// 현재 팀 데이터와 색상 가져오기
let currentTeam = null;
let teamColor = null;

function initializePage() {
    const teamId = getTeamIdFromUrl();
    currentTeam = teamsData.find(team => team.id === teamId) || teamsData[0];
    teamColor = colors[currentTeam.id % colors.length];
    
    // 브레드크럼 업데이트
    document.getElementById('team-breadcrumb-name').textContent = currentTeam.name;
    
    // 페이지 제목 업데이트
    document.title = `${currentTeam.name} - 아이스하키 클럽 랭킹`;
    
    // 컨텐츠 렌더링
    renderTeamHeader();
    renderOverviewContent();
    renderStatsContent();
    renderMatchesContent();
    renderH2HContent();
    
    // 탭 이벤트 리스너 등록
    setupTabNavigation();
    
    // 스타일 강제 적용
    forceStyleApplication();
}

// 스타일 강제 적용 함수
function forceStyleApplication() {
    setTimeout(() => {
        // 팀 헤더 섹션 스타일 강제 적용
        const headerSection = document.getElementById('team-header');
        if (headerSection) {
            headerSection.style.background = 'transparent';
            headerSection.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            headerSection.style.padding = '5rem 2rem 2rem';
            headerSection.style.minHeight = '400px';
        }
        
        // 모든 탭 초기화 및 활성 탭 설정
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.style.color = '#888888';
            btn.style.borderBottomColor = 'transparent';
            btn.style.fontWeight = '600';
            btn.style.background = 'transparent';
        });
        
        // 팀 개요 탭 활성화
        const overviewTab = document.getElementById('tab-overview');
        if (overviewTab) {
            overviewTab.style.color = '#ffffff';
            overviewTab.style.borderBottomColor = '#d4af37';
            overviewTab.style.fontWeight = '700';
            overviewTab.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)';
        }
        
        // 컨테이너 최대 너비 확장
        const headerContainer = headerSection.querySelector('div');
        if (headerContainer) {
            headerContainer.style.maxWidth = '1400px';
        }
    }, 100);
}

// 팀 헤더 렌더링
function renderTeamHeader() {
    const headerElement = document.getElementById('team-header').firstElementChild;
    
    const recentMatchesHtml = currentTeam.recentMatches.map(result => {
        const bgColor = result === 'W' ? '#10b981' : result === 'L' ? '#ef4444' : '#f59e0b';
        const shadowColor = result === 'W' ? '16, 185, 129' : result === 'L' ? '239, 68, 68' : '245, 158, 11';
        return `<div style="width: 40px; height: 40px; background: linear-gradient(135deg, ${bgColor} 0%, ${result === 'W' ? '#059669' : result === 'L' ? '#dc2626' : '#d97706'} 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: #ffffff; font-weight: 800; box-shadow: 0 4px 16px rgba(${shadowColor}, 0.4); border: 2px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease;" onmouseenter="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 24px rgba(${shadowColor}, 0.6)'" onmouseleave="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 16px rgba(${shadowColor}, 0.4)'">${result}</div>`;
    }).join('');
    
    headerElement.innerHTML = `
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 5rem; align-items: start; margin-bottom: 3rem;">
            <!-- 팀 로고 및 기본 정보 -->
            <div style="display: flex; gap: 3rem; align-items: center;">
                <div style="width: 420px; height: 420px; background: ${currentTeam.logoImage ? 'transparent' : teamColor.bg}; border-radius: 64px; display: flex; align-items: center; justify-content: center; box-shadow: ${currentTeam.logoImage ? 'none' : '0 24px 60px rgba(212, 175, 55, 0.4)'}; border: ${currentTeam.logoImage ? 'none' : '2px solid rgba(212, 175, 55, 0.3)'}; overflow: hidden;">
                    ${currentTeam.logoImage ? 
                        `<img src="${currentTeam.logoImage}" alt="${currentTeam.name} 로고" style="width: 100%; height: 100%; object-fit: contain; border-radius: 64px;">` :
                        `<span style="font-size: 4rem; font-weight: 800; color: ${teamColor.text}; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">${currentTeam.logo}</span>`
                    }
                </div>
                
                <div style="min-width: 400px;">
                    <h1 style="font-size: 3.2rem; font-weight: 800; color: #ffffff; margin: 0; margin-bottom: 1.5rem; text-shadow: 0 2px 20px rgba(0,0,0,0.3); line-height: 1.1;">${currentTeam.name}</h1>
                    <div style="display: flex; gap: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                        <span style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%); color: #d4af37; padding: 0.75rem 1.5rem; border-radius: 25px; font-size: 0.9rem; font-weight: 700; border: 1px solid rgba(212, 175, 55, 0.3);">${currentTeam.region}</span>
                        <span style="background: rgba(255, 255, 255, 0.08); color: #b8b8b8; padding: 0.75rem 1.5rem; border-radius: 25px; font-size: 0.9rem; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.1);">${currentTeam.ageGroup}</span>
                        <span style="background: linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(96, 165, 250, 0.1) 100%); color: #60a5fa; padding: 0.75rem 1.5rem; border-radius: 25px; font-size: 0.9rem; font-weight: 700; border: 1px solid #60a5fa;">창단 ${currentTeam.founded}년</span>
                    </div>
                    <p style="color: #cccccc; max-width: 700px; line-height: 1.8; margin: 0; font-size: 1.1rem; font-weight: 400;">${currentTeam.description}</p>
                </div>
            </div>
            
            <!-- 주요 통계 -->
            <div style="width: 100%; max-width: 600px; justify-self: end;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem;">
                    <div style="text-align: center; padding: 2.5rem 1.5rem; background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
                        <div style="font-size: 2.8rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem; line-height: 1;">${currentTeam.winRate}%</div>
                        <div style="font-size: 0.9rem; color: #cccccc; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">승률</div>
                    </div>
                    <div style="text-align: center; padding: 2.5rem 1.5rem; background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
                        <div style="font-size: 2.8rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem; line-height: 1;">${currentTeam.totalMatches}</div>
                        <div style="font-size: 0.9rem; color: #cccccc; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">총 경기</div>
                    </div>
                    <div style="text-align: center; padding: 2.5rem 1.5rem; background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s ease; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
                        <div style="font-size: 2.8rem; font-weight: 800; color: #ffffff; margin-bottom: 0.75rem; line-height: 1;">${currentTeam.avgScore}</div>
                        <div style="font-size: 0.9rem; color: #cccccc; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">평균득점</div>
                    </div>
                </div>
                
                <!-- 최근 경기 폼 -->
                <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%); padding: 2.5rem; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h4 style="font-size: 1rem; color: #d4af37; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">최근 경기</h4>
                    <div style="display: flex; gap: 1.25rem; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                        ${recentMatchesHtml}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 추가 공간 확보 -->
        <div style="height: 0.5rem;"></div>
    `;
}

// 탭 네비게이션 설정
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // 모든 탭 버튼 비활성화
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.color = '#888888';
                btn.style.borderBottomColor = 'transparent';
                btn.style.fontWeight = '600';
                btn.style.background = 'transparent';
            });
            
            // 클릭된 탭 버튼 활성화
            button.classList.add('active');
            button.style.color = '#ffffff';
            button.style.borderBottomColor = '#d4af37';
            button.style.fontWeight = '700';
            button.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)';
            
            // 모든 탭 콘텐츠 숨기기
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // 선택된 탭 콘텐츠 보이기
            const targetContent = document.getElementById(`${targetTab}-content`);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });
}

// 개요 컨텐츠 렌더링
function renderOverviewContent() {
    const overviewElement = document.getElementById('overview-content');
    
    overviewElement.innerHTML = `
        <div style="display: grid; gap: 3rem;">
            <!-- 팀 정보 카드 -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div class="stat-card" style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; border-radius: 20px; padding: 2rem;">
                    <h3 style="color: ${teamColor.stats}; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 700;">팀 정보</h3>
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">감독</span>
                            <span style="color: #ffffff; font-weight: 600;">${currentTeam.coach}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">주장</span>
                            <span style="color: #ffffff; font-weight: 600;">${currentTeam.captain}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">홈 링크</span>
                            <span style="color: #ffffff; font-weight: 600;">${currentTeam.homeRink}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
                            <span style="color: #888888;">선수 수</span>
                            <span style="color: #ffffff; font-weight: 600;">${currentTeam.players}명</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; border-radius: 20px; padding: 2rem;">
                    <h3 style="color: ${teamColor.stats}; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 700;">시즌 기록</h3>
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">승리</span>
                            <span style="color: #10b981; font-weight: 700; font-size: 1.1rem;">${currentTeam.wins}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">패배</span>
                            <span style="color: #ef4444; font-weight: 700; font-size: 1.1rem;">${currentTeam.losses}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">무승부</span>
                            <span style="color: #f59e0b; font-weight: 700; font-size: 1.1rem;">${currentTeam.draws}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
                            <span style="color: #888888;">승률</span>
                            <span style="color: ${teamColor.stats}; font-weight: 700; font-size: 1.1rem;">${currentTeam.winRate}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 성과 및 하이라이트 -->
            <div class="stat-card" style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; border-radius: 20px; padding: 2rem;">
                <h3 style="color: ${teamColor.stats}; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 700;">주요 성과</h3>
                <div style="display: grid; gap: 1rem;">
                    <div style="padding: 1rem; background: rgba(${teamColor.stats === '#3b82f6' ? '59, 130, 246' : teamColor.stats === '#10b981' ? '16, 185, 129' : teamColor.stats === '#f59e0b' ? '245, 158, 11' : teamColor.stats === '#ef4444' ? '239, 68, 68' : teamColor.stats === '#8b5cf6' ? '139, 92, 246' : '6, 182, 212'}, 0.1); border-radius: 12px; border-left: 4px solid ${teamColor.stats};">
                        <div style="color: #ffffff; font-weight: 600; margin-bottom: 0.5rem;">2024 시즌 현재 순위</div>
                        <div style="color: #cccccc; font-size: 0.9rem;">리그 ${currentTeam.ageGroup} 부문에서 상위 ${Math.ceil((1 - currentTeam.winRate/100) * 10)}위 기록</div>
                    </div>
                    <div style="padding: 1rem; background: rgba(${teamColor.stats === '#3b82f6' ? '59, 130, 246' : teamColor.stats === '#10b981' ? '16, 185, 129' : teamColor.stats === '#f59e0b' ? '245, 158, 11' : teamColor.stats === '#ef4444' ? '239, 68, 68' : teamColor.stats === '#8b5cf6' ? '139, 92, 246' : '6, 182, 212'}, 0.1); border-radius: 12px; border-left: 4px solid ${teamColor.stats};">
                        <div style="color: #ffffff; font-weight: 600; margin-bottom: 0.5rem;">최고 연승 기록</div>
                        <div style="color: #cccccc; font-size: 0.9rem;">${Math.floor(Math.random() * 5) + 3}연승 달성 (${2023 + Math.floor(Math.random() * 2)}년)</div>
                    </div>
                    <div style="padding: 1rem; background: rgba(${teamColor.stats === '#3b82f6' ? '59, 130, 246' : teamColor.stats === '#10b981' ? '16, 185, 129' : teamColor.stats === '#f59e0b' ? '245, 158, 11' : teamColor.stats === '#ef4444' ? '239, 68, 68' : teamColor.stats === '#8b5cf6' ? '139, 92, 246' : '6, 182, 212'}, 0.1); border-radius: 12px; border-left: 4px solid ${teamColor.stats};">
                        <div style="color: #ffffff; font-weight: 600; margin-bottom: 0.5rem;">팀 특별상</div>
                        <div style="color: #cccccc; font-size: 0.9rem;">페어플레이상 수상 (2023년), 최우수 팀워크상 후보</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 상세 통계 컨텐츠 렌더링
function renderStatsContent() {
    const statsElement = document.getElementById('stats-content');
    
    statsElement.innerHTML = `
        <div style="display: grid; gap: 3rem;">
            <!-- 공격 통계 -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                <div class="stat-card" style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; border-radius: 20px; padding: 2rem;">
                    <h3 style="color: #10b981; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 700;">공격 통계</h3>
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">총 득점</span>
                            <span style="color: #10b981; font-weight: 700; font-size: 1.1rem;">${currentTeam.goals}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">어시스트</span>
                            <span style="color: #10b981; font-weight: 700; font-size: 1.1rem;">${currentTeam.assists}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">파워플레이 골</span>
                            <span style="color: #10b981; font-weight: 700; font-size: 1.1rem;">${currentTeam.powerPlayGoals}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
                            <span style="color: #888888;">숏핸디드 골</span>
                            <span style="color: #10b981; font-weight: 700; font-size: 1.1rem;">${currentTeam.shortHandedGoals}</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; border-radius: 20px; padding: 2rem;">
                    <h3 style="color: #ef4444; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 700;">수비 통계</h3>
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">실점</span>
                            <span style="color: #ef4444; font-weight: 700; font-size: 1.1rem;">${currentTeam.goalsAgainst}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">경기당 실점</span>
                            <span style="color: #ef4444; font-weight: 700; font-size: 1.1rem;">${(currentTeam.goalsAgainst / currentTeam.totalMatches).toFixed(1)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">페널티</span>
                            <span style="color: #f59e0b; font-weight: 700; font-size: 1.1rem;">${currentTeam.penalties}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
                            <span style="color: #888888;">골 차이</span>
                            <span style="color: ${currentTeam.goals - currentTeam.goalsAgainst > 0 ? '#10b981' : '#ef4444'}; font-weight: 700; font-size: 1.1rem;">${currentTeam.goals - currentTeam.goalsAgainst > 0 ? '+' : ''}${currentTeam.goals - currentTeam.goalsAgainst}</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; border-radius: 20px; padding: 2rem;">
                    <h3 style="color: ${teamColor.stats}; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 700;">효율성 지표</h3>
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">경기당 득점</span>
                            <span style="color: ${teamColor.stats}; font-weight: 700; font-size: 1.1rem;">${(currentTeam.goals / currentTeam.totalMatches).toFixed(1)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">파워플레이 효율</span>
                            <span style="color: ${teamColor.stats}; font-weight: 700; font-size: 1.1rem;">${((currentTeam.powerPlayGoals / (currentTeam.penalties * 0.3)) * 100).toFixed(1)}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #2a2a2a;">
                            <span style="color: #888888;">어시스트 비율</span>
                            <span style="color: ${teamColor.stats}; font-weight: 700; font-size: 1.1rem;">${((currentTeam.assists / currentTeam.goals) * 100).toFixed(0)}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
                            <span style="color: #888888;">경기당 페널티</span>
                            <span style="color: ${teamColor.stats}; font-weight: 700; font-size: 1.1rem;">${(currentTeam.penalties / currentTeam.totalMatches).toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 최근 경기 컨텐츠 렌더링
function renderMatchesContent() {
    const matchesElement = document.getElementById('matches-content');
    
    // 가상의 최근 경기 데이터 생성
    const recentMatches = Array.from({length: 10}, (_, i) => {
        const result = currentTeam.recentMatches[i % currentTeam.recentMatches.length];
        const opponentTeam = teamsData[Math.floor(Math.random() * teamsData.length)];
        const teamScore = result === 'W' ? Math.floor(Math.random() * 3) + 3 : result === 'L' ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 2;
        const opponentScore = result === 'W' ? Math.floor(Math.random() * teamScore) : result === 'L' ? teamScore + Math.floor(Math.random() * 3) + 1 : teamScore;
        
        return {
            date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
            opponent: opponentTeam.name,
            result: result,
            teamScore: teamScore,
            opponentScore: opponentScore,
            venue: Math.random() > 0.5 ? '홈' : '어웨이'
        };
    });
    
    matchesElement.innerHTML = `
        <div style="display: grid; gap: 1.5rem;">
            <h3 style="color: ${teamColor.stats}; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 700;">최근 10경기</h3>
            ${recentMatches.map(match => {
                const resultColor = match.result === 'W' ? '#10b981' : match.result === 'L' ? '#ef4444' : '#f59e0b';
                const resultText = match.result === 'W' ? '승리' : match.result === 'L' ? '패배' : '무승부';
                
                return `
                    <div class="stat-card" style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; border-radius: 16px; padding: 1.5rem; transition: all 0.3s ease;">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="width: 50px; height: 50px; background: ${resultColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem;">
                                    ${match.result}
                                </div>
                                <div>
                                    <div style="color: #ffffff; font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">vs ${match.opponent}</div>
                                    <div style="color: #888888; font-size: 0.9rem;">${match.date} • ${match.venue}</div>
                                </div>
                            </div>
                            
                            <div style="text-align: right;">
                                <div style="color: ${resultColor}; font-weight: 700; font-size: 1.3rem; margin-bottom: 0.25rem;">
                                    ${match.teamScore} : ${match.opponentScore}
                                </div>
                                <div style="color: #888888; font-size: 0.9rem;">${resultText}</div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 상대전적 컨텐츠 렌더링
function renderH2HContent() {
    const h2hElement = document.getElementById('h2h-content');
    
    // 다른 팀들과의 상대전적 데이터 생성
    const otherTeams = teamsData.filter(team => team.id !== currentTeam.id);
    const h2hData = otherTeams.map(team => {
        const totalGames = Math.floor(Math.random() * 8) + 2;
        const wins = Math.floor(Math.random() * totalGames);
        const losses = Math.floor(Math.random() * (totalGames - wins));
        const draws = totalGames - wins - losses;
        const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;
        
        return {
            opponent: team,
            totalGames,
            wins,
            losses,
            draws,
            winRate
        };
    }).sort((a, b) => b.totalGames - a.totalGames);
    
    h2hElement.innerHTML = `
        <div style="display: grid; gap: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="color: ${teamColor.stats}; margin: 0; font-size: 1.5rem; font-weight: 700;">상대전적 분석</h3>
                <button id="go-to-h2h-selector" style="background: linear-gradient(135deg, #d4af37, #f4d03f); color: #000; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); display: flex; align-items: center; gap: 0.5rem;">
                    <span>팀 비교 페이지</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M7 17L17 7"></path>
                        <path d="M7 7h10v10"></path>
                    </svg>
                </button>
            </div>
            
            <div style="display: grid; gap: 1.5rem;">
                ${h2hData.map(data => {
                    const opponentColor = colors[data.opponent.id % colors.length];
                    
                    return `
                        <div class="stat-card h2h-card" 
                             data-opponent-id="${data.opponent.id}" 
                             style="background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 2rem; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;"
                             onmouseenter="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(212, 175, 55, 0.6)'; this.style.boxShadow='0 12px 40px rgba(212, 175, 55, 0.15)'"
                             onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.boxShadow='none'">
                            
                            <div style="display: flex; align-items: center; gap: 2rem; position: relative; z-index: 1;">
                                <!-- 왼쪽: 팀 정보 -->
                                <div style="display: flex; align-items: center; gap: 1.5rem; width: 25%; flex-shrink: 0;">
                                    <div style="width: 90px; height: 90px; background: ${data.opponent.logoImage ? 'transparent' : opponentColor.bg}; border-radius: 22px; display: flex; align-items: center; justify-content: center; color: ${opponentColor.text}; font-weight: 800; font-size: 1.8rem; box-shadow: ${data.opponent.logoImage ? 'none' : '0 8px 24px rgba(0,0,0,0.3)'}; overflow: hidden;">
                                        ${data.opponent.logoImage ? 
                                            `<img src="${data.opponent.logoImage}" alt="${data.opponent.name} 로고" style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px;">` :
                                            `${data.opponent.logo}`
                                        }
                                    </div>
                                    <div>
                                        <div style="color: #ffffff; font-weight: 700; font-size: 1.3rem; margin-bottom: 0.75rem; line-height: 1.2;">${data.opponent.name}</div>
                                        <div style="display: flex; gap: 0.75rem;">
                                            <span style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%); color: #d4af37; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(212, 175, 55, 0.3);">${data.opponent.region}</span>
                                            <span style="background: rgba(255, 255, 255, 0.08); color: #b8b8b8; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.1);">${data.opponent.ageGroup}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 가운데: 통계 정보 3열 -->
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; width: 55%; flex-shrink: 0;">
                                    <div style="text-align: center; padding: 1.8rem 1rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%); border-radius: 16px; border: 1px solid rgba(16, 185, 129, 0.2); transition: all 0.3s ease;"
                                         onmouseenter="this.style.background='linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'; this.style.transform='scale(1.02)'"
                                         onmouseleave="this.style.background='linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'; this.style.transform='scale(1)'">
                                        <div style="color: #a7f3d0; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">승률</div>
                                        <div style="color: ${parseFloat(data.winRate) >= 50 ? '#10b981' : '#ef4444'}; font-weight: 800; font-size: 1.8rem; line-height: 1;">
                                            ${data.winRate}%
                                        </div>
                                    </div>
                                    <div style="text-align: center; padding: 1.8rem 1rem; background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%); border-radius: 16px; border: 1px solid rgba(251, 191, 36, 0.2); transition: all 0.3s ease;"
                                         onmouseenter="this.style.background='linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%)'; this.style.transform='scale(1.02)'"
                                         onmouseleave="this.style.background='linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)'; this.style.transform='scale(1)'">
                                        <div style="color: #fde68a; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">전적</div>
                                        <div style="color: #fbbf24; font-weight: 700; font-size: 1.1rem; line-height: 1.3;">
                                            ${data.wins}승 ${data.losses}패 ${data.draws}무
                                        </div>
                                    </div>
                                    <div style="text-align: center; padding: 1.8rem 1rem; background: linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0.05) 100%); border-radius: 16px; border: 1px solid rgba(96, 165, 250, 0.2); transition: all 0.3s ease;"
                                         onmouseenter="this.style.background='linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.08) 100%)'; this.style.transform='scale(1.02)'"
                                         onmouseleave="this.style.background='linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0.05) 100%)'; this.style.transform='scale(1)'">
                                        <div style="color: #bfdbfe; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">총 경기</div>
                                        <div style="color: #60a5fa; font-weight: 700; font-size: 1.4rem; line-height: 1;">
                                            ${data.totalGames}경기
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 오른쪽: 상세 분석 버튼 -->
                                <div style="width: 20%; display: flex; justify-content: center; align-items: center;">
                                    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.1) 100%); color: #d4af37; padding: 1rem 1.5rem; border-radius: 25px; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(212, 175, 55, 0.3); transition: all 0.3s ease; backdrop-filter: blur(10px); cursor: pointer; text-align: center; white-space: nowrap;"
                                         onmouseenter="this.style.background='linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.15) 100%)'; this.style.transform='scale(1.05)'; this.style.borderColor='rgba(212, 175, 55, 0.5)'"
                                         onmouseleave="this.style.background='linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.1) 100%)'; this.style.transform='scale(1)'; this.style.borderColor='rgba(212, 175, 55, 0.3)'">
                                        <div style="margin-bottom: 0.25rem;">상세 분석</div>
                                        <div style="font-size: 1.2rem; transition: transform 0.3s ease;" onmouseenter="this.style.transform='translateX(2px)'" onmouseleave="this.style.transform='translateX(0)'">→</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // H2H 카드 클릭 이벤트 추가
    setTimeout(() => {
        // 팀 비교 페이지로 이동 버튼
        const goToH2HBtn = document.getElementById('go-to-h2h-selector');
        if (goToH2HBtn) {
            goToH2HBtn.addEventListener('click', function() {
                // 현재 팀을 미리 선택된 상태로 H2H 페이지로 이동
                window.location.href = `h2h.html?team1=${currentTeam.id}`;
            });
            
            // 호버 효과
            goToH2HBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
                this.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
            });
            
            goToH2HBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
            });
        }
        
        // H2H 카드 클릭 이벤트
        const h2hCards = document.querySelectorAll('.h2h-card');
        h2hCards.forEach(card => {
            card.addEventListener('click', function() {
                const opponentId = this.getAttribute('data-opponent-id');
                const currentTeamId = currentTeam.id;
                
                // H2H 페이지로 이동 (team1=현재팀, team2=상대팀)
                window.location.href = `h2h.html?team1=${currentTeamId}&team2=${opponentId}`;
            });
            
            // 호버 효과 추가
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.2)';
                this.style.borderColor = '#d4af37';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
                this.style.borderColor = '#2a2a2a';
            });
        });
    }, 100);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializePage);
