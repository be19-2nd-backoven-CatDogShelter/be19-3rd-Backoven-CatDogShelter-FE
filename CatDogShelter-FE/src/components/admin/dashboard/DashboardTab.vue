<template>
    <div class="tab-content">
        <StatCards :stats="topStats" />
        
        <div class="content-grid">
            <div class="grid-section">
                <h2 class="section-title">일반회원</h2>
                <div class="content-cards">
                    <div class="content-card" v-for="item in normalUserContent" :key="item.name">
                        <div class="card-header">
                            <span>{{ item.name }}</span>
                            <span class="card-icon">💛</span>
                        </div>
                        <div class="card-value">{{ item.value }}</div>
                        <div class="card-change">{{ item.change }}</div>
                    </div>
                </div>
            </div>

            <div class="grid-section">
                <h2 class="section-title">보호소장</h2>
                <div class="content-cards">
                    <div class="content-card" v-for="item in shelterContent" :key="item.name">
                        <div class="card-header">
                            <span>{{ item.name }}</span>
                            <span class="card-icon">💛</span>
                        </div>
                        <div class="card-value">{{ item.value }}</div>
                        <div class="card-change">{{ item.change }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="stats-summary">
            <div class="summary-card" v-for="summary in summaryStats" :key="summary.label">
                <div class="summary-header">
                    <span>{{ summary.label }}</span>
                    <span class="summary-icon">{{ summary.icon }}</span>
                </div>
                <div class="summary-value">{{ summary.value }}</div>
                <div :class="['summary-change', summary.changeType]">{{ summary.change }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import StatCards from '@/components/admin/StatCards.vue'

const topStats = ref([
    { label: '전체 게시글', icon: '📄', value: '1,234', change: '전월 대비 +12%', changeType: 'positive' },
    { label: '오늘 게시글', icon: '😊', value: '23', change: '어제 대비 +5%', changeType: 'positive' },
    { label: '오늘 댓글', icon: '😊', value: '23', change: '어제 대비 +5%', changeType: 'positive' }
])

const normalUserContent = ref([
    { name: '봉사모집 게시판', value: '234', change: '+12 이번달' },
    { name: '입양 게시판', value: '234', change: '+12 이번달' },
    { name: '자유 게시판', value: '234', change: '+12 이번달' },
    { name: '목격제보 게시판', value: '234', change: '+12 이번달' },
    { name: '실종신고 게시판', value: '234', change: '+12 이번달' },
    { name: '입양', value: '234', change: '+12 이번달' }
])

const shelterContent = ref([
    { name: '봉사모집 게시판', value: '234', change: '+12 이번달' },
    { name: '입양 게시판', value: '234', change: '+12 이번달' },
    { name: '자유 게시판', value: '234', change: '+12 이번달' },
    { name: '목격제보 게시판', value: '234', change: '+12 이번달' },
    { name: '후원기부 게시판', value: '234', change: '+12 이번달' }
])

const summaryStats = ref([
    { label: '전체 회원', icon: '👥', value: '2,847', change: '전월 대비 +8.2%', changeType: 'positive' },
    { label: '보호소장 회원', icon: '👥', value: '2,847', change: '전월 대비 +8.2%', changeType: 'positive' },
    { label: '이번 신규', icon: '👤', value: '156', change: '+23% 증가', changeType: 'positive' }
])
</script>

<style scoped>
.tab-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.content-grid {
    display: grid;
    gap: 24px;
}

.grid-section {
    background: #FEFDFB;
    border-radius: 12px;
    padding: 24px;
}

.section-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 16px 0;
}

.content-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.content-card {
    background: #fff;
    border: 1px solid #E8DCC8;
    border-radius: 10px;
    padding: 16px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
}

.card-icon {
    font-size: 20px;
}

.card-value {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 6px;
}

.card-change {
    font-size: 12px;
    color: #51CF66;
}

.stats-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.summary-card {
    background: #F8F9FA;
    border-radius: 12px;
    padding: 20px;
}

.summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
}

.summary-icon {
    font-size: 24px;
}

.summary-value {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 8px;
}

.summary-change {
    font-size: 13px;
    font-weight: 600;
}

.summary-change.positive {
    color: #51CF66;
}

@media (max-width: 1200px) {
    .content-cards {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .content-cards {
        grid-template-columns: 1fr;
    }

    .stats-summary {
        grid-template-columns: 1fr;
    }
}
</style>