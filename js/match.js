// 리그 상세 페이지 관리자
let currentLeague = null;
let leaguesData = [];
let teamsData = [];

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadData().then(() => {
        initLeagueDetailPage();
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

// 리그 상세 페이지 초기화
function initLeagueDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const leagueId = urlParams.get('league');
    
    if (!leagueId) return;

    currentLeague = leaguesData.find(league => league.id === leagueId);
    if (!currentLeague) return;

    renderLeagueHeader();
    renderLeagueContent();
    setupTabs();
}

// 리그 헤더 렌더링
function renderLeagueHeader() {
    const headerElement = document.getElementById('league-header');
    const breadcrumbElement = document.getElementById('league-breadcrumb');
    
    if (breadcrumbElement) {
        breadcrumbElement.textContent = currentLeague.name;
    }

    if (headerElement) {
        const statusColor = getStatusColor(currentLeague.status);
        const progress = currentLeague.totalMatches > 0 ? 
            Math.round((currentLeague.completedMatches / currentLeague.totalMatches) * 100) : 0;

        headerElement.innerHTML = `
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 3rem; align-items: start;">
                <div style="display: flex; gap: 2rem; align-items: center;">
                    <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); 
                                border-radius: 24px; display: flex; align-items: center; justify-content: center; 
                                font-size: 3rem;">${currentLeague.logo}</div>
                    
                    <div style="min-width: 400px;">
                        <h1 style="font-size: 2.5rem; font-weight: 800; color: #ffffff; margin: 0 0 1rem 0;">${currentLeague.name}</h1>
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                            <span style="background: ${statusColor}; color: #ffffff; padding: 0.5rem 1rem; 
                                         border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${currentLeague.status}</span>
                            <span style="background: rgba(255, 255, 255, 0.1); color: #ffffff; padding: 0.5rem 1rem; 
                                         border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${currentLeague.ageGroup}</span>
                            <span style="background: rgba(255, 255, 255, 0.1); color: #ffffff; padding: 0.5rem 1rem; 
                                         border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${currentLeague.format}</span>
                        </div>
                        <p style="color: #cccccc; line-height: 1.6; margin: 0; font-size: 1rem;">${currentLeague.description}</p>
                    </div>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: 16px; 
                            border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="color: #ffffff; margin-bottom: 1.5rem; font-size: 1.2rem; font-weight: 700;">대회 정보</h3>
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888888;">주최</span>
                            <span style="color: #ffffff; font-weight: 600;">${currentLeague.organizer}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888888;">장소</span>
                            <span style="color: #ffffff; font-weight: 600;">${currentLeague.location}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888888;">기간</span>
                            <span style="color: #ffffff; font-weight: 600;">${formatDateRange(currentLeague.startDate, currentLeague.endDate)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888888;">참가팀</span>
                            <span style="color: #ffffff; font-weight: 600;">${currentLeague.teams.length}팀</span>
                        </div>
                        ${currentLeague.status === '진행중' ? `
                        <div style="margin-top: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="color: #888888;">진행률</span>
                                <span style="color: #ffffff; font-weight: 600;">${progress}%</span>
                            </div>
                            <div style="background: #2a2a2a; border-radius: 10px; height: 8px;">
                                <div style="background: linear-gradient(90deg, #10b981, #34d399); height: 100%; 
                                            width: ${progress}%; border-radius: 10px;"></div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}

// 리그 콘텐츠 렌더링
function renderLeagueContent() {
    renderInfoContent();
    renderLeaderboardContent();
    renderMatchesContent();
    renderScheduleContent();
}

// 대회 정보 탭
function renderInfoContent() {
    const infoElement = document.getElementById('info-content');
    if (!infoElement) return;

    infoElement.innerHTML = `
        <div style="display: grid; gap: 2rem;">
            <div style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; 
                        border-radius: 20px; padding: 2rem;">
                <h3 style="color: #ffffff; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 700;">대회 개요</h3>
                <div style="display: grid; gap: 1.5rem;">
                    <div>
                        <h4 style="color: #ffffff; margin-bottom: 0.5rem; font-weight: 600;">대회 설명</h4>
                        <p style="color: #cccccc; line-height: 1.6; margin: 0;">${currentLeague.description}</p>
                    </div>
                    <div>
                        <h4 style="color: #ffffff; margin-bottom: 0.5rem; font-weight: 600;">상품 및 혜택</h4>
                        <p style="color: #cccccc; margin: 0;">${currentLeague.prize}</p>
                    </div>
                    <div>
                        <h4 style="color: #ffffff; margin-bottom: 0.5rem; font-weight: 600;">경기장</h4>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            ${currentLeague.venues.map(venue => `
                                <span style="background: rgba(255, 255, 255, 0.1); padding: 0.5rem 1rem; 
                                             border-radius: 12px; color: #ffffff; font-size: 0.9rem;">${venue}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 리더보드 탭
function renderLeaderboardContent() {
    const leaderboardElement = document.getElementById('leaderboard-content');
    if (!leaderboardElement) return;

    // 가상의 리더보드 데이터 생성
    const teams = currentLeague.teams.map(teamId => {
        const team = teamsData.find(t => t.id === teamId);
        if (!team) return null;
        
        const matches = Math.floor(Math.random() * 10) + 5;
        const wins = Math.floor(Math.random() * matches);
        const losses = Math.floor(Math.random() * (matches - wins));
        const draws = matches - wins - losses;
        const points = wins * 3 + draws;
        
        return {
            ...team,
            matches, wins, losses, draws, points,
            goalsFor: Math.floor(Math.random() * 30) + 10,
            goalsAgainst: Math.floor(Math.random() * 25) + 5
        };
    }).filter(Boolean).sort((a, b) => b.points - a.points);

    leaderboardElement.innerHTML = `
        <div style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; 
                    border-radius: 20px; padding: 2rem;">
            <h3 style="color: #ffffff; margin-bottom: 2rem; font-size: 1.3rem; font-weight: 700;">순위표</h3>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid #2a2a2a;">
                            <th style="padding: 1rem; text-align: center; color: #888888; font-weight: 600;">순위</th>
                            <th style="padding: 1rem; text-align: left; color: #888888; font-weight: 600;">팀명</th>
                            <th style="padding: 1rem; text-align: center; color: #888888; font-weight: 600;">경기</th>
                            <th style="padding: 1rem; text-align: center; color: #888888; font-weight: 600;">승</th>
                            <th style="padding: 1rem; text-align: center; color: #888888; font-weight: 600;">무</th>
                            <th style="padding: 1rem; text-align: center; color: #888888; font-weight: 600;">패</th>
                            <th style="padding: 1rem; text-align: center; color: #888888; font-weight: 600;">득점</th>
                            <th style="padding: 1rem; text-align: center; color: #888888; font-weight: 600;">실점</th>
                            <th style="padding: 1rem; text-align: center; color: #888888; font-weight: 600;">승점</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${teams.map((team, index) => `
                            <tr style="border-bottom: 1px solid #2a2a2a;">
                                <td style="padding: 1rem; text-align: center; color: #ffffff; font-weight: 700;">${index + 1}</td>
                                <td style="padding: 1rem;">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <span style="width: 32px; height: 32px; background: linear-gradient(135deg, #1a1a2e, #16213e); 
                                                     border-radius: 8px; display: flex; align-items: center; justify-content: center; 
                                                     color: #ffffff; font-weight: 700; font-size: 0.9rem;">${team.logo}</span>
                                        <span style="color: #ffffff; font-weight: 600;">${team.name}</span>
                                    </div>
                                </td>
                                <td style="padding: 1rem; text-align: center; color: #ffffff;">${team.matches}</td>
                                <td style="padding: 1rem; text-align: center; color: #10b981; font-weight: 600;">${team.wins}</td>
                                <td style="padding: 1rem; text-align: center; color: #f59e0b; font-weight: 600;">${team.draws}</td>
                                <td style="padding: 1rem; text-align: center; color: #ef4444; font-weight: 600;">${team.losses}</td>
                                <td style="padding: 1rem; text-align: center; color: #ffffff;">${team.goalsFor}</td>
                                <td style="padding: 1rem; text-align: center; color: #ffffff;">${team.goalsAgainst}</td>
                                <td style="padding: 1rem; text-align: center; color: #ffffff; font-weight: 700; font-size: 1.1rem;">${team.points}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 경기 결과 탭
function renderMatchesContent() {
    const matchesElement = document.getElementById('matches-content');
    if (!matchesElement) return;

    const matches = generateMatches(currentLeague.completedMatches);

    matchesElement.innerHTML = `
        <div style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; 
                    border-radius: 20px; padding: 2rem;">
            <h3 style="color: #ffffff; margin-bottom: 2rem; font-size: 1.3rem; font-weight: 700;">경기 결과</h3>
            <div style="display: grid; gap: 1rem;">
                ${matches.map(match => {
                    const homeTeam = teamsData.find(t => t.id === match.homeTeam);
                    const awayTeam = teamsData.find(t => t.id === match.awayTeam);
                    
                    return `
                        <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; 
                                    border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <span style="color: #888888; font-size: 0.9rem;">${match.date}</span>
                                    <span style="color: #888888; font-size: 0.9rem;">•</span>
                                    <span style="color: #888888; font-size: 0.9rem;">${match.venue}</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                                <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
                                    <span style="width: 32px; height: 32px; background: linear-gradient(135deg, #1a1a2e, #16213e); 
                                                 border-radius: 8px; display: flex; align-items: center; justify-content: center; 
                                                 color: #ffffff; font-weight: 700;">${homeTeam?.logo}</span>
                                    <span style="color: #ffffff; font-weight: 600; flex: 1;">${homeTeam?.name}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem; font-size: 1.5rem; 
                                            font-weight: 700; color: #ffffff;">
                                    <span>${match.homeScore}</span>
                                    <span style="color: #888888; font-size: 1rem;">:</span>
                                    <span>${match.awayScore}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem; flex: 1; justify-content: flex-end;">
                                    <span style="color: #ffffff; font-weight: 600; flex: 1; text-align: right;">${awayTeam?.name}</span>
                                    <span style="width: 32px; height: 32px; background: linear-gradient(135deg, #1a1a2e, #16213e); 
                                                 border-radius: 8px; display: flex; align-items: center; justify-content: center; 
                                                 color: #ffffff; font-weight: 700;">${awayTeam?.logo}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// 일정 탭
function renderScheduleContent() {
    const scheduleElement = document.getElementById('schedule-content');
    if (!scheduleElement) return;

    const upcomingMatches = generateUpcomingMatches(currentLeague.totalMatches - currentLeague.completedMatches);

    scheduleElement.innerHTML = `
        <div style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; 
                    border-radius: 20px; padding: 2rem;">
            <h3 style="color: #ffffff; margin-bottom: 2rem; font-size: 1.3rem; font-weight: 700;">예정 경기</h3>
            ${upcomingMatches.length > 0 ? `
                <div style="display: grid; gap: 1rem;">
                    ${upcomingMatches.map(match => {
                        const homeTeam = teamsData.find(t => t.id === match.homeTeam);
                        const awayTeam = teamsData.find(t => t.id === match.awayTeam);
                        
                        return `
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; 
                                        border: 1px solid rgba(255, 255, 255, 0.1);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <span style="color: #ffffff; font-weight: 600;">${match.date}</span>
                                        <span style="color: #888888;">•</span>
                                        <span style="color: #888888;">${match.time}</span>
                                        <span style="color: #888888;">•</span>
                                        <span style="color: #888888;">${match.venue}</span>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                                    <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
                                        <span style="width: 32px; height: 32px; background: linear-gradient(135deg, #1a1a2e, #16213e); 
                                                     border-radius: 8px; display: flex; align-items: center; justify-content: center; 
                                                     color: #ffffff; font-weight: 700;">${homeTeam?.logo}</span>
                                        <span style="color: #ffffff; font-weight: 600;">${homeTeam?.name}</span>
                                    </div>
                                    <div style="color: #888888; font-size: 1.2rem; font-weight: 600;">VS</div>
                                    <div style="display: flex; align-items: center; gap: 1rem; flex: 1; justify-content: flex-end;">
                                        <span style="color: #ffffff; font-weight: 600;">${awayTeam?.name}</span>
                                        <span style="width: 32px; height: 32px; background: linear-gradient(135deg, #1a1a2e, #16213e); 
                                                     border-radius: 8px; display: flex; align-items: center; justify-content: center; 
                                                     color: #ffffff; font-weight: 700;">${awayTeam?.logo}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div style="text-align: center; padding: 3rem; color: #888888;">
                    <p>예정된 경기가 없습니다.</p>
                </div>
            `}
        </div>
    `;
}

// 탭 설정
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // 모든 탭 버튼 비활성화
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.color = '#888888';
                btn.style.borderBottomColor = 'transparent';
                btn.style.background = 'transparent';
            });

            // 클릭된 탭 버튼 활성화
            button.classList.add('active');
            button.style.color = '#ffffff';
            button.style.borderBottomColor = '#ffffff';
            button.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';

            // 모든 탭 콘텐츠 숨기기
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });

            // 선택된 탭 콘텐츠 표시
            const targetContent = document.getElementById(`${targetTab}-content`);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });
}

// 유틸리티 함수들
function getStatusColor(status) {
    switch (status) {
        case '진행중': return 'linear-gradient(135deg, #10b981, #34d399)';
        case '예정': return 'linear-gradient(135deg, #3b82f6, #60a5fa)';
        case '완료': return 'linear-gradient(135deg, #6b7280, #9ca3af)';
        default: return 'linear-gradient(135deg, #6b7280, #9ca3af)';
    }
}

function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.getMonth() + 1}.${start.getDate()} - ${end.getMonth() + 1}.${end.getDate()}`;
}

function generateMatches(count) {
    const matches = [];
    const teams = currentLeague.teams;
    
    for (let i = 0; i < count; i++) {
        const homeTeam = teams[Math.floor(Math.random() * teams.length)];
        let awayTeam;
        do {
            awayTeam = teams[Math.floor(Math.random() * teams.length)];
        } while (awayTeam === homeTeam);
        
        matches.push({
            homeTeam, awayTeam,
            homeScore: Math.floor(Math.random() * 6),
            awayScore: Math.floor(Math.random() * 6),
            date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
            venue: currentLeague.venues[Math.floor(Math.random() * currentLeague.venues.length)]
        });
    }
    
    return matches;
}

function generateUpcomingMatches(count) {
    if (currentLeague.status === '완료') return [];
    
    const matches = [];
    const teams = currentLeague.teams;
    
    for (let i = 0; i < count && i < 10; i++) {
        const homeTeam = teams[Math.floor(Math.random() * teams.length)];
        let awayTeam;
        do {
            awayTeam = teams[Math.floor(Math.random() * teams.length)];
        } while (awayTeam === homeTeam);
        
        matches.push({
            homeTeam, awayTeam,
            date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
            time: `${14 + Math.floor(Math.random() * 4)}:00`,
            venue: currentLeague.venues[Math.floor(Math.random() * currentLeague.venues.length)]
        });
    }
    
    return matches;
}
