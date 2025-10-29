<template>
  <section class="recruit-section">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">데이터를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-container">
      <p class="error-text">❌ {{ error }}</p>
      <p class="error-hint">JSON Server가 실행 중인지 확인해주세요.</p>
      <button class="retry-btn" @click="fetchVolunteerData">다시 시도</button>
    </div>

    <!-- 데이터 표시 -->
    <div v-else class="recruit-container">
      <!-- 좌측: 모집중인 봉사활동 -->
      <div class="recruit-left">
        <div class="recruit-left-box">
          <div class="section-header">
            <h3 class="section-title">⭐ 모집중인 봉사활동</h3>
            <span class="count-badge">모집중 {{ highlights.length }}개</span>
          </div>

          <div class="card-area" v-if="highlights.length > 0">
            <button class="nav-btn left" @click="prevSlide" v-if="highlights.length > 1">‹</button>

            <div class="card-wrapper">
              <div class="highlight-card" v-if="highlight">
                <div class="file-container">
                  <img class="highlight-img" :src="getImageUrl(highlight.file)" alt="봉사활동 이미지" />
                </div>

                <div class="card-content">
                  <div class="badge-row">
                    <span class="badge companyName">🏠 {{ highlight.companyName }}</span>
                    <span class="badge deadline">✓ {{ highlight.deadline }}</span>
                  </div>
                  <h4 class="card-title">{{ highlight.title }}</h4>
                  <p class="card-content">{{ highlight.content }}</p>

                  <div class="info-grid">
                    <div class="info-row">
                      <div class="info-item">
                        <img class="info-icon" :src="calendarIcon" alt="달력 아이콘" />
                        <div class="info-text">
                          <p class="info-label">활동일</p>
                          <p class="info-value">{{ highlight.startDate }}</p>
                        </div>
                      </div>
                      <div class="info-item">
                        <img class="info-icon" :src="clockIcon" alt="시계 아이콘" />
                        <div class="info-text">
                          <p class="info-label">봉사시간</p>
                          <p class="info-value">{{ highlight.time }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-item">
                        <img class="info-icon" :src="locationIcon" alt="위치 아이콘" />
                        <div class="info-text">
                          <p class="info-label">장소</p>
                          <p class="info-value">{{ highlight.detailAddress }}</p>
                        </div>
                      </div>
                      <div class="info-item">
                        <img class="info-icon" :src="peopleIcon" alt="인원 아이콘" />
                        <div class="info-text">
                          <p class="info-label">모집인원</p>
                          <p class="info-value">{{ highlight.numberOfPeople }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="apply-box" @click.stop>
                    <button class="apply-btn" @click="applyVolunteer(highlight.id)">
                      <span class="heart-icon">♡</span>
                      봉사 신청하기
                    </button>
                    <p class="reg-startDate">등록일: {{ highlight.createdAt }}</p>
                  </div>
                </div>
              </div>
            </div>

            <button class="nav-btn right" @click="nextSlide" v-if="highlights.length > 1">›</button>
          </div>

          <div class="slide-dots" v-if="highlights.length > 1">
            <span
              v-for="(item, i) in highlights"
              :key="i"
              class="dot"
              :class="{ active: i === currentIndex }"
              @click="goToSlide(i)"
            ></span>
          </div>
        </div>
      </div>

      <!-- 우측: 전체 봉사 모집 목록 -->
      <div class="recruit-right">
        <div class="right-header">
          <h3 class="right-title">📋 전체 봉사모집</h3>
          <button v-if="isShelterHead" class="create-recruit-btn" @click="goToRecruitInsert">봉사모집 글 작성하기</button>
        </div>

        <div class="search-filter-area">
          <div class="search-input-wrapper">
            <img class="search-icon" :src="searchIcon" alt="검색 아이콘" />
            <input 
              type="text" 
              placeholder="제목으로 검색..." 
              class="search-input"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <select class="filter-select" v-model="filters.sido" @change="onSidoChange">
                <option value="">시/도</option>
                <option v-for="sido in sidoList" :key="sido.code" :value="sido.name">
                  {{ sido.name }}
                </option>
              </select>
              <select class="filter-select" v-model="filters.sigungu" :disabled="!filters.sido">
                <option value="">시/군/구</option>
                <option v-for="sigungu in sigunguList" :key="sigungu.code" :value="sigungu.name">
                  {{ sigungu.name }}
                </option>
              </select>
              <select class="filter-select" v-model="filters.deadline">
                <option value="">모집상태</option>
                <option value="모집중">모집중</option>
                <option value="마감임박">마감임박</option>
              </select>
              <button class="search-btn" type="button" @click="handleSearch">검색</button>
            </div>
          </div>

          <div class="filter-row">
            <select class="filter-select-small" v-model="filters.sortOrder">
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
        </div>

        <ul class="list">
          <li v-for="(item, i) in paginatedList" :key="i" class="list-item" @click="goToDetail(item.id)">
            <div class="list-item-left">
              <div class="item-badges">
                <span class="item-badge companyName-badge">{{ item.companyName }}</span>
                <span class="item-badge deadline-badge" :class="item.deadlineClass">{{ item.deadline }}</span>
              </div>
              <h4 class="item-title">{{ item.title }}</h4>
            </div>
            <div class="list-item-right">
              <div class="item-info-row item-info-row--top">
                <span class="item-info">
                  <img class="info-icon-small" :src="calendarIcon" alt="달력 아이콘" /> {{ item.startDate }}
                </span>
                <span class="item-info">
                  <img class="info-icon-small" :src="clockIcon" alt="시계 아이콘" /> {{ item.time }}
                </span>
                <span class="item-info">
                  <img class="info-icon-small" :src="peopleIcon" alt="인원 아이콘" /> {{ item.numberOfPeople }}
                </span>
              </div>
              <div class="item-info-row item-info-row--location">
                <span class="item-info item-info--location">
                  <img class="info-icon-small" :src="locationIcon" alt="위치 아이콘" /> {{ item.detailAddress }}
                </span>
              </div>
            </div>
          </li>
        </ul>

        <div class="pagination">
          <button 
            class="page-btn" 
            @click="goToPrevGroup"
            :disabled="!hasPrevGroup"
          >
            ◀
          </button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="page-number"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn" 
            @click="goToNextGroup"
            :disabled="!hasNextGroup"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/views/auth/useAuth'
import regionsData from '@/assets/data/regions.json'
import calendarIcon from '@/assets/달력아이콘.svg'
import clockIcon from '@/assets/시계아이콘.svg'
import locationIcon from '@/assets/위치아이콘.svg'
import peopleIcon from '@/assets/인원아이콘.svg'
import searchIcon from '@/assets/돋보기아이콘.svg'

const router = useRouter()
const { authed } = useAuth()

// ✅ 보호소장 여부 확인
const isShelterHead = computed(() => {
  const role = localStorage.getItem('role')
  return role === 'SHELTER_HEAD'
})

const searchQuery = ref('')
const currentPage = ref(1)
const filters = ref({
  sido: '',
  sigungu: '',
  deadline: '',
  sortOrder: 'latest'  // 기본값: 최신순
})

const appliedQuery = ref('')
const appliedFilters = ref({ ...filters.value })

// 시/도 목록 (parent가 null인 항목들)
const sidoList = computed(() => {
  return regionsData.filter(item => item.parent === null)
})

// 시/군/구 목록 (선택된 시/도의 하위 항목들)
const sigunguList = computed(() => {
  if (!filters.value.sido) return []
  
  // 선택된 시/도의 code 찾기
  const selectedSido = sidoList.value.find(sido => sido.name === filters.value.sido)
  if (!selectedSido) return []
  
  // 해당 시/도의 하위 지역들 반환
  return regionsData.filter(item => item.parent === selectedSido.code)
})

// 시/도 변경 시 시/군/구 초기화
function onSidoChange() {
  filters.value.sigungu = ''
}

// 이미지 경로를 실제 이미지 URL로 변환하는 함수
const getImageUrl = (filePath) => {
  if (!filePath) return ''
  
  // @/assets/volunteer/이미지.jpeg -> /volunteer/이미지.jpeg
  // public 폴더의 이미지를 사용하므로 /volunteer/ 경로로 변환
  const fileName = filePath.split('/').pop() // 파일명만 추출
  return `/volunteer/${fileName}`
}

// 데이터 (빈 배열로 시작)
const baseList = ref([])  // 원본 데이터
const list = ref([])
const loading = ref(true)
const error = ref(null)

// 모집중인 항목만 필터링하고 정렬 (좌측 카드용 - 항상 최신순)
const highlights = computed(() => {
  // 모집중인 항목만 필터링
  const recruitingList = baseList.value.filter(item => 
    item.deadline === '모집중' || item.deadlineClass === 'recruiting'
  )
  
  // 항상 최신순으로 정렬 (우측 필터와 독립적)
  return [...recruitingList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// JSON Server에서 데이터 가져오기
const fetchVolunteerData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('http://localhost:8080/volunteer')
    
    if (!response.ok) {
      throw new Error('데이터를 불러오는데 실패했습니다.')
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      const volunteerData = data[0]
      const allList = volunteerData.list || []
      
      // 원본 데이터 저장 (정렬 없이)
      baseList.value = allList

      // 정렬된 데이터 생성
      const sortedList = [...allList].sort((a, b) => {
        if (filters.value.sortOrder === 'latest') {
          return new Date(b.createdAt) - new Date(a.createdAt)
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt)
        }
      })

      list.value = sortedList
    }
    
    loading.value = false
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = err.message
    loading.value = false
  }
}

// 정렬 옵션 변경 감지
watch(() => filters.value.sortOrder, () => {
  const sortedList = [...baseList.value].sort((a, b) => {
    if (filters.value.sortOrder === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt)
    }
  })
  list.value = sortedList
})

// 카드 슬라이드 관련
const currentIndex = ref(0)
const highlight = computed(() => highlights.value[currentIndex.value])

function nextSlide() {
  if (currentIndex.value < highlights.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

function prevSlide() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = highlights.value.length - 1
  }
}

function goToSlide(index) {
  currentIndex.value = index
}

// 검색 필터 적용
function handleSearch() {
  appliedQuery.value = searchQuery.value
  appliedFilters.value = { ...filters.value }
  currentPage.value = 1 // 검색 시 첫 페이지로 이동
}

// 필터링된 목록
const filteredList = computed(() => {
  let result = list.value

  // 제목 검색
  if (appliedQuery.value) {
    result = result.filter(item => 
      item.title.toLowerCase().includes(appliedQuery.value.toLowerCase())
    )
  }

  // 시/도 필터
  if (appliedFilters.value.sido) {
    result = result.filter(item => item.sido === appliedFilters.value.sido)
  }

  // 시/군/구 필터
  if (appliedFilters.value.sigungu) {
    result = result.filter(item => item.sigungu === appliedFilters.value.sigungu)
  }

  // 모집상태 필터
  if (appliedFilters.value.deadline) {
    result = result.filter(item => item.deadline === appliedFilters.value.deadline)
  }

  return result
})

// 페이지네이션
const itemsPerPage = 8
const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage))

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredList.value.slice(start, end)
})

// 페이지 그룹 계산
const pagesPerGroup = 10
const currentGroup = computed(() => Math.floor((currentPage.value - 1) / pagesPerGroup))
const totalGroups = computed(() => Math.ceil(totalPages.value / pagesPerGroup))

const visiblePages = computed(() => {
  const start = currentGroup.value * pagesPerGroup + 1
  const end = Math.min(start + pagesPerGroup - 1, totalPages.value)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const hasPrevGroup = computed(() => currentGroup.value > 0)
const hasNextGroup = computed(() => currentGroup.value < totalGroups.value - 1)

function goToPage(page) {
  currentPage.value = page
}

function goToPrevGroup() {
  if (hasPrevGroup.value) {
    currentPage.value = currentGroup.value * pagesPerGroup
  }
}

function goToNextGroup() {
  if (hasNextGroup.value) {
    currentPage.value = (currentGroup.value + 1) * pagesPerGroup + 1
  }
}

// 상세 페이지로 이동
function goToDetail(id) {
  router.push({ name: 'VolunteerDetail', params: { id } })
}

// 봉사모집 작성 페이지로 이동
function goToRecruitInsert() {
  router.push({ name: 'VolunteerRecruitInsert' })
}

// 봉사 신청 (추후 구현)
function applyVolunteer(id) {
  alert(`봉사 신청 기능은 추후 구현 예정입니다. (ID: ${id})`)
}

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  fetchVolunteerData()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.recruit-section {
  background: transparent;
  padding: 0;
}

.recruit-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  align-items: stretch;
}

/* ===== 좌측 영역 ===== */
.recruit-left {
  flex: 1;
  max-width: 600px;
  display: flex;
}

.recruit-left-box {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 섹션 헤더 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f0e8;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #5c4a35;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-badge {
  background: #e8e0d5;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #6b5744;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 카드 영역 */
.card-area {
  position: relative;
  margin-bottom: 20px;
}

.card-wrapper {
  width: 100%;
}

.highlight-card {
  background: linear-gradient(135deg, #f9e9c8 0%, #f4d9a6 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  padding: 16px;
}

.highlight-card:hover {
  transform: none;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.file-container {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  border-radius: 16px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.highlight-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 카드 콘텐츠 */
.card-content {
  padding: 0 4px 4px 4px;
}

.badge-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.badge.companyName {
  background: #f5f0e8;
  color: #5c4a35;
}

.badge.deadline {
  background: #d4f4dd;
  color: #2d5016;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-content {
  font-size: 0.9rem;
  color: #6b5744;
  line-height: 1.6;
  margin-bottom: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* 정보 그리드 */
.info-grid {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  gap: 12px;
}

.info-row:not(:last-child) {
  margin-bottom: 12px;
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 10px;
}

.info-icon,
.info-icon-small {
  display: inline-block;
  object-fit: contain;
}

.info-icon {
  width: 20px;
  height: 20px;
}

.info-text {
  flex: 1;
}

.info-label {
  font-size: 0.75rem;
  color: #8b7355;
  margin: 0 0 2px 0;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0;
}

/* 로딩 컨테이너 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f0e8dc;
  border-top: 5px solid #f0b762;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  color: #6b5744;
  font-weight: 600;
}

/* 에러 컨테이너 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 15px;
}

.error-text {
  font-size: 1.2rem;
  color: #d32f2f;
  font-weight: 600;
  margin: 0;
}

.error-hint {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

.retry-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.4);
}

/* 신청 박스 */
.apply-box {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 신청 버튼 */
.apply-btn {
  width: 100%;
  background: linear-gradient(135deg, #f0b762 0%, #e8a54d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(240, 183, 98, 0.3);
  transition: all 0.3s;
  margin-bottom: 12px;
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.4);
}

.heart-icon {
  font-size: 1.2rem;
}

.reg-startDate {
  text-align: center;
  font-size: 0.8rem;
  color: #8b7355;
  margin: 0;
}

/* 네비게이션 버튼 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #8b7355;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  z-index: 10;
}

.nav-btn:hover {
  background: #f0b762;
  color: white;
}

.nav-btn.left {
  left: -20px;
}

.nav-btn.right {
  right: -20px;
}

/* 슬라이드 점 */
.slide-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d4c4b0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #8b7355;
  width: 32px;
  border-radius: 5px;
}

/* ===== 우측 영역 ===== */
.recruit-right {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.right-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f0e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.right-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #5c4a35;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}


.create-recruit-btn {
  padding: 10px 18px;
  background: linear-gradient(135deg, #f0b762 0%, #e7a150 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(240, 183, 98, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.create-recruit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 183, 98, 0.35);
}

/* 검색 및 필터 영역 */
.search-filter-area {
  background: #f8f6f2;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s;
  background: white;
}

.search-input:focus {
  border-color: #f0b762;
  box-shadow: 0 0 0 3px rgba(240, 183, 98, 0.1);
}

/* 필터 행 */
.filter-row {
  margin-bottom: 12px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #6b5744;
  background: white;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: #d4c4b0;
}

.filter-select-small {
  padding: 10px 16px;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #6b5744;
  background: white;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
  min-width: 120px;
}

.filter-select-small:hover {
  border-color: #d4c4b0;
}

.search-btn {
  padding: 12px 24px;
  background: #f0b762;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-btn:hover {
  background: #e8a54d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 183, 98, 0.3);
}

/* 리스트 */
.list {
  list-style: none;
  padding: 0;
  margin: 0 0 auto 0;
  flex: 1;
}

.list-item {
  padding: 16px;
  border-bottom: 1px solid #f0e8dc;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.list-item:hover {
  background: #fafaf8;
  border-radius: 12px;
}

.list-item-left {
  flex: 1;
  min-width: 0;
}

.list-item-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.item-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.item-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* 모집 목록에 나타나는 보호소이름 뱃지 */
.companyName-badge {
  background: #f5f0e8;
  color: #6b5744;
}

/* 모집 상태 뱃지  */
.deadline-badge {
  color: white;
}

.deadline-badge.recruiting {
  background: #90ee90;
  color: #2d5016;
}

.deadline-badge.closing {
  background: #ffa500;
  color: white;
}

/* 모집 목록에 나타나는 제목 */
.item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  width: 100%;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6b5744;
  white-space: nowrap;
}

.item-info-row--top {
  justify-content: flex-start;
}

.item-info-row--top .item-info {
  flex: 0 1 auto;
}

.item-info-row--location {
  margin-top: 6px;
}

.item-info--location {
  flex: 1 1 100%;
  white-space: normal;
}

.info-icon-small {
  width: 16px;
  height: 16px;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0e8dc;
}

.page-btn,
.page-number {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e8e0d5;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #6b5744;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-number.active {
  background: #f0b762;
  border-color: #f0b762;
  color: white;
  font-weight: 600;
}

.page-btn:hover:not(:disabled),
.page-number:hover {
  border-color: #f0b762;
  color: #f0b762;
}

.page-number.active:hover {
  color: white;
}

/* 반응형 */
@media (max-width: 1024px) {
  .recruit-container {
    flex-direction: column;
  }

  .recruit-left {
    max-width: 100%;
  }

  .nav-btn.left {
    left: 10px;
  }

  .nav-btn.right {
    right: 10px;
  }
}

@media (max-width: 640px) {
  .right-header {
    flex-direction: column;
    align-items: stretch;
  }

  .create-recruit-btn {
    width: 100%;
    justify-content: center;
  }

  .recruit-container {
    gap: 20px;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .filter-select {
    flex: 1 1 45%;
  }

  .search-btn {
    flex: 1 1 100%;
  }

  .info-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style>