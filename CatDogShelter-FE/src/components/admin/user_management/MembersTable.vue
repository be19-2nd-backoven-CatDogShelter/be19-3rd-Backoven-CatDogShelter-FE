<template>
    <div class="members-table-section">
        <div class="table-header">
            <h3>{{ title }}</h3>
            <div class="role-buttons" v-if = "title == '회원 목록'">
                <button 
                    :class="['role-btn', { active: roleFilter === 'user' }]"
                    @click="$emit('update:roleFilter', 'user')"
                >일반회원</button>
                <button 
                    :class="['role-btn', { active: roleFilter === 'shelter' }]"
                    @click="$emit('update:roleFilter', 'shelter')"
                >보호소장</button>
            </div>

            <div class="table-controls">
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="검색" 
                        :value="searchQuery"
                        @input="$emit('update:searchQuery', $event.target.value)"
                    />
                </div>
                <select 
                    class="filter-select"
                    :value="statusFilter"
                    @change="$emit('update:statusFilter', $event.target.value)"
                >
                    <option value="">상태별</option>
                    <option value="general">일반</option>
                    <option value="black" v-if = "roleFilter!=='shelter'">정지</option>
                    <option value="cancel">탈퇴</option>
                </select>
            </div>
        </div>

        <table class="members-table">
            <thead>
                <tr>
                    <th v-for="column in columns" :key="column">{{ column }}</th>
                </tr>
            </thead>
            <tbody v-if = "roleFilter === 'user'">
                <tr v-for="member in members" :key="member.id">
                    <td>
                        <div class="member-info">
                            <!-- <div class="member-avatar">{{ member.name[0] }}</div> -->
                            <div class="member-details">
                                <div class="member-name">{{ member.userName }} <span class ="member-rating" :class="'rating-' + member.rating.id">{{ member.rating.name }}</span></div>
                                <div class="member-sub">{{ member.email }}</div>
                                <!-- <div class="member-id">ID: {{ member.id }}</div> -->
                            </div>
                        </div>
                    </td>
                    <td>
                        <div>
                            <div class="member-main">{{ member.loginHistory.loggedAt }}</div>
                            <!-- <div class="member-sub">{{ member.loginHistory.loggedAt }}</div> -->
                        </div>
                    </td>
                    <td>
                        <div>
                            <div class="member-main">{{ member.activationDate }}</div>
                            <!-- <div class="member-sub">{{ member.activationDate }}</div> -->
                        </div>
                    </td>
                    <td>
                        <span :class="{ 'role-badge': true, 
                                        'general': member.userStatus.toLowerCase() === 'general', 
                                        'black': member.userStatus.toLowerCase() === 'black', 
                                        'cancel': member.userStatus.toLowerCase() === 'cancel' }">
                            {{ member.userStatus }}
                        </span>
                    </td>
                    <td>{{ member.postCount }} / {{ member.commentCount }}</td>
                    <td>
                        <div class="action-buttons">
                            <!-- <button class="action-btn view" title="보기" @click="$emit('view', member)">👁️</button> -->
                            <!-- <button class="action-btn edit" title="수정" @click="$emit('edit', member)">✏️</button> -->
                            <!-- <button class="action-btn delete" title="삭제" @click="$emit('delete', member)">🗑️</button> -->
                        </div>
                    </td>
                </tr>
            </tbody>
            <tbody v-if = "roleFilter === 'shelter'">
                <tr v-for="member in members" :key="member.id">
                    <td>
                        <div class="member-info">
                            <!-- <div class="member-avatar">{{ member.name[0] }}</div> -->
                            <div class="member-details">
                                <div class="member-name">{{ member.companyName }}</div>
                                <div class="member-sub">{{ member.email }}</div>
                                <!-- <div class="member-id">ID: {{ member.id }}</div> -->
                            </div>
                        </div>
                    </td>
                    <td>
                        <div>
                            <div class="member-main">{{ member.headLoginHistory.loggedAt }}</div>
                            <!-- <div class="member-sub">{{ member.loginHistory.loggedAt }}</div> -->
                        </div>
                    </td>
                    <td>
                        <div>
                            <div class="member-main">{{ member.headPhone }}</div>
                            <!-- <div class="member-sub">{{ member.activationDate }}</div> -->
                        </div>
                    </td>
                    <td>
                        <span :class="{ 'role-badge': true, 
                                        'general': member.userStatus.toLowerCase() === 'general', 
                                        'black': member.userStatus.toLowerCase() === 'black', 
                                        'cancel': member.userStatus.toLowerCase() === 'cancel' }">
                            {{ member.userStatus }}
                        </span>
                    </td>
                    <td>{{ member.postCount }} / {{ member.commentCount }}</td>
                    <td>
                        {{ member.companyAddress }}
                    </td>

                    <!-- <td>
                        <div class="action-buttons">
                            <button class="action-btn view" title="보기" @click="$emit('view', member)">👁️</button>
                            <button class="action-btn edit" title="수정" @click="$emit('edit', member)">✏️</button>
                            <button class="action-btn delete" title="삭제" @click="$emit('delete', member)">🗑️</button>
                        </div>
                    </td> -->
                </tr>
            </tbody>
        </table>

        <div class="pagination">
            <button class="page-btn" @click="$emit('prevPage')" :disabled="page.currentPage === 1">&lt; 이전</button>

            <button
                v-for="p in Array(page.endPage - page.startPage + 1).fill().map((_, i) => i + page.startPage)"
                :key="p"
                :class="['page-btn', { active: p === page.currentPage }]"
                @click="$emit('movePage', p)"
            >
                {{ p }}
            </button>
        
            <button class="page-btn" @click="$emit('nextPage')" :disabled="page.currentPage === page.totalPage">다음 &gt;</button>
        </div>
    </div>
</template>

<script setup>
    import { computed, watch, ref } from 'vue';

    const props = defineProps({
        // 테이블 제목
        title: {
            type: String,
            default: '회원 목록'
        },

        // 컬럼 설정 (유저 / 보호소 각각)
        userColumns: {
            type: Array,
            required: true
        },
        shelterColumns: {
            type: Array,
            required: true
        },

        // 실제 데이터
        users: {
            type: Array,
            required: true
        },
        shelter: {
            type: Array,
            required: true
        },

        // 페이징 정보
        userPage: {
            type: Object,
            required: true
        },
        shelterPage: {
            type: Object,
            required: true
        },

        // 검색 / 필터
        searchQuery: {
            type: String,
            default: ''
        },
        statusFilter: {
            type: String,
            default: ''
        },
        roleFilter: {
            type: String,
            default: ''
        },

        // 통계 노출 여부
        showStats: {
            type: Boolean,
            default: false
        }
    })

    defineEmits([
        'update:searchQuery',
        'update:statusFilter',
        'update:roleFilter',
        'view',
        'edit',
        'prevPage',
        'nextPage',
        'movePage'
    ])

    const columns = computed(() => props.roleFilter === 'user' ? props.userColumns : props.shelterColumns);
    const members = computed(() => props.roleFilter === 'user' ? props.users : props.shelter);
    const page = computed(() => props.roleFilter === 'user' ? props.userPage : props.shelterPage);

</script>

<style scoped>
    .members-table-section {
        background: #FEFDFB;
        border-radius: 12px;
        padding: 24px;
        margin-top: 8px;
    }

    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        gap: 16px;
        flex-wrap: wrap;
    }

    .table-header h3 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
    }

    .role-buttons {
        display: flex;
        gap: 8px;
        margin-left: 16px; /* "회원목록" 제목 옆 */
    }

    .role-btn {
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid #E0E0E0;
        background: #fff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
    }

    .role-btn:hover {
        background: #F5F0E8;
    }

    .role-btn.active {
        background: #6B4A2B;
        color: #fff;
        border-color: #6B4A2B;
    }
    
    .table-controls {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
    }

    .search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #fff;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        padding: 8px 12px;
    }

    .search-icon {
        font-size: 16px;
    }

    .search-box input {
        border: none;
        outline: none;
        font-size: 14px;
        width: 160px;
    }

    .filter-select {
        padding: 8px 12px;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        font-size: 14px;
        background: #fff;
        cursor: pointer;
    }

    .members-table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
    }

    .members-table thead {
        background: #F8F9FA;
    }

    .members-table th {
        padding: 14px 16px;
        text-align: left;
        font-size: 13px;
        font-weight: 700;
        color: #666;
        border-bottom: 1px solid #E8DCC8;
    }

    .members-table td {
        padding: 16px;
        border-bottom: 1px solid #F0F0F0;
        font-size: 14px;
        color: #333;
    }

    .members-table tbody tr:hover {
        background: #FEFDFB;
    }

    .member-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .member-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #E8DCC8;
        display: grid;
        place-items: center;
        font-size: 16px;
        font-weight: 700;
        color: #6B4A2B;
        flex-shrink: 0;
    }

    .member-details {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    /* 이름 스타일 */
    .member-name {
        font-weight: 600;
        color: #000;
        font-size: 14px;
    }
    /* rating badge 공통 스타일 */
    .member-rating {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 600;
        color: #fff;
    }

    /* rating.id 별 색상 */
    .member-rating.rating-0 { background-color: #d23b19; } /* 파랑 */
    .member-rating.rating-1 { background-color: #1976D2; } /* 파랑 */
    .member-rating.rating-2 { background-color: #9C27B0; } /* 보라 */
    .member-rating.rating-3 { background-color: #FF5722; } /* 주황 */
    .member-rating.rating-4 { background-color: #4CAF50; } /* 초록 */
    .member-rating.rating-5 { background-color: #FFC107; } /* 노랑 */

    .member-main {
        font-weight: 600;
        color: #000;
    }

    .member-rating {
        background-color: #E0E0E0;
    }

    .member-sub {
        font-size: 13px;
        color: #666;
        margin-top: 2px;
    }

    .member-id {
        font-size: 12px;
        color: #999;
    }

    .access-info {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .access-status {
        font-size: 13px;
    }

    .access-status.recent {
        color: #51CF66;
    }

    .access-status.old {
        color: #666;
    }

    .access-indicator {
        font-size: 8px;
    }

    .role-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        background-color: #000;
    }

    .general {
        background-color: #4CAF50; /* 초록 */
    }

    .black {
        background-color: #FF9800; /* 주황 */
    }

    .cancel {
        background-color: #F44336; /* 빨강 */
    }

    .status-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
    }

    .status-badge.active {
        background: #E8F5E9;
        color: #2E7D32;
    }

    .status-badge.pending {
        background: #FFF3E0;
        color: #E65100;
    }

    .status-badge.approved {
        background: #E8F5E9;
        color: #2E7D32;
    }

    .action-buttons {
        display: flex;
        gap: 8px;
    }

    .action-btn {
        width: 32px;
        height: 32px;
        border: 1px solid #E0E0E0;
        background: #fff;
        border-radius: 6px;
        cursor: pointer;
        display: grid;
        place-items: center;
        font-size: 16px;
        transition: all 0.2s;
    }

    .action-btn:hover {
        background: #F5F0E8;
        border-color: #D0D0D0;
    }

    .pagination {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 24px;
    }

    .page-btn {
        padding: 8px 14px;
        border: 1px solid #E0E0E0;
        background: #fff;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
    }

    .page-btn:hover {
        background: #F5F0E8;
    }

    .page-btn.active {
        background: #6B4A2B;
        color: #fff;
        border-color: #6B4A2B;
    }

    .role-buttons {
        display: flex;
        gap: 8px;
        margin-left: 16px; /* "회원목록" 제목 옆 */
    }

    .perm-btn {
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid #E0E0E0;
        background: #fff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
    }

    .perm-btn:hover {
        background: #F5F0E8;
    }

    .perm-btn.active {
        background: #6B4A2B;
        color: #fff;
        border-color: #6B4A2B;
    }

    @media (max-width: 768px) {
        .table-controls {
            width: 100%;
            flex-direction: column;
        }

        .search-box,
        .filter-select {
            width: 100%;
        }

        .members-table {
            font-size: 12px;
        }

        .members-table th,
        .members-table td {
            padding: 10px;
        }
    }
</style>