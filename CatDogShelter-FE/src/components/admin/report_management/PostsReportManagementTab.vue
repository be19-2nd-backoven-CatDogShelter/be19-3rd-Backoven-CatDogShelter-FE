<template>
    <div class="tab-content">
        <!-- <StatCards :stats="stats" />
        
        <div class="content-row">
            <div class="chart-section">
                <h3 class="chart-title">신규 유형별 분포</h3>
                <p class="chart-subtitle">최근 30일 기준</p>
                
                <div class="chart-container">
                    <svg viewBox="0 0 200 200" class="pie-chart">
                        <circle cx="100" cy="100" r="80" fill="none" 
                            stroke="#FF6B6B" stroke-width="40"
                            stroke-dasharray="157 314" stroke-dashoffset="0" />
                        <circle cx="100" cy="100" r="80" fill="none"
                            stroke="#51CF66" stroke-width="40"
                            stroke-dasharray="126 314" stroke-dashoffset="-157" />
                        <circle cx="100" cy="100" r="80" fill="none"
                            stroke="#FFA94D" stroke-width="40"
                            stroke-dasharray="94 314" stroke-dashoffset="-283" />
                        <circle cx="100" cy="100" r="80" fill="none"
                            stroke="#A78BFA" stroke-width="40"
                            stroke-dasharray="38 314" stroke-dashoffset="-377" />
                        <text x="100" y="95" text-anchor="middle" class="chart-center-label">총 신규</text>
                        <text x="100" y="115" text-anchor="middle" class="chart-center-value">2,847건</text>
                    </svg>

                    <div class="chart-legend">
                        <div class="legend-item" v-for="item in chartData" :key="item.label">
                            <span class="legend-dot" :style="{ background: item.color }"></span>
                            <div class="legend-info">
                                <div class="legend-label">{{ item.label }}</div>
                                <div class="legend-value">{{ item.value }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

        <div class="posts-table-section">
            <div class="table-header">
                <h3>신고된 게시글 목록</h3>
                <span class="action-legend">
                    <button class="legend-btn blind">👁️</button> 게시글로 이동
                    <button class="legend-btn blind">🚫</button> 게시글 블라인드
                    <button class="legend-btn approve">✅</button> 게시글 허용
                </span>
            </div>

            <table class="posts-table">
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>카테고리</th>
                        <th>상태</th>
                        <th>작성일</th>
                        <th>조회수</th>
                        <th>신고횟수</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="post in posts" :key="post.id">
                        <td>
                            <div class="post-title">{{ post.title }}</div>
                        </td>
                        <td>{{ post.writer }}</td>
                        <td>
                            <span :class="['category-badge', post.category]">
                                {{ post.category }}
                            </span>
                        </td>
                        <td>
                            <span :class="{'status-badge': true,
                                            'pending': post.status === '0',
                                            'completed': post.status !== '0'}">
                                {{ post.status === '0' ? 'pending' : 'completed' }}
                            </span>
                        </td>
                        <td>{{ post.createdAt }}</td>
                        <td>{{ post.view }}</td>
                        <td>{{ post.reportCount }}</td>
                        <td>
                            <div class="action-buttons">
                                <router-link :to="`/${post.category}/${post.id}`" class="action-btn view" title="보기">👁️</router-link>
                                <!-- 신고 처리 -->
                                <button class="action-btn blind" title="블라인드 처리" @click="handleBlind(post)">🚫</button>                        
                                <!-- 신고 반려 -->
                                <button class="action-btn approve" title="승인" @click="handleApprove(post)">✅</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import StatCards from '@/components/admin/StatCards.vue'

    const stats = ref([
        { label: '전체 신고', icon: '🚩', value: '147', change: '이번달 +23', changeType: 'negative' },
        { label: '권도 대기', icon: '⏰', value: '38', change: '처리 필요', changeType: 'warning' },
        { label: '처리 완료', icon: '✅', value: '109', change: '74% 처리율', changeType: 'success' }
    ])

    const chartData = ref([
        { label: '스팸/도배', value: '1,424건 (50.0%)', color: '#FF6B6B' },
        { label: '허위정보/ 광고된 정보', value: '341건 (12.0%)', color: '#A78BFA' },
        { label: '욕설/비방/혐오발언', value: '852건 (30.0%)', color: '#FFA94D' },
        { label: '기타', value: '230건 (8.0%)', color: '#51CF66' }
    ])

    const posts = reactive([]);

    const fetchPost = async () => {
        const res = await fetch('http://localhost:8000/user-service/user/admin/report-post');
        const data = await res.json();

        posts.length = 0;           // 기존 배열 삭제
        posts.push(...data);        // 새롭게 배열 추가
    }

    onMounted(async () => {
        await fetchPost()

        console.log(`신고 받은 게시글: ${posts}`);
        console.log(posts);
    })

    const handleBlind = async (post) => {
        // TODO: 게시글 블라인드
        await fetch(`http://localhost:8000/user-service/user/admin/post-report/${post.category}/${post.id}/true`,
            {method: 'PUT'}
        )
        post.status = '1';
    }

    const handleApprove = async (post) => {
        // TODO: 게시글 허용
        await fetch(`http://localhost:8000/user-service/user/admin/post-report/${post.category}/${post.id}/false`,
            {method: 'PUT'}
        )
        post.status = '1';
    }
</script>

<style scoped>
    .tab-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .content-row {
        display: grid;
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

    .action-legend {
        font-size: 13px;
        font-weight: 500;
        margin-left: 12px;
        display: inline-flex;
        gap: 8px;
        align-items: center;
    }

    .legend-btn {
        width: 20px;
        height: 20px;
        font-size: 14px;
        border: none;
        background: transparent;
        cursor: default;
        padding: 0;
    }

    /* 게시글 테이블 */
    .posts-table-section {
        background: #FEFDFB;
        border-radius: 12px;
        padding: 24px;
        max-height: 600px;   /* 원하는 높이 */
        overflow-y: auto;    /* 세로 스크롤 가능 */
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
        width: 200px;
    }

    .posts-table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
    }

    .posts-table thead {
        background: #F8F9FA;
    }

    .posts-table th {
        padding: 14px 16px;
        text-align: left;
        font-size: 13px;
        font-weight: 700;
        color: #666;
        border-bottom: 1px solid #E8DCC8;
    }

    .posts-table td {
        padding: 16px;
        border-bottom: 1px solid #F0F0F0;
        font-size: 14px;
        color: #333;
    }

    .posts-table tbody tr:hover {
        background: #FEFDFB;
    }

    .post-title {
        font-weight: 600;
        color: #000;
    }

    .category-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
    }

    .category-badge.post {
        background: #EDE7F6;
        color: #5E35B1;
    }

    .category-badge {
        background: #FFF9C4;
        color: #F57F17;
    }

    .status-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
    }

    .status-badge.pending {
        background: #FFE0B2;
        color: #E65100;
    }

    .status-badge.completed {
        background: #C8E6C9;
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

    .posts-table th,
    .posts-table td {
        padding: 16px;
        border-bottom: 1px solid #F0F0F0;
        font-size: 14px;
        color: #333;
        text-align: center;        /* 중앙 정렬 */
        vertical-align: middle;    /* 세로 중앙 */
    
    }

    @media (max-width: 768px) {
        .chart-container {
            flex-direction: column;
            gap: 30px;
        }

        .posts-table {
            font-size: 12px;
            text-align: center;        /* 중앙 정렬 */
            vertical-align: middle;    /* 세로 중앙 */
        }
    }

</style>