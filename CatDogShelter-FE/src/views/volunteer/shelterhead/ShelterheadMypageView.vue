<template>
  <!-- 자식 라우트가 있으면 해당 컴포넌트 표시 -->
  <router-view v-if="isChildRoute" />
  
  <!-- 기본 마이페이지 표시 -->
  <div v-else class="shelter-mypage">
    <div class="page-header">
      <h1 class="page-title">보호소장 - 마이페이지</h1>
      <p class="page-subtitle">내 정보와 활동 내역을 확인하세요</p>
    </div>

    <div class="mypage-container">
      <!-- 좌측 영역 -->
      <div class="left-section">
        <!-- 프로필 카드 -->
        <div class="profile-card">
          <div class="profile-image">🏠</div>
          <h2 class="shelter-name">{{ shelterInfo.name }}</h2>
          <span class="shelter-badge">보호소장</span>

          <div class="contact-info">
            <div class="info-item"><span class="icon">✉️</span><span>{{ shelterInfo.email }}</span></div>
            <div class="info-item"><span class="icon">📞</span><span>{{ shelterInfo.phone }}</span></div>
            <div class="info-item"><span class="icon">📍</span><span>{{ shelterInfo.location }}</span></div>
            <div class="info-item"><span class="icon">📅</span><span>가입일: {{ shelterInfo.joinDate }}</span></div>
          </div>

          <button class="edit-btn" @click="editProfile">내 정보 수정</button>
          <button class="message-btn" @click="goToMessages">내 쪽지</button>
          <button class="logout-btn" @click="logout">로그아웃</button>
        </div>

        <!-- 신청 내역 -->
        <div class="application-card">
          <div class="card-section-header">
            <h3 class="section-title">신청 내역</h3>
            <button class="section-more-btn" @click="goToApplicants">더보기</button>
          </div>
          <table class="application-table">
            <thead>
              <tr>
                <th>신청자 번호</th>
                <th>신청자</th>
                <th>승인상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="applicant in applicants" :key="applicant.id">
                <td>{{ applicant.id }}</td>
                <td>{{ applicant.name }}</td>
                <td>
                  <span class="status-badge" :class="applicant.statusClass">{{ applicant.status }}</span>
                </td>
                <td>
                  <button
    class="approve-button"
    :class="{ cancel: applicant.status === '승인완료' }"
    @click="openApprove(applicant)"
  >
    {{ applicant.status === '승인완료' ? '승인취소' : '신청승인' }}
  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 승인 모달 -->
        <Approve
          v-if="showModal && selected"
          :applicant="selected"
          @close="closeModal"
          @approve="handleApprove"
        />

        <!-- 봉사시간 관리 -->
        <div class="volunteer-time-card">
          <div class="card-section-header">
            <h3 class="section-title">봉사시간 관리</h3>
            <button class="section-more-btn" @click="goToApplicants">더보기</button>
          </div>
          <table class="time-table">
            <thead>
              <tr>
                <th>신청자</th>
                <th>활동일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in volunteerRecords" :key="record.id">
                <td>{{ record.name }}</td>
                <td>{{ record.date }}</td>
                <td>
                  <span class="status-badge" :class="record.statusClass">{{ record.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 우측 영역 -->
      <div class="right-section">
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.recruitments }}개</div>
              <div class="stat-label">내가 작성한 글</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">❤️</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.likes }}개</div>
              <div class="stat-label">받은 좋아요</div>
            </div>
          </div>
        </div>

        <!-- 내가 작성한 모집글 보기 -->
        <div class="recruitment-section">
          <h3 class="section-title">내가 작성한 모집글 보기</h3>
          <div class="recruitment-list">
            <div v-for="post in myRecruitments" :key="post.id" class="recruitment-item" @click="goToDetail(post.id)">
              <h4 class="recruitment-title">{{ post.title }}</h4>
              <div class="recruitment-meta">
                <span class="meta-item">📅 {{ post.date }}</span>
                <span class="meta-item">📍 {{ post.location }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 내가 작성한 게시글 보기 -->
        <div class="posts-section">
          <h3 class="section-title">내가 작성한 게시글 보기</h3>
          <div class="posts-list">
            <div v-for="post in myPosts" :key="post.id" class="post-item" @click="goToPost(post.id)">
              <h4 class="post-title">{{ post.title }}</h4>
              <div class="post-stats">
                <span class="stat-item">📅 {{ post.date }}</span>
                <span class="stat-item">❤️ {{ post.likes }}</span>
                <span class="stat-item">💬 {{ post.comments }}</span>
                <span class="stat-item">👁️ {{ post.views }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Approve from '@/views/volunteer/shelterhead/Approve.vue'
import db from '@/assets/data/db.json'

const router = useRouter()
const route = useRoute()

const childRouteNames = ['VolunteerRecruitInsert', 'ShelterApplicants']
const isChildRoute = computed(() => childRouteNames.includes(route.name ?? ''))

const mypageData = db?.shelterHead?.mypage ?? {}

const shelterInfo = ref({
  ...(mypageData.shelterInfo ?? {
    name: '',
    email: '',
    phone: '',
    location: '',
    joinDate: ''
  })
})

const stats = ref({
  ...(mypageData.stats ?? { recruitments: 0, likes: 0 })
})

const applicants = ref([...(mypageData.applicants ?? [])])

const volunteerRecords = ref([...(mypageData.volunteerRecords ?? [])])

const myRecruitments = ref([...(mypageData.myRecruitments ?? [])])

const myPosts = ref([...(mypageData.myPosts ?? [])])

const showModal = ref(false)
const selected = ref(null)

const openApprove = (applicant) => {
  selected.value = { ...applicant }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selected.value = null
}

const handleApprove = (updated) => {
  const target = applicants.value.find(a => a.id === updated.id)
  if (target) {
    const isApproved = target.status === '승인완료'
    target.status = isApproved ? '승인대기' : '승인완료'
    target.statusClass = isApproved ? 'pending' : 'approved'
  }
  closeModal()
}

function goToDetail(id) {
  console.log('모집글 상세:', id)
}
function goToPost(id) {
  console.log('게시글 상세:', id)
}
function goToMessages() {
  router.push('/shelter-head/messages')
}
function goToApplicants() {
  router.push('/shelter-head/mypage/applicants')
}
function editProfile() {
  console.log('내 정보 수정')
}
function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    console.log('로그아웃')
  }
}
</script>

<style scoped>
.shelter-mypage {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #faf8f5;
  min-height: 100vh;
}

/* 페이지 헤더 */
.page-header {
  margin-bottom: 40px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #8b7355;
  margin: 0;
}

/* 메인 컨테이너 */
.mypage-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* 좌측 영역 */
.left-section {
  flex: 0 0 380px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 프로필 카드 */
.profile-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.profile-image {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0b762;
  background: #f5f0e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shelter-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0 0 8px 0;
}

.shelter-badge {
  display: inline-block;
  padding: 6px 16px;
  background: #f0e8dc;
  color: #8b7355;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.contact-info {
  text-align: left;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 0.9rem;
  color: #6b5744;
  border-bottom: 1px solid #f5f0e8;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .icon {
  font-size: 1.1rem;
}

.edit-btn,
.message-btn,
.logout-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.edit-btn {
  background: white;
  border: 2px solid #f0b762;
  color: #f0b762;
}

.edit-btn:hover {
  background: #f0b762;
  color: white;
}

.logout-btn {
  background: #f8f6f2;
  border: 1px solid #e0d4c2;
  color: #6b5744;
}

.logout-btn:hover {
  background: #ebe2d4;
}

.message-btn {
  background: #fff3da;
  border: 1px solid #f2c98d;
  color: #a46b1f;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.message-btn:hover {
  background: #ffe6b8;
  border-color: #e7b86c;
}

/* 신청 내역 & 봉사시간 관리 카드 */
.application-card,
.volunteer-time-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3d2f1f;
  margin: 0;
}

.section-more-btn {
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid #e4d7c7;
  background: #faf6ee;
  color: #6b5744;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.section-more-btn:hover {
  background: #f0e5d4;
  border-color: #d8cbbb;
}

.application-table,
.time-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.application-table th,
.application-table td,
.time-table th,
.time-table td {
  padding: 12px 8px;
  text-align: center;
  font-size: 0.9rem;
}

.application-table th,
.time-table th {
  background: #f8f6f2;
  color: #6b5744;
  font-weight: 600;
  border-bottom: 2px solid #e8e0d5;
}

.application-table td,
.time-table td {
  color: #3d2f1f;
  border-bottom: 1px solid #f5f0e8;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background: #d4f4dd;
  color: #2d5016;
}

.view-all-btn {
  width: 100%;
  padding: 10px;
  background: #f8f6f2;
  border: 1px solid #e8e0d5;
  border-radius: 12px;
  color: #6b5744;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.view-all-btn:hover {
  background: #f0e8dc;
  border-color: #d4c4b0;
}

/* 우측 영역 */
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 통계 카드 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f6f2;
  border-radius: 16px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #8b7355;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b5744;
}

/* 모집글 & 게시글 섹션 */
.recruitment-section,
.posts-section {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.recruitment-list,
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recruitment-item,
.post-item {
  padding: 16px;
  background: #fafaf8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #f5f0e8;
}

.recruitment-item:hover,
.post-item:hover {
  background: #f5f0e8;
  transform: translateX(4px);
  border-color: #e8e0d5;
}

.recruitment-title,
.post-title {
  font-size: 1rem;
  font-weight: 600;
  color: #3d2f1f;
  margin: 0 0 8px 0;
}

.recruitment-meta,
.post-stats {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: #8b7355;
}

.meta-item,
.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 반응형 */
@media (max-width: 1024px) {
  .mypage-container {
    flex-direction: column;
  }

  .left-section {
    flex: 1;
    width: 100%;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .shelter-mypage {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .profile-card {
    padding: 24px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}

.approve-button {
  background-color: #d1a55c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}
.approve-button:hover {
  background-color: #c29349;
}
.approve-button.cancel {
  background-color: #f16c6c;
}
.approve-button.cancel:hover {
  background-color: #e05555;
}

</style>
