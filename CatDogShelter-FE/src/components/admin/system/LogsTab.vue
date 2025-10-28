<template>
    <div class="tab-content">
        <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3 class="empty-title">로그 내용이 표시됩니다</h3>
            <p class="empty-description">시스템 활동 로그가 여기에 기록됩니다.</p>
        </div>
    </div>
</template>

<script setup>
// 향후 로그 데이터를 받아서 표시할 수 있습니다
</script>

<style scoped>
.tab-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: #999;
    text-align: center;
    padding: 40px;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5; 
}

.empty-title {
    font-size: 20px;
    font-weight: 700;
    color: #666;
    margin: 0 0 8px 0;
}

.empty-description {
    font-size: 14px;
    color: #999;
    margin: 0;
}
</style>