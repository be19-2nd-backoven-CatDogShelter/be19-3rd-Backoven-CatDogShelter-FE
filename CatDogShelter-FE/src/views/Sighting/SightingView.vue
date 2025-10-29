<template>
  <main class="sighting-page">
    <div class="sighting-inner">
      <!-- ===== 타이틀 영역 ===== -->
      <header class="page-head">
        <h1 class="page-title">목격 제보</h1>
        <p class="page-desc">길 잃은 반려동물을 목격하셨나요? 제보해주세요</p>
      </header>

      <!-- ===== 상단 검색바: 검색 기준 드롭다운 + 인풋 ===== -->
      <section class="top-search-bar">
        <div class="top-search-row">
          <!-- 검색 기준 드롭다운 -->
          <select
            v-model="searchField"
            class="search-field-select"
          >
            <option value="title">제목</option>
            <option value="comment">댓글</option>
            <option value="writer">작성자</option>
          </select>

          <!-- 검색 인풋 -->
          <div class="top-search-input-wrap">
            <img class="search-icon" :src="searchIcon" alt="검색 아이콘" />
            <input
              id="searchKeyword"
              v-model.trim="filters.keyword"
              type="text"
              class="top-search-input"
              :placeholder="placeholderByField"
              @keyup.enter="fetchPosts(1)"
            />
          </div>
        </div>
      </section>

      <!-- ===== 필터 영역 ===== -->
      <section class="filter-shell">
        <div class="filter-bar">
          <!-- 필터 헤더 라인 -->
          <div class="filter-head">
            <button
              class="filter-toggle"
              type="button"
              @click="filterOpen = !filterOpen"
            >
              <img class="filter-icon" :src="searchIcon" alt="검색 아이콘" />
              <span class="filter-text">필터</span>
              <span class="arrow" :class="{ open: filterOpen }">⌄</span>
            </button>

            <button class="report-btn" @click="onReportSighting">
              <span class="report-icon">📝</span>
              <span>목격 제보하기</span>
            </button>
          </div>

          <!-- 필터 바디 -->
          <transition name="fade">
            <div v-if="filterOpen" class="filter-body">
              <!-- 인라인 필터들 -->
              <div class="filter-row">
                <!-- 동물 종류 -->
                <div class="filter-group">
                  <label class="filter-label">동물 종류</label>
                  <select v-model="filters.animalType" class="chip-select">
                    <option value="">전체</option>
                    <option value="CAT">고양이</option>
                    <option value="DOG">강아지</option>
                    <option value="ETC">기타</option>
                  </select>
                </div>

                <!-- 시군구 코드 -->
                <div class="filter-group wide">
                  <label class="filter-label">시군구</label>
                  <select v-model="filters.sigunguCode" class="chip-select">
                    <option value="">전체</option>
                    <option 
                      v-for="g in sigunguList" 
                      :key="g.sigungu_id" 
                      :value="g.sigungu_id"
                    >
                      {{ g.sigungu_name }}
                    </option>
                  </select>
                </div>

                <!-- 품종 -->
                <div class="filter-group wide">
                  <label class="filter-label">품종</label>
                  <input
                    v-model="filters.breed"
                    class="chip-input"
                    type="text"
                    placeholder="품종을 입력해주세요"
                  />
                </div>

                <!-- 색상 -->
                <div class="filter-group wide">
                  <label class="filter-label">색상</label>
                  <input
                    v-model="filters.color"
                    class="chip-input"
                    type="text"
                    placeholder="색상을 입력해주세요"
                  />
                </div>
              </div>

              <!-- 검색 버튼 라인 -->
              <div class="filter-search-row">
                <button class="filter-search-btn" @click="fetchPosts(1)">
                  검색
                </button>
              </div>
            </div>
          </transition>
        </div>
      </section>

      <!-- ===== 리스트 상단 요약 ===== -->
      <section class="list-head-row">
        <div class="list-left">
          <span class="count-text">총 {{ totalCount }}개의 게시글</span>
          <span class="divider">|</span>
          <label class="order-label">
            정렬 조건
            <select
              v-model="filters.order"
              class="order-select"
              @change="fetchPosts(1)"
            >
              <option value="0">최신순</option>
              <option value="1">최신역순</option>
              <option value="2">조회순</option>
              <option value="3">조회역순</option>
              <option value="4">추천순</option>
              <option value="5">추천역순</option>
            </select>
          </label>
        </div>
      </section>

      <!-- ===== 게시글 리스트 ===== -->
      <section class="post-list">
        <article
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          @click="goDetail(post.id)"
        >
          <!-- 왼쪽: 썸네일 -->
          <div class="thumb-wrap">
            <img
              class="thumb-img"
              :src="post.thumbnailUrl || defaultThumb"
              alt=""
            />
          </div>

          <!-- 가운데: 본문 -->
          <div class="post-main">
            <!-- 뱃지들 -->
            <div class="badge-row">
              <span class="type-badge">
                {{ post.animalTypeLabel || '고양이' }}
              </span>
            </div>

            <!-- 제목 -->
            <h2 class="post-title">{{ post.title }}</h2>

            <!-- 상세정보 -->
            <ul class="info-grid">
              <li>
                <span class="info-label">품종 :</span>
                <span class="info-value">{{ post.breed || '-' }}</span>
              </li>
              <li>
                <span class="info-label">색상 :</span>
                <span class="info-value">{{ post.color || '-' }}</span>
              </li>
              <li class="info-wide">
                <span class="info-label">목격 장소 :</span>
                <span class="info-value">{{ post.sightedPlace || '-' }}</span>
              </li>
              <li>
                <span class="info-label">목격 일시 :</span>
                <span class="info-value">{{ post.sightedAt || '-' }}</span>
              </li>
              <li>
                <span class="info-label">지역 :</span>
                <span class="info-value">{{ formatAddress(post.address) }}</span>
              </li>
            </ul>
          </div>

          <!-- 오른쪽: 메타 -->
          <aside class="post-meta">
            <div class="meta-top">
              <div class="meta-row">
                <span class="meta-label">작성일 :</span>
                <span class="meta-value">{{ post.createdAt }}</span>
              </div>

              <div class="meta-stats">
                <span class="stat-item">
                  <span class="dot">●</span>
                  <span class="stat-num">{{ post.view }}</span>
                </span>
                <span class="stat-item">
                  <span class="heart">♡</span>
                  <span class="stat-num">{{ post.likeCount }}</span>
                </span>
              </div>
            </div>

            <div class="meta-writer">
              <div class="writer-role-badge">
                {{ post.writer.ratingName || '일반회원' }}
              </div>
              <div class="writer-name">작성자 : {{ post.writer.name || '이지윤' }}</div>
            </div>
          </aside>
        </article>

        <div v-if="posts.length === 0" class="empty">
          게시글이 없습니다.
        </div>
      </section>

      <!-- ===== 페이지네이션 ===== -->
      <nav class="pagination-wrap" aria-label="페이지네이션">
        <button
          class="page-btn"
          :disabled="page === 1"
          @click="fetchPosts(page - 1)"
        >
          이전
        </button>

        <button
          v-for="p in pageNumbers"
          :key="p"
          class="page-num"
          :class="{ active: p === page }"
          @click="fetchPosts(p)"
        >
          {{ p }}
        </button>

        <button
          class="page-btn"
          :disabled="page === totalPages"
          @click="fetchPosts(page + 1)"
        >
          다음
        </button>
      </nav>
    </div>
  </main>
</template>

<script>
import searchIcon from '@/assets/돋보기아이콘.svg'
  export default {
  name: 'SightingListView',

  data() {
    return {
      searchIcon,
      filterOpen: false,

      // 목록
      posts: [],
      totalCount: 0,

      // 페이지 정보
      page: 1,
      pageSize: 10,
      totalPages: 1,

      // 검색 기준 (제목 / 댓글 / 작성자)
      searchField: 'title',

      // 기본 썸네일
      defaultThumb: 'https://placekitten.com/200/200',

      // 필터 값
      filters: {
        keyword: '',
        animalType: '',
        sigunguCode: '',
        breed: '',
        color: '',
        order: '0', // 기본값: 최신순
      },
          // 시군구 하드코딩 데이터
      sigunguList: [
        { sigungu_id: 1, sigungu_name: '종로구' },
        { sigungu_id: 2, sigungu_name: '중구' },
        { sigungu_id: 3, sigungu_name: '용산구' },
        { sigungu_id: 4, sigungu_name: '성동구' },
        { sigungu_id: 5, sigungu_name: '광진구' },
        { sigungu_id: 6, sigungu_name: '동대문구' },
        { sigungu_id: 7, sigungu_name: '중랑구' },
        { sigungu_id: 8, sigungu_name: '성북구' },
        { sigungu_id: 9, sigungu_name: '강북구' },
        { sigungu_id: 10, sigungu_name: '도봉구' },
        { sigungu_id: 11, sigungu_name: '중구' },
        { sigungu_id: 12, sigungu_name: '서구' },
        { sigungu_id: 13, sigungu_name: '동구' },
        { sigungu_id: 14, sigungu_name: '영도구' },
        { sigungu_id: 15, sigungu_name: '부산진구' },
        { sigungu_id: 16, sigungu_name: '중구' },
        { sigungu_id: 17, sigungu_name: '동구' },
        { sigungu_id: 18, sigungu_name: '서구' },
        { sigungu_id: 19, sigungu_name: '중구' },
        { sigungu_id: 20, sigungu_name: '동구' },
        { sigungu_id: 21, sigungu_name: '남구' },
        { sigungu_id: 22, sigungu_name: '동구' },
        { sigungu_id: 23, sigungu_name: '동구' },
        { sigungu_id: 24, sigungu_name: '중구' },
        { sigungu_id: 25, sigungu_name: '수원시' },
        { sigungu_id: 26, sigungu_name: '수원시 장안구' },
        { sigungu_id: 27, sigungu_name: '수원시 권선구' },
        { sigungu_id: 28, sigungu_name: '춘천시' },
        { sigungu_id: 29, sigungu_name: '청주시' },
      ],
    }
  },

  computed: {
    placeholderByField() {
      if (this.searchField === 'title') return '제목을 입력해주세요'
      if (this.searchField === 'comment') return '댓글 내용을 입력해주세요'
      if (this.searchField === 'writer') return '작성자를 입력해주세요'
      return '검색어를 입력해주세요'
    },

    pageNumbers() {
      const nums = []
      for (let i = 1; i <= this.totalPages; i++) {
        nums.push(i)
      }
      return nums
    },
  },

  mounted() {
    this.fetchPosts(1)
  },

  methods: {
    formatAddress(address) {
      if (!address) return '-'
      return `${address.sidoName} ${address.sigunguName}`
    },

    getImageUrl(file) {
      if (!file || !file.filePath || !file.fileRename) {
        return this.defaultThumb
      }
      
      const imageUrl = `http://localhost:8000/post-service/sighting-post/file/${file.filePath}/${file.fileRename}`
      console.log('Image URL:', imageUrl)
      return imageUrl
    },

    getAnimalTypeLabel(type) {
      const labels = {
        CAT: '고양이',
        DOG: '강아지',
        ETC: '기타'
      }
      return labels[type] || type
    },

    async fetchPosts(targetPage) {
      const pageToLoad = targetPage || this.page

      const params = new URLSearchParams({
        page: pageToLoad,
        size: this.pageSize,
        writer: '',
        title: this.searchField === 'title' ? this.filters.keyword : '',
        content: this.searchField === 'comment' ? this.filters.keyword : '',
        animalType: this.filters.animalType,
        sigunguCode: this.filters.sigunguCode,
        breed: this.filters.breed,
        color: this.filters.color,
        order: this.filters.order,
      })

      // writer 검색
      if (this.searchField === 'writer' && this.filters.keyword) {
        params.set('writer', this.filters.keyword)
      }

      try {
        const res = await fetch(
          `http://localhost:8000/post-service/sighting-post/summary?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `Bearer ${token}` 필요하면 나중에 추가
            },
          }
        )

        if (!res.ok) {
          throw new Error('게시글 로드 실패')
        }

        const data = await res.json()

        // 응답 데이터 가공
        this.posts = (data.content || []).map(post => ({
          ...post,
          thumbnailUrl: this.getImageUrl(post.file),
          animalTypeLabel: this.getAnimalTypeLabel(post.animalType),
        }))

        this.totalCount = data.totalCount || 0
        this.page = data.currentPage || pageToLoad
        this.totalPages = data.totalPages || 1
      } catch (err) {
        console.error('목격 정보 게시글 조회 실패:', err)
        this.posts = []
        this.totalCount = 0
        this.totalPages = 1
      }
    },

    goDetail(postId) {
      this.$router.push(`/sighting/${postId}`)
    },

    onReportSighting() {
      this.$router.push('/sighting/write')
    },
  },
}
</script>

<style scoped>
/* ================= 공통 색상 토큰 ================= */
:root {
  --bg-page: #efe8dd;
  --panel-bg: #ffffff;
  --panel-soft-bg: #fffdf8;
  --line-soft: rgba(0, 0, 0, 0.08);
  --line-card: #d8b4a4;
  --brown-text: #2a1c10;
  --brown-soft: #4a3728;
  --meta-text: #6b5b4a;
  --chip-bg: #f9f4ef;
  --chip-border: rgba(0, 0, 0, 0.08);
  --accent-btn-bg: #2563eb;
  --accent-btn-text: #fff;
  --input-bg: #ffffff;
  --input-border: rgba(0, 0, 0, 0.3);
  --input-placeholder: #9a8e80;
  --pagination-bg: #f5f0e8;
  --pagination-active-bg: #c9b097;
  --pagination-active-text: #fff;
}

/* 페이지 전체 */
.sighting-page {
  background-color: var(--bg-page);
  min-height: 100vh;
  padding: 40px 20px 80px;
  color: var(--brown-text);
  font-family: "Pretendard", "Noto Sans KR", system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    "Noto Sans", sans-serif;
}

.sighting-inner {
  max-width: 1200px;
  margin: 0 auto;
}

/* 타이틀 */
.page-head {
  margin-bottom: 20px;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--brown-text);
  line-height: 1.4;
}
.page-desc {
  font-size: 13px;
  color: var(--meta-text);
  margin-top: 4px;
  line-height: 1.4;
}

/* ===== 상단 검색바 ===== */
.top-search-bar {
  background: #f2efef;
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 12px;
  font-size: 13px;
}
.top-search-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 12px;
  row-gap: 8px;
}

/* 검색 기준 셀렉트 */
.search-field-select {
  background: var(--panel-bg);
  border: 1px solid var(--input-border);
  border-radius: 4px;
  font-size: 13px;
  padding: 8px 10px;
  color: var(--brown-text);
  outline: none;
  min-width: 90px;
}

/* 검색 인풋 */
.top-search-input-wrap {
  position: relative;
  flex: 1;
  max-width: 400px;
  display: flex;
  align-items: center;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 4px;
  padding-left: 28px;
}
.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  pointer-events: none;
}
.top-search-input {
  width: 100%;
  border: 0;
  font-size: 13px;
  padding: 8px 10px;
  color: var(--brown-text);
  background-color: transparent;
  outline: none;
}
.top-search-input::placeholder {
  color: var(--input-placeholder);
}

/* ===== 필터 영역 ===== */
.filter-shell {
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--brown-text);
}

.filter-bar {
  background: var(--panel-bg);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}

.filter-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #faf9f6;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 10px 16px;
  font-size: 13px;
}

.filter-toggle {
  appearance: none;
  background: transparent;
  border: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  line-height: 1;
  color: var(--brown-text);
  font-weight: 500;
  cursor: pointer;
}

.filter-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  pointer-events: none;
}

.filter-text {
  color: var(--brown-text);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.filter-toggle .arrow {
  font-size: 11px;
  line-height: 1;
  color: var(--meta-text);
  transition: transform 0.2s ease;
}
.filter-toggle .arrow.open {
  transform: rotate(180deg);
}

/* 목격 제보하기 버튼 */
.report-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--accent-btn-bg);
  color: var(--accent-btn-text);
  font-size: 12px;
  font-weight: 500;
  padding: 7px 10px;
  border-radius: 4px;
  border: 0;
  cursor: pointer;
}
.report-btn .report-icon {
  font-size: 12px;
  line-height: 1;
}

.filter-body {
  background: #fff;
  padding: 12px 16px 16px;
  font-size: 12px;
  color: var(--brown-text);
}

/* 필터들 한 줄 */
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  row-gap: 12px;
  column-gap: 16px;
  margin-bottom: 16px;
}

/* 개별 묶음 */
.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 110px;
  flex: 0 0 auto;
}
.filter-group.wide {
  min-width: 160px;
  flex: 1 1 180px;
}

/* 상단 작은 라벨 */
.filter-label {
  font-size: 11px;
  color: var(--meta-text);
  line-height: 1.4;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 칩형 컨트롤 */
.chip-select,
.chip-input {
  background: #f8f8f6;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--brown-text);
  padding: 7px 8px;
  outline: none;
  min-width: 70px;
}
.chip-select:focus,
.chip-input:focus {
  border-color: rgba(0,0,0,0.4);
  background: #fff;
}
.chip-input::placeholder {
  color: var(--input-placeholder);
}

/* 검색 버튼 라인 */
.filter-search-row {
  width: 100%;
}
.filter-search-btn {
  width: 100%;
  background: var(--brown-text);
  color: black;
  border: 0.5px solid black;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 12px;
  cursor: pointer;
  line-height: 1.2;
  text-align: center;
  letter-spacing: -0.02em;
  box-shadow: 0 2px 3px rgba(0,0,0,0.08);
}
.filter-search-btn:active {
  transform: translateY(1px);
}

/* 필터 열고닫기 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ===== 리스트 헤더 ===== */
.list-head-row {
  font-size: 12px;
  color: var(--meta-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.list-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.count-text {
  font-size: 12px;
  color: var(--brown-text);
}
.divider {
  color: var(--meta-text);
  font-size: 12px;
}
.order-label {
  font-size: 12px;
  color: var(--meta-text);
  display: flex;
  align-items: center;
  gap: 4px;
}
.order-select {
  background: var(--panel-bg);
  border: 1px solid var(--input-border);
  border-radius: 4px;
  font-size: 12px;
  padding: 4px 6px;
  color: var(--brown-text);
  outline: none;
}

/* ===== 게시글 카드 ===== */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.post-card {
  cursor: pointer;
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 16px;
  background: #ffffff;
  border: 1px solid var(--line-card);
  border-radius: 6px;
  padding: 16px;
  font-size: 13px;
  line-height: 1.4;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* 썸네일 */
.thumb-wrap {
  width: 100%;
  height: 120px;
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 가운데 본문 */
.post-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}
.type-badge {
  background-color: #f5f0e8;
  color: var(--brown-text);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  border-radius: 4px;
  padding: 5px 6px;
  border: 1px solid var(--chip-border);
}
.post-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--brown-text);
  line-height: 1.4;
  margin-bottom: 10px;
  word-break: keep-all;
}

/* 상세 정보 그리드 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 4px;
  font-size: 12px;
  color: var(--brown-text);
}
.info-wide {
  grid-column: 1 / -1;
}
.info-label {
  font-weight: 500;
  margin-right: 4px;
  color: var(--brown-soft);
}
.info-value {
  color: var(--brown-text);
  word-break: keep-all;
}

/* 오른쪽 메타 영역 */
.post-meta {
  font-size: 12px;
  color: var(--meta-text);
  min-width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.meta-top {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  text-align: right;
}
.meta-row {
  white-space: nowrap;
}
.meta-label {
  color: var(--meta-text);
}
.meta-value {
  color: var(--brown-text);
  font-weight: 500;
  margin-left: 4px;
}
.meta-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: var(--meta-text);
}
.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.dot {
  font-size: 10px;
  line-height: 1;
}
.heart {
  font-size: 11px;
  line-height: 1;
  transform: translateY(-1px);
}
.stat-num {
  min-width: 16px;
  text-align: right;
}

.meta-writer {
  text-align: right;
}
.writer-role-badge {
  display: inline-block;
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  border-radius: 4px;
  font-size: 11px;
  padding: 3px 5px;
  font-weight: 500;
  color: var(--brown-text);
  margin-bottom: 4px;
}
.writer-name {
  font-size: 12px;
  color: var(--brown-text);
  font-weight: 500;
  line-height: 1.4;
}

/* 빈 상태 */
.empty {
  background: #ffffff;
  border: 1px solid var(--line-card);
  border-radius: 6px;
  padding: 40px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--meta-text);
}

/* 페이지네이션 */
.pagination-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
}
.page-btn,
.page-num {
  background: var(--pagination-bg);
  border: 1px solid var(--line-card);
  border-radius: 4px;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
  min-width: 36px;
  text-align: center;
  color: var(--brown-text);
}
.page-btn[disabled] {
  opacity: 0.4;
  cursor: default;
}
.page-num.active {
  background: var(--pagination-active-bg);
  border-color: var(--pagination-active-bg);
  color: var(--pagination-active-text);
  font-weight: 600;
}

/* 반응형 */
@media (max-width: 700px) {
  .post-card {
    grid-template-columns: 100px 1fr;
  }

  .post-meta {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 12px;
  }

  .meta-top {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .meta-writer {
    text-align: right;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-group,
  .filter-group.wide {
    width: 100%;
    min-width: 100%;
    flex: 1 1 auto;
  }

  .filter-search-btn {
    font-size: 14px;
    padding: 12px;
  }
}
</style>
