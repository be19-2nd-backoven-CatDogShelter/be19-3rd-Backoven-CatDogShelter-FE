<template>
    <div class="tab-content">
        <StatCards :stats="stats" />

        <div class="chart-section">
            <h3 class="chart-title">월별 유형별 분포</h3>
            <p class="chart-subtitle">최근 30일 기준</p>
            
            <div class="chart-container">
                <svg viewBox="0 0 200 200" class="pie-chart">
                    <template v-for="(item, index) in chartData" :key="item.label">
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke-width="40"
                            :stroke="item.color"
                            :stroke-dasharray="`${(item.percent / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`"
                            :stroke-dashoffset="getDashOffset(index)"
                        />
                    </template>
                
                    <!-- 중앙 총 인원 -->
                    <text
                        x="90"
                        y="120"
                        text-anchor="middle"
                        class="chart-center-value"
                    >{{ totalUser }} 명</text>
                </svg>
            
                <div class="chart-legend">
                    <div class="legend-item" v-for="item in chartData" :key="item.label">
                        <span class="legend-dot" :style="{ background: item.color }"></span>
                        <div class="legend-info">
                            <div class="legend-label">{{ item.label }}</div>
                            <!-- 👇 명 수 + 비율 표시 -->
                            <div class="legend-value">{{ item.count }}명 ({{ item.percent.toFixed(1) }}%)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <MembersTable
            title="회원 목록"
            :userColumns="userColumns"
            :shelterColumns="shelterColumns"
            :users="filteredUsers"
            :userPage="userPage"
            :shelter="filteredShelters"
            :shelterPage="shelterPage"

            :searchQuery="searchQuery"
            :statusFilter="statusFilter"
            :roleFilter="roleFilter"
            :showStats="true"
            @update:searchQuery="searchQuery = $event"
            @update:statusFilter="statusFilter = $event"
            @update:roleFilter="roleFilter = $event"
            @view="handleView"
            @edit="handleEdit"
            @prevPage="onPrevPage()"
            @nextPage="onNextPage()"
            @movePage="onMovePage"
        />
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, computed } from 'vue'
    import StatCards from '@/components/admin/StatCards.vue'
    import MembersTable from '@/components/admin/user_management/MembersTable.vue'

    const totalUser = computed(() => users.length + shelter.length)
    const totalUserBlack = computed(() => {       
        const blackUser = [...users].filter(u => u.userStatus.toLowerCase() === 'black');
        return blackUser.length;
    })
    const totalUserCancel = computed(() => {
        const cancelUser = [...users].filter(u => u.userStatus.toLowerCase() == 'cancel');
        return cancelUser.length;
    })
    const stats = computed(() => [
        { label: '전체 플랫폼 회원', icon: '✅', value: totalUser.value, change: null, changeType: null },
        { label: '정지 회원', icon: '🚩', value: totalUserBlack.value, change: `비율: ${(totalUserBlack.value/totalUser.value)*100}%`, changeType: 'warning' },
        { label: '탈퇴 회원', icon: '⏰', value: totalUserCancel.value, change: `비율: ${(totalUserCancel.value/totalUser.value)*100}%`, changeType: 'negative' }
    ])



    // const columns = ref(['회원정보', '가입일', '최근접속', '권한', '상태', '플랫폼도 및 게시글/댓글', '관리'])

    const userColumns 
        = ref(['회원 정보', '최근접속', '정지 해제일','상태', '작성 게시글/댓글 수']);
    const shelterColumns 
        = ref(['회원 정보', '최근접속', '전화번호', '상태','작성 게시글/댓글 수', '주소']);

    const users = reactive([]);
    const userPage = reactive({
        totalCount: 0,     // 전체 데이터 개수
        totalPage: 0,      // 전체 페이지 수
        startPage: 0,      // 현재 구간의 시작 페이지
        endPage: 0,        // 현재 구간의 끝 페이지
        currentPage: 1,    // 현재 선택된 페이지
        size: 5,           // 한 페이지당 데이터 수
        blockSize: 5,      // 한 번에 보여줄 페이지 번호 개수 (1~5, 6~10 등)

        // ✅ 전체 페이지 및 구간 계산
        pagination() {
            this.totalPage = Math.ceil(this.totalCount / this.size)

            const blockIndex = Math.floor((this.currentPage - 1) / this.blockSize)
            this.startPage = blockIndex * this.blockSize + 1
            this.endPage = Math.min(this.startPage + this.blockSize - 1, this.totalPage)
        },

        // ✅ 페이지 이동
        movePage(page) {
            if (page < 1 || page > this.totalPage) return
            this.currentPage = page
            this.pagination()

            console.log(page);
        },

        // ✅ 이전 페이지
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
                this.pagination()
            }
        },

        // ✅ 다음 페이지
        nextPage() {
            if (this.currentPage < this.totalPage) {
                this.currentPage++
                this.pagination()
            }
        },

        // ✅ 총 개수 세팅
        setTotal(count) {
            this.totalCount = count
            this.pagination()
        }
    })
    const shelter = reactive([]);
    const shelterPage = reactive({
        totalCount: 0,     // 전체 데이터 개수
        totalPage: 0,      // 전체 페이지 수
        startPage: 0,      // 현재 구간의 시작 페이지
        endPage: 0,        // 현재 구간의 끝 페이지
        currentPage: 1,    // 현재 선택된 페이지
        size: 5,           // 한 페이지당 데이터 수
        blockSize: 5,      // 한 번에 보여줄 페이지 번호 개수 (1~5, 6~10 등)

        // ✅ 전체 페이지 및 구간 계산
        pagination() {
            this.totalPage = Math.ceil(this.totalCount / this.size)

            const blockIndex = Math.floor((this.currentPage - 1) / this.blockSize)
            this.startPage = blockIndex * this.blockSize + 1
            this.endPage = Math.min(this.startPage + this.blockSize - 1, this.totalPage)
        },

        // ✅ 페이지 이동
        movePage(page) {
            if (page < 1 || page > this.totalPage) return
            this.currentPage = page
            this.pagination()
        },

        // ✅ 이전 페이지
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
                this.pagination()
            }
        },

        // ✅ 다음 페이지
        nextPage() {
            if (this.currentPage < this.totalPage) {
                this.currentPage++
                this.pagination()
            }
        },

        // ✅ 총 개수 세팅
        setTotal(count) {
            this.totalCount = count
            this.pagination()
        }
    })
    const fetchUser = async () => {
        const res = await fetch(`http://localhost:8000/user-service/user/admin/user?type=ALL`);
        const data = await res.json();

        users.length = 0;
        users.push(...data);
        userPage.setTotal(users.length)

        // console.log(users);
    }

    const fetchShelter = async () => {
        const res = await fetch(`http://localhost:8000/user-service/user/admin/head`);
        const data = await res.json();

        shelter.length = 0;
        shelter.push(...data);
        shelterPage.setTotal(shelter.length)
    }

    onMounted(async () => {
        await fetchUser();
        await fetchShelter();
    })

    const searchQuery = ref('')         // 검색
    const statusFilter = ref('')        // 일반, 정지, 탈퇴
    const roleFilter = ref('user')          // 일반 : 보호소


    const filteredUsers = computed(() => {
        let list = [...users];

        // 상태 필터
        if (statusFilter.value === 'general') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'general');
        } else if (statusFilter.value === 'black') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'black');
        } else if (statusFilter.value === 'cancel') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'cancel');
        }
        
        // 검색 필터
        if (searchQuery.value.trim() !== '') {
            const q = searchQuery.value.toLowerCase();
            list = list.filter(u =>
                u.userName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        }

        userPage.setTotal(list.length);

        const start = (userPage.currentPage - 1) * userPage.size;
        const end = start + userPage.size;
        return list.slice(start, end);
    }) 

    const filteredShelters = computed(() => {
        let list = shelter.map(u => ({
            ...u,
            userStatus: u.closeDate ? 'CANCEL' : 'GENERAL'
        }));

        // 상태 필터
        if (statusFilter.value === 'general') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'general');
        } else if (statusFilter.value === 'cancel') {
            list = list.filter(u => u.userStatus.toLowerCase() === 'cancel');
        }

        // 검색 필터
        if (searchQuery.value.trim() !== '') {
            const q = searchQuery.value.toLowerCase();
            list = list.filter(u =>
                u.companyName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        }
    
        shelterPage.setTotal(list.length);
    
        const start = (shelterPage.currentPage - 1) * shelterPage.size;
        const end = start + shelterPage.size;
        return list.slice(start, end);
    });

    const onMovePage = (p) => {
        if (roleFilter === 'user') {
            userPage.currentPage = p;
            userPage.pagination();
        } else {
            shelterPage.currentPage = p;
            shelterPage.pagination();
        }
    }

    const onPrevPage = () => {
        if (roleFilter === 'user') {
            userPage.currentPage--;
            userPage.pagination();
        } else {
            shelterPage.currentPage--;
            shelterPage.pagination();
        }
    }
    const onNextPage = () => {
        if (roleFilter === 'user') {
            userPage.currentPage++;
            userPage.pagination();
        } else {
            shelterPage.currentPage++;
            shelterPage.pagination();
        }
    }

    const handleView = (member) => {
        console.log('View member:', member)
        // TODO: 회원 상세 모달 열기
    }

    const handleEdit = (member) => {
        console.log('Edit member:', member)
        // TODO: 회원 수정 모달 열기
    }


    // const chartData = ref([
    //     { label: '3월 정지', value: '1,424건 (50.0%)', color: '#FF6B6B' },
    //     { label: '7월 정지', value: '852건 (30.0%)', color: '#FFA94D' },
    //     { label: '15일 정지', value: '341건 (12.0%)', color: '#A78BFA' },
    //     { label: '블랙리스트 회원', value: '230건 (8.0%)', color: '#51CF66' }
    // ])

    import dayjs from 'dayjs'
    const CIRCUMFERENCE = 2 * Math.PI * 80 // 약 502

    // 🔸 chartData를 computed로 자동 계산
    const chartData = computed(() => {
        const now = dayjs();

        // 1️⃣ 보호소장 회원
        const activeShelters = shelter.filter(h => !h.closeDate).length;

        // 2️⃣ 일반회원 (접속 상태별)
        const generalUsers = users.filter(u => u.userStatus === 'GENERAL');
        const totalGeneral = generalUsers.length;

        const recent3 = generalUsers.filter(u =>
            u.loginHistory && dayjs(u.loginHistory.loggedAt).isAfter(now.subtract(3, 'day'))
        ).length;

        const recent5 = generalUsers.filter(u =>
            u.loginHistory &&
            dayjs(u.loginHistory.loggedAt).isAfter(now.subtract(5, 'day')) &&
            dayjs(u.loginHistory.loggedAt).isBefore(now.subtract(3, 'day'))
        ).length;

        const over5 = totalGeneral - (recent3 + recent5);

        // 3️⃣ 정지회원
        const blackUsers = users.filter(u => u.userStatus === 'BLACK').length;

        // 4️⃣ 탈퇴회원
        const cancelUsers = users.filter(u => u.userStatus === 'CANCEL').length;

        const total = activeShelters + totalGeneral + blackUsers + cancelUsers;
        if (total === 0) return [];

        const toPercent = (v) => ((v / total) * 100);

        return [
            { label: '보호소장 회원', count: activeShelters, percent: toPercent(activeShelters), color: '#51CF66' },
            { label: '일반회원 - 3일내 접속', count: recent3, percent: toPercent(recent3), color: '#69DB7C' },
            { label: '일반회원 - 5일내 접속', count: recent5, percent: toPercent(recent5), color: '#FFD43B' },
            { label: '일반회원 - 5일 이상 미접속', count: over5, percent: toPercent(over5), color: '#FFA94D' },
            { label: '정지회원', count: blackUsers, percent: toPercent(blackUsers), color: '#FF6B6B' },
            { label: '탈퇴회원', count: cancelUsers, percent: toPercent(cancelUsers), color: '#A78BFA' }
        ];
    });

    // 🔸 stroke-dashoffset 계산 함수
    const getDashOffset = (index) => {
        const prevPercent = chartData.value
            .slice(0, index)
            .reduce((sum, item) => sum + item.percent, 0);

        return -(prevPercent / 100) * CIRCUMFERENCE;
    };

</script>

<style scoped>
    .tab-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .chart-section {
        background: #FEFDFB;
        border: 1px solid #E8DCC8;
        border-radius: 12px;
        padding: 24px;
    }

    .chart-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 4px 0;
    }

    .chart-subtitle {
        font-size: 13px;
        color: #999;
        margin: 0 0 24px 0;
    }

    .chart-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 60px;
        padding: 20px 0;
    }

    .pie-chart {
        width: 280px;
        height: 280px;
        transform: rotate(-90deg);
    }

    .chart-center-label {
        font-size: 12px;
        fill: #999;
        transform: rotate(90deg);
        transform-origin: 100px 95px; 
    }

    .chart-center-value {
        font-size: 18px;
        font-weight: 700;
        fill: #000;
        transform: rotate(90deg);
        transform-origin: 100px 115px;
    }

    .chart-legend {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .legend-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .legend-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .legend-label {
        font-size: 13px;
        color: #666;
    }

    .legend-value {
        font-size: 14px;
        font-weight: 600;
        color: #000;
    }

    @media (max-width: 768px) {
        .chart-container {
            flex-direction: column;
            gap: 30px;
        }
    }
</style>