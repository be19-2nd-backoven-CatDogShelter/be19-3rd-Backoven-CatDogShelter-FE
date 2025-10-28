<template>
    <div class="stats-row">
        <div v-for="(stat, index) in stats" :key="index" class="stat-card">
            <div class="stat-header">
                <span>{{ stat.label }}</span>
                <span class="stat-icon">{{ stat.icon }}</span>
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <div v-if="stat.change" :class="['stat-change', stat.changeType]">{{ stat.change }}</div>
        </div>
    </div>
</template>

<script setup>
defineProps({ 
    stats: {
        type: Array,
        required: true,
        // Example: [{ label: '전체 게시글', icon: '📄', value: '1,234', change: '전월 대비 +12%', changeType: 'positive' }]
    }
})
</script>

<style scoped>
.stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.stat-card {
    background: #FEFDFB;
    border: 1px solid #E8DCC8;
    border-radius: 12px;
    padding: 20px;
}

.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
}

.stat-icon {
    font-size: 24px;
}

.stat-value {
    font-size: 36px;
    font-weight: 800;
    color: #000;
    margin-bottom: 8px;
}

.stat-change {
    font-size: 13px;
    font-weight: 600;
}

.stat-change.positive {
    color: #51CF66;
}

.stat-change.negative {
    color: #FF6B6B;
}

.stat-change.warning {
    color: #FFA94D;
}

.stat-change.success {
    color: #51CF66;
}

@media (max-width: 1200px) {
    .stats-row {
        grid-template-columns: 1fr;
    }
}
</style>