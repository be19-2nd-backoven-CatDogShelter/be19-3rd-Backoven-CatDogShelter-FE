<template>
    <div class="tab-content">
        <MembersTable
            title="관리자 목록"
            :userColumns="userColumns"
            :users="filteredUsers"
            :userPage="userPage"
            :shelterColumns="shelterColumns ?? []"
            :shelter="shelter ?? []"
            :shelterPage="shelterPage ?? {}"

            :searchQuery="searchQuery"
            :statusFilter="statusFilter"
            :roleFilter="roleFilter"
            :showStats="true"
            @update:searchQuery="searchQuery = $event"
            @update:statusFilter="statusFilter = $event"
            @update:roleFilter="roleFilter = $event"
            @view="handleView"
            @edit="handleEdit"
            @prevPage="onPrevPage"
            @nextPage="onNextPage"
            @movePage="onMovePage"
            />
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, computed } from 'vue'
    import StatCards from '@/components/admin/StatCards.vue'
    import MembersTable from '@/components/admin/user_management/MembersTable.vue'

    const stats = ref([
        { label: '기반사항 보호소장', icon: '🚩', value: '147', change: '이번달 +23', changeType: 'negative' },
        { label: '권도 대기', icon: '⏰', value: '38', change: '처리 필요', changeType: 'warning' },
        { label: '처리 완성되던 회원', icon: '✅', value: '109', change: '74% 처리율', changeType: 'success' }
    ])

    const distributionData = ref([
        { label: '스팸/광고', value: '1,424건 (50%)', percentage: '50%', color: '#FF6B6B' },
        { label: '부적절한 내용', value: '852건 (30%)', percentage: '30%', color: '#FFA94D' },
        { label: '동물학대', value: '341건 (12%)', percentage: '12%', color: '#A78BFA' },
        { label: '기타', value: '230건 (8%)', percentage: '8%', color: '#51CF66' }
    ])



    const shelterColumns = ref([]); // Array 기본값
    const shelter = ref([]);        // Array 기본값
    const shelterPage = ref({});    // Object 기본값
    const filteredShelters = computed(() => {
        // 예시: statusFilter가 있을 경우 필터링
        return shelter.value.filter(s => s.status !== undefined)
    })
    const userColumns 
        = ref(['회원 정보', '최근접속', '정지 해제일','상태', '작성 게시글/댓글 수']);
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
    
    const fetchUser = async () => {
        const res = await fetch(`http://localhost:8000/user-service/user/admin/admin`);
        const data = await res.json();

        users.length = 0;
        users.push(...data);
        userPage.setTotal(users.length)

        // console.log(users);
    }

    onMounted(async () => {
        await fetchUser();
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

    const handleView = (member) => {
        console.log('View member:', member)
        // TODO: 회원 상세 모달 열기
    }

    const handleEdit = (member) => {
        console.log('Edit member:', member)
        // TODO: 회원 수정 모달 열기
    }

    const onMovePage = (p) => {
        userPage.currentPage = p;
        userPage.pagination();

    }

    const onPrevPage = () => {
        userPage.currentPage--;
        userPage.pagination();
    }
    const onNextPage = () => {
        userPage.currentPage++;
        userPage.pagination();

    }
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

    .distribution-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .distribution-item {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .dist-bar {
        height: 32px;
        border-radius: 6px;
        transition: width 0.3s;
        min-width: 20px;
    }

    .dist-label {
        font-size: 14px;
        color: #666;
        min-width: 120px;
    }

    .dist-value {
        font-size: 14px;
        font-weight: 600;
        color: #000;
    }
</style>