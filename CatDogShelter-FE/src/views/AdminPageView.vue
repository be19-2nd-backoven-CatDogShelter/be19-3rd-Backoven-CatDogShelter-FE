<template>
    <div class="admin-page">
        <div class="admin-container">
            <h1 class="page-title">관리자 페이지</h1>
            <p class="page-subtitle">사이트의 통계 정보 확인하고, 관리하세요</p>

            <div class="admin-layout">
            <!-- 사이드바 -->
            <AdminSidebar :activeTab="activeTab" @update:activeTab="activeTab = $event" />

                <!-- 메인 컨텐츠 -->
                <main class="admin-main">
                    <component :is="currentTabComponent" />
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import AdminSidebar from '@/components/admin/AdminSidebar.vue'
    import DashboardTab from '@/components/admin/dashboard/DashboardTab.vue'
    import PostsManagementTab from '@/components/admin/report_management/PostsReportManagementTab.vue'
    import CommentsManagementTab from '@/components/admin/report_management/CommentsReportManagementTab.vue'
    import MembersTab from '@/components/admin/user_management/MembersTab.vue'
    import PermissionsTab from '@/components/admin/user_management/AdminsTab.vue'
    import LogsTab from '@/components/admin/system/LogsTab.vue'

    const activeTab = ref('dashboard')

    const currentTabComponent = computed(() => {
        const tabs = {
            dashboard: DashboardTab,
            postsReport: PostsManagementTab,
            commentsReport: CommentsManagementTab,
            members: MembersTab,
            permissions: PermissionsTab,
            logs: LogsTab
        }
        return tabs[activeTab.value]
    })

</script>

<style scoped>
    .admin-page {
        min-height: 100vh;
        background: #F5F0E8;
        padding: 20px;
    }

    .admin-container {
        max-width: 1600px;
        margin: 0 auto;
    }

    .page-title {
        font-size: 32px;
        font-weight: 800;
        color: #000;
        margin: 0 0 8px 0;
    }

    .page-subtitle {
        font-size: 15px;
        color: #666;
        margin: 0 0 24px 0;
    }

    .admin-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 20px;
        align-items: start;
    }

    .admin-main {
        background: #fff;
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        min-height: 600px;
    }

    @media (max-width: 1200px) {
        .admin-layout {
            grid-template-columns: 1fr;
        }}

    @media (max-width: 768px) {
        .admin-page {
            padding: 12px;
        }

        .admin-main {
            padding: 20px;
        }
    }
</style>