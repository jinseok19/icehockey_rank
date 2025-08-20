// 통계 페이지 차트 및 데이터 관리
const StatsManager = {
  init() {
    this.initCharts();
    this.bindEvents();
  },

  // 차트 초기화
  initCharts() {
    this.initWinRateChart();
    this.initTrendChart();
  },

  // 승률 분포 차트
  initWinRateChart() {
    const ctx = document.getElementById('winRateChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['80% 이상', '70-79%', '60-69%', '50-59%', '50% 미만'],
        datasets: [{
          data: [3, 8, 7, 4, 2],
          backgroundColor: [
            '#10b981', // 초록
            '#3b82f6', // 파랑
            '#f59e0b', // 노랑
            '#ef4444', // 빨강
            '#6b7280'  // 회색
          ],
          borderWidth: 2,
          borderColor: '#1f2937'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e5e7eb',
              font: {
                size: 12
              },
              padding: 20
            }
          },
          title: {
            display: true,
            text: '팀별 승률 분포',
            color: '#e5e7eb',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }
    });
  },

  // 시즌 트렌드 차트
  initTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
        datasets: [{
          label: '평균 득점',
          data: [2.8, 3.1, 3.3, 3.2, 3.4, 3.2],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }, {
          label: '평균 실점',
          data: [2.5, 2.8, 2.9, 2.7, 3.0, 2.8],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e5e7eb',
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: '월별 평균 득점/실점 트렌드',
            color: '#e5e7eb',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#9ca3af'
            },
            grid: {
              color: '#374151'
            }
          },
          y: {
            ticks: {
              color: '#9ca3af'
            },
            grid: {
              color: '#374151'
            },
            beginAtZero: true
          }
        }
      }
    });
  },

  // 이벤트 바인딩
  bindEvents() {
    // 통계 카드 호버 효과
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // 연령대 카드 호버 효과
    const ageCards = document.querySelectorAll('.age-card');
    ageCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // 지역 카드 호버 효과
    const regionCards = document.querySelectorAll('.region-card');
    regionCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-3px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  },

  // 통계 데이터 업데이트 (실제 데이터와 연동 시 사용)
  updateStats(data) {
    // 전체 통계 업데이트
    if (data.overview) {
      this.updateOverviewStats(data.overview);
    }

    // 연령대별 통계 업데이트
    if (data.ageStats) {
      this.updateAgeStats(data.ageStats);
    }

    // 지역별 통계 업데이트
    if (data.regionStats) {
      this.updateRegionStats(data.regionStats);
    }
  },

  // 전체 통계 업데이트
  updateOverviewStats(overview) {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
      statNumbers[0].textContent = overview.totalTeams || '24';
      statNumbers[1].textContent = overview.totalMatches || '156';
      statNumbers[2].textContent = overview.avgGoals || '3.2';
      statNumbers[3].textContent = overview.topWinRate || '85.7%';
    }
  },

  // 연령대별 통계 업데이트
  updateAgeStats(ageStats) {
    // 실제 구현에서는 DOM 요소를 찾아서 업데이트
    console.log('연령대별 통계 업데이트:', ageStats);
  },

  // 지역별 통계 업데이트
  updateRegionStats(regionStats) {
    // 실제 구현에서는 DOM 요소를 찾아서 업데이트
    console.log('지역별 통계 업데이트:', regionStats);
  }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  StatsManager.init();
});

// 전역으로 노출
window.StatsManager = StatsManager;
