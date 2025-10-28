<template>
    <aside class="admin-sidebar">
        <div class="admin-profile">
            <div class="profile-name">ADMIN</div>
        </div>

        <nav class="admin-nav">
            <div class="nav-section">
                <div class="nav-label">DASHBOARD</div>
                <button 
                    :class="['nav-item', { active: activeTab === 'dashboard' }]"
                    @click="$emit('update:activeTab', 'dashboard')">
                    <span class="nav-icon">📊</span>
                    <span>대시보드</span>
                </button>
            </div>

            <div class="nav-section">
                <div class="nav-label">REPORT MANAGEMENT</div>
                <button class="nav-item"
                    :class="['nav-item', { active: activeTab === 'postsReport' }]"
                    @click="$emit('update:activeTab', 'postsReport')">
                    <span class="nav-icon">📄</span>
                    <span>신고 관리(게시글)</span>
                    <span v-if = "postReportAlarm" class = "reportAlarm">{{ postReportCount }}</span>
                </button>
                <button class="nav-item"
                    :class="['nav-item', { active: activeTab === 'commentsReport' }]"
                    @click="$emit('update:activeTab', 'commentsReport')">
                    <span class="nav-icon">💬</span>
                    <span>신고 관리(댓글)</span>
                    <span v-if = "commentReportAlarm" class = "reportAlarm">{{ commentReportCount }}</span>
                </button>
            </div>

            <div class="nav-section">
                <div class="nav-label">USER MANAGEMENT</div>
                <button 
                    :class="['nav-item', { active: activeTab === 'members' }]"
                    @click="$emit('update:activeTab', 'members')">
                        <span class="nav-icon">👥</span>
                        <span>회원 관리</span>
                </button>
                <button 
                    :class="['nav-item', { active: activeTab === 'permissions' }]"
                    @click="$emit('update:activeTab', 'permissions')">
                    <span class="nav-icon">🛡️</span>
                    <span>권한 관리</span>
                </button>
            </div>

            <div class="nav-section">
                <div class="nav-label">SYSTEM</div>
                <button class="nav-item">
                    <span class="nav-icon">⚙️</span>
                    <span>설정</span>
                </button>
                <button 
                    :class="['nav-item', { active: activeTab === 'logs' }]"
                    @click="$emit('update:activeTab', 'logs')">
                    <span class="nav-icon">📋</span>
                    <span>로그</span>
                </button>
            </div>
        </nav>
    </aside>
</template>

<script setup>
    import {ref, watch, onMounted} from 'vue';

    const { activeTab } = defineProps({
        activeTab: {
            type: String,
            required: true
        }
    })

    defineEmits(['update:activeTab'])


    const postReportCount = ref(0);
    const postReportAlarm = ref(false);
    const commentReportCount = ref(0);
    const commentReportAlarm = ref(false);

    // 게시글 신고 확인
    const fetchPostReport = async () => {
        const res = await fetch('http://localhost:8000/user-service/user/admin/report-post-count');
        postReportCount.value = await res.json();
    }

    // 댓글 신고 확인
    const fetchCommentReport = async () => {
        const res = await fetch('http://localhost:8000/user-service/user/admin/report-comment-count');
        commentReportCount.value = await res.json();
    }

    // ✅ 초기 실행 (화면 뜰 때 한 번 실행)
    onMounted(async () => {
        await fetchPostReport()
        await fetchCommentReport()
        postReportAlarm.value = postReportCount.value > 0
        commentReportAlarm.value = commentReportCount.value > 0
    })

    watch(() => activeTab, async (newTab) => {
        if(newTab !== 'postsReport') {
            await fetchPostReport();
            postReportAlarm.value = postReportCount.value > 0

            // console.log(postReportAlarm.value)
            // console.log(postReportCount.value)
        } else {
            postReportAlarm.value = false
        }
        if(newTab !== 'commentsReport') {
            await fetchCommentReport();
            commentReportAlarm.value = commentReportCount.value > 0
            
            // console.log(commentReportAlarm.value)
            // console.log(commentReportCount.value)
        } else {
            commentReportAlarm.value = false
        }
    })
</script>

<style scoped>
    .admin-sidebar {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        position: sticky;
        top: 20px;
    }

    .admin-profile {
        padding: 12px;
        margin-bottom: 20px;
    }

    .profile-name {
        font-size: 20px;
        font-weight: 700;
        color: #000;
    }

    .admin-nav {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .nav-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .nav-label {
        font-size: 11px;
        font-weight: 700;
        color: #999;
        padding: 0 12px 8px;
        letter-spacing: 0.5px;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: none;
        background: transparent;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        color: #000;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        width: 100%;
    }

    .nav-item:hover {
        background: #F5F0E8;
    }

    .nav-item.active {
        background: #E8DCC8;
        color: #000;
    }

    .nav-icon {
        font-size: 18px;
    }

    @media (max-width: 1200px) {
        .admin-sidebar {
            position: static;
        }
    }

    .reportAlarm {
    display: inline-block;
    background-color: #FF4D4F; /* 빨간색 배경 */
    color: #fff;
    font-weight: 700;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 12px;
    margin-left: 8px;
    min-width: 20px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);

    position: relative; /* 위치 조정 가능하게 */
    top: 2px;           /* 글자 기준으로 2px 아래로 이동 */
}
</style>