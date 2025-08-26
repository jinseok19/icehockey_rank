// 리그/대회 관리자
let leaguesData = [];
let teamsData = [];
let currentLeague = null;

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadData().then(() => {
        if (window.location.pathname.includes('matches.html')) {
            initLeaguesPage();
        } else if (window.location.pathname.includes('match.html')) {
            initLeagueDetailPage();
        }
    });
});

// 데이터 로드
async function loadData() {
    try {
        // 리그 데이터 로드
        const leaguesResponse = await fetch('data/leagues.json');
        const leaguesJson = await leaguesResponse.json();
        leaguesData = leaguesJson.leagues;

        // 팀 데이터 (기존 데이터 재사용)
        teamsData = [
            { id: 1, name: "레오파즈", logo: "레", region: "서울", ageGroup: "U16" },
            { id: 2, name: "타이거스", logo: "타", region: "부산", ageGroup: "U18" },
            { id: 3, name: "베어스", logo: "베", region: "대구", ageGroup: "U15" },
            { id: 4, name: "이글스", logo: "이", region: "인천", ageGroup: "U12" },
            { id: 5, name: "울브즈", logo: "울", region: "광주", ageGroup: "U14" },
            { id: 6, name: "샤크스", logo: "샤", region: "대전", ageGroup: "U16" }
        ];

        console.log('데이터 로드 완료:', { leaguesData, teamsData });
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
}

// 리그 목록 페이지 초기화
function initLeaguesPage() {
    renderLeagues();
    setupFilters();
}

// 리그 목록 렌더링
function renderLeagues() {
    const leaguesGrid = document.getElementById('leagues-grid');
    if (!leaguesGrid) return;

    const filteredLeagues = filterLeagues();

    leaguesGrid.innerHTML = filteredLeagues.map(league => {
        const statusColor = getStatusColor(league.status);
        const progress = league.totalMatches > 0 ? 
            Math.round((league.completedMatches / league.totalMatches) * 100) : 0;

        return `
            <div class="league-card" onclick="goToLeagueDetail('${league.id}')" 
                 style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); 
                        border: 1px solid #2a2a2a; border-radius: 20px; padding: 2rem; 
                        cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;"
                 onmouseenter="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'" 
                 onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='#2a2a2a'">
                
                <!-- 상태 표시 -->
                <div style="position: absolute; top: 1rem; right: 1rem;">
                    <span style="background: ${statusColor}; color: #ffffff; padding: 0.5rem 1rem; 
                                 border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${league.status}</span>
                </div>

                <!-- 리그 정보 -->
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <span style="font-size: 2rem;">${league.logo}</span>
                        <div>
                            <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 700; margin: 0;">${league.name}</h3>
                            <p style="color: #888888; font-size: 0.9rem; margin: 0;">${league.ageGroup} · ${league.format}</p>
                        </div>
                    </div>
                    <p style="color: #cccccc; font-size: 0.9rem; line-height: 1.5; margin: 0;">${league.description}</p>
                </div>

                <!-- 대회 정보 -->
                <div style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #888888; font-size: 0.9rem;">주최</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 0.9rem;">${league.organizer}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #888888; font-size: 0.9rem;">장소</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 0.9rem;">${league.location}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #888888; font-size: 0.9rem;">기간</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 0.9rem;">${formatDateRange(league.startDate, league.endDate)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #888888; font-size: 0.9rem;">참가팀</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 0.9rem;">${league.teams.length}팀</span>
                    </div>
                </div>

                ${league.status === '진행중' ? `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: #888888; font-size: 0.9rem;">진행률</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 0.9rem;">${progress}%</span>
                    </div>
                    <div style="background: #2a2a2a; border-radius: 10px; height: 8px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, #10b981, #34d399); height: 100%; 
                                    width: ${progress}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                ` : ''}

                <!-- 상품/혜택 -->
                <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 12px; 
                            border-left: 4px solid #ffffff;">
                    <div style="color: #ffffff; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;">상품</div>
                    <div style="color: #cccccc; font-size: 0.8rem;">${league.prize}</div>
                </div>
            </div>
        `;
    }).join('');
}

// 필터 설정
function setupFilters() {
    const seasonFilter = document.getElementById('season-filter');
    const ageFilter = document.getElementById('age-filter');
    const statusFilter = document.getElementById('status-filter');

    [seasonFilter, ageFilter, statusFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', renderLeagues);
        }
    });
}

// 리그 필터링
function filterLeagues() {
    const seasonFilter = document.getElementById('season-filter')?.value || '';
    const ageFilter = document.getElementById('age-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';

    return leaguesData.filter(league => {
        if (seasonFilter && league.season !== seasonFilter) return false;
        if (ageFilter && league.ageGroup !== ageFilter) return false;
        if (statusFilter && league.status !== statusFilter) return false;
        return true;
    });
}

// 상태별 색상
function getStatusColor(status) {
    switch (status) {
        case '진행중': return 'linear-gradient(135deg, #10b981, #34d399)';
        case '예정': return 'linear-gradient(135deg, #3b82f6, #60a5fa)';
        case '완료': return 'linear-gradient(135deg, #6b7280, #9ca3af)';
        default: return 'linear-gradient(135deg, #6b7280, #9ca3af)';
    }
}

// 날짜 범위 포맷
function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return `${start.getMonth() + 1}.${start.getDate()} - ${end.getMonth() + 1}.${end.getDate()}`;
}

// 리그 상세 페이지로 이동
function goToLeagueDetail(leagueId) {
    window.location.href = `match.html?league=${leagueId}`;
}
