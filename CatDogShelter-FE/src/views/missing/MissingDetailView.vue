<template>
  <main class="detail-page">
    <div class="detail-inner">
      <!-- 상단 돌아가기 -->
      <button class="back-line" @click="goList">← 목록으로 돌아가기</button>

      <section class="post-card">
        <!-- 카드 헤더 영역 -->
        <header class="post-head">
          <div class="head-left">
            <!-- 뱃지들 -->
            <div class="badge-row">
              <span class="type-badge">{{ displayAnimalType }}</span>
              <span class="breed-badge">{{ post.breed || '정보 없음' }}</span>
              <span
                class="breed-badge"
                :class="post.status === false ? 'state-missing' : 'state-found'"
              >
                {{ post.status === false ? '실종중' : '발견' }}
              </span>
            </div>

            <h1 class="post-title">{{ post.title || '(제목 없음)' }}</h1>

            <div class="meta-line">
              <span class="author">👤 {{ post.userName || '-' }}</span>
              <span class="dot">·</span>
              <span class="date">{{ post.createdAt || '-' }}</span>
              <span class="dot">·</span>
              <span class="view">조회 {{ post.view ?? 0 }}</span>
            </div>
          </div>

          <div class="head-right">
            <button class="report-btn">🚨 게시글 신고</button>
          </div>
        </header>

        <!-- 상단 하단 경계선 -->
        <div class="divider-line"></div>

        <!-- 대표 이미지 + (원래 슬라이더 자리) + 동물 정보 박스 -->
        <section class="media-and-info">
          <!-- 대표 이미지 영역 -->
          <div class="main-image-wrap">
            <img
              class="main-image"
              :src="mainImageUrl"
              alt="animal main"
            />
          </div>

          <!-- 썸네일들: 지금은 단일 이미지라 리스트 대신 단일만 보여주자 -->
          <div class="thumb-row">
            <div class="thumb-box active">
              <img :src="mainImageUrl" alt="thumb" />
            </div>
          </div>

          <!-- 동물 정보 카드 -->
          <aside class="pet-info-card">
            <h2 class="info-head">동물 정보</h2>

            <ul class="info-list">
              <li>
                <span class="info-key">종류</span>
                <span class="info-val">{{ displayAnimalType }}</span>
              </li>
              <li>
                <span class="info-key">품종</span>
                <span class="info-val">{{ post.breed || '-' }}</span>
              </li>
              <li>
                <span class="info-key">색상</span>
                <span class="info-val">{{ post.color || '-' }}</span>
              </li>
              <li>
                <span class="info-key">성별</span>
                <span class="info-val">{{ post.sexText || '-' }}</span>
              </li>
              <li>
                <span class="info-key">나이</span>
                <span class="info-val">{{ post.age || '-' }}</span>
              </li>
              <li>
                <span class="info-key">실종 일시</span>
                <span class="info-val">{{ post.missingDate || '-' }}</span>
              </li>
              <li>
                <span class="info-key">실종 장소</span>
                <span class="info-val">{{ post.missingLocation || '-' }}</span>
              </li>
              <li>
                <span class="info-key">연락처</span>
                <span class="info-val">{{ post.contact || '-' }}</span>
              </li>
              <li>
                <span class="info-key">특징</span>
                <span class="info-val">
                  {{ post.featureDesc || '상세 내용은 본문을 확인해주세요.' }}
                </span>
              </li>
            </ul>
          </aside>
        </section>

        <!-- 본문 설명 -->
        <section class="content-block">
          <p class="content-text">
            {{ post.featureDesc || '내용이 없습니다.' }}
          </p>
        </section>

        <!-- 좋아요 / 공유 -->
        <section class="action-row">
          <button
            class="like-btn"
            :class="{ active: isLiked }"
            @click.stop="toggleLike"
          >
            {{ isLiked ? '💗' : '♡' }}
            좋아요 {{ displayedLikeCount }}
          </button>

          <button class="share-btn" @click.stop="openShareModal">🔗 공유하기</button>

          <div class="stats-right">
            <span class="stat-chip">👁 {{ post.view ?? 0 }}</span>
            <span class="stat-chip">♡ {{ displayedLikeCount }}</span>
          </div>
        </section>
      </section>

      <!-- 댓글 영역 -->
      <section class="comment-card">
        <header class="comment-head">
          <h2 class="comment-title">
            댓글 <span class="count">{{ comments.length }}</span>
          </h2>
        </header>

        <!-- 댓글 리스트 -->
        <ul class="comment-list">
          <li
            v-for="c in comments"
            :key="c.id"
            class="comment-item"
          >
            <div class="comment-meta">
              <span class="comment-writer">{{ c.userName || '이지윤' }}</span>
              <span class="comment-date">{{ c.createdAt || '' }}</span>
            </div>
            <p class="comment-text">{{ c.text || '' }}</p>
          </li>

          <li v-if="comments.length === 0" class="comment-empty">
            아직 댓글이 없습니다.
          </li>
        </ul>

        <!-- 댓글 입력창 -->
        <div class="comment-write">
          <textarea
            v-model="newComment"
            class="comment-input"
            placeholder="댓글을 남겨주세요."
          />
          <button class="comment-send-btn" @click="sendComment">등록</button>
        </div>
      </section>
    </div>

    <!-- ===== 공유 모달 오버레이 ===== -->
    <div v-if="isShareOpen" class="share-overlay" @click.self="closeShareModal">
      <div class="share-modal">
        <header class="share-header">
          <div class="share-title">댕냥쉘터 게시글 공유하기</div>
          <button class="share-close-btn" @click="closeShareModal">✕</button>
        </header>

        <p class="share-desc">
          가족을 기다리는 댕냥이의 이야기를 함께 퍼뜨려주세요.
        </p>

        <div class="share-link-row">
          <input
            class="share-link-input"
            type="text"
            :value="shareUrl"
            readonly
          />
          <button class="share-copy-icon-btn" @click="copyLink">
            📋
          </button>
        </div>

        <button class="share-copy-main-btn" @click="copyLink">
          링크 복사
        </button>

        <button class="share-cancel-btn" @click="closeShareModal">
          취소
        </button>

        <p v-if="copyDone" class="copy-done-msg">복사 완료! 🎉</p>
      </div>
    </div>
    <!-- ===== /공유 모달 오버레이 ===== -->
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * 라우터 파라미터
 * 리스트 쪽에서 this.$router.push({
 *   name: 'missing-detail',
 *   params: { postId: id }
 * })
 */
const route = useRoute()
const router = useRouter()
const postId = route.params.postId

// 상세 게시글 데이터 (json-server missingPosts의 단일 row 형태 그대로)
const post = reactive({
  id: null,
  status: false,
  title: '',
  createdAt: '',
  view: 0,
  likeCount: 0,
  userName: '',
  userRating: '',
  thumbnailUrl: '',

  animalTypeLabel: '',
  breed: '',
  color: '',
  age: '',
  sexText: '',
  featureDesc: '',
  missingLocation: '',
  contact: '',
  missingDate: '',
})

// 댓글 리스트 (지금은 아직 dummy)
const comments = ref([])

// 새 댓글
const newComment = ref('')

/* =====================
   좋아요 상태 / 로직
===================== */
const isLiked = ref(false)

const displayedLikeCount = computed(() => {
  const base = post.likeCount ?? 0
  return isLiked.value ? base + 1 : base
})

function toggleLike() {
  isLiked.value = !isLiked.value

  // 서버 동기화 하고 싶으면 여기서 PATCH 날리면 됨
  // fetch(`http://localhost:8080/missingPosts/${post.id}`, {...})
}

/* =====================
   공유 모달 상태 / 로직
===================== */
const isShareOpen = ref(false)
const copyDone = ref(false)

// 공유할 URL. 라우팅 방식에 맞게 구성해 줄 거야.
const shareUrl = ref(window.location.origin + window.location.pathname)

function openShareModal() {
  copyDone.value = false
  // 해시 라우터(#) 쓰고 있다면 이렇게:
  shareUrl.value = `${window.location.origin}/missing/${post.id ?? postId}`
  isShareOpen.value = true
}

function closeShareModal() {
  isShareOpen.value = false
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copyDone.value = true
  } catch (err) {
    console.error('클립보드 복사 실패:', err)
    copyDone.value = false
  }
}

/* =====================
   이미지 / 라벨
===================== */
// 없을 때 보여줄 기본 썸네일
const fallbackImageUrl = '/uploads/lostcat1.jpeg'

const mainImageUrl = computed(() => {
  if (post.thumbnailUrl && post.thumbnailUrl.trim() !== '') {
    return post.thumbnailUrl
  }
  return fallbackImageUrl
})

const displayAnimalType = computed(() => {
  // json-server 데이터에선 animalTypeLabel 자체가 "강아지" / "고양이"
  return post.animalTypeLabel || '기타'
})

/* =====================
   네비 / 댓글 / 데이터 로딩
===================== */
function goList() {
  router.push({ name: 'missing' })
}

function sendComment() {
  if (!newComment.value.trim()) return
  alert('아직 댓글 등록 API 안 붙였어. 나중에 연동하면 돼!')
  newComment.value = ''
}

// 상세 데이터 가져오기
// 지금은 /missingPosts/:id 가 404라서 전체 불러와서 찾아온다
async function fetchDetail() {
  try {
    const res = await fetch('http://localhost:8080/missingPosts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      console.error('목록 조회 실패', res.status)
      return
    }

    const list = await res.json()
    const data = list.find(item => String(item.id) === String(postId))

    if (!data) {
      console.error('해당 ID 게시글 없음:', postId)
      return
    }

    // reactive post 채우기
    post.id = data.id
    post.status = data.status
    post.title = data.title || ''
    post.createdAt = data.createdAt || ''
    post.view = data.view ?? 0
    post.likeCount = data.likeCount ?? 0
    post.userName = data.userName || ''
    post.userRating = data.userRating || ''

    post.thumbnailUrl = data.thumbnailUrl || ''

    post.animalTypeLabel = data.animalTypeLabel || ''
    post.breed = data.breed || ''
    post.color = data.color || ''
    post.age = data.age || ''
    post.sexText = data.sexText || ''
    post.featureDesc = data.featureDesc || ''
    post.missingLocation = data.missingLocation || ''
    post.contact = data.contact || ''
    post.missingDate = data.missingDate || ''

    // 좋아요 초기화
    isLiked.value = false

    // 공유 URL도 post.id 기준으로 최신화
    shareUrl.value = `${window.location.origin}/#/missing/${post.id}`
  } catch (err) {
    console.error('상세 조회 에러:', err)
  }
}

// 댓글 데이터 (dummy)
async function fetchComments() {
  try {
    comments.value = []
  } catch (err) {
    console.error('댓글 조회 에러:', err)
    comments.value = []
  }
}

onMounted(() => {
  fetchDetail()
  fetchComments()
})
</script>

<style scoped>
.detail-page {
  background-color: #efe8dd;
  min-height: 100vh;
  padding: 24px 16px 80px;
  font-family: "Pretendard", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2a1c10;
  display: flex;
  justify-content: center;
}

.detail-inner {
  width: 100%;
  max-width: 1100px;
}

/* 돌아가기 */
.back-line {
  background: none;
  border: none;
  font-size: 13px;
  line-height: 1.4;
  color: #2a1c10;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

/* 메인 카드 */
.post-card {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 16px 32px rgba(0,0,0,0.06);
  padding: 16px 20px 24px;
  margin-bottom: 24px;
}

/* 헤더 영역 */
.post-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
  row-gap: 12px;
}
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.type-badge,
.breed-badge {
  background-color: #f5f0e8;
  border: 1px solid rgba(0,0,0,0.07);
  color: #6e5336;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  border-radius: 4px;
  padding: 4px 6px;
}

.state-missing {
  background-color: #d53016;
  color: #fff;
  border-color: #d53016;
}

.state-found {
  background-color: #4caf50;
  color: #fff;
  border-color: #4caf50;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #2a1c10;
  line-height: 1.4;
  margin: 0 0 8px;
  word-break: keep-all;
}
.meta-line {
  font-size: 12px;
  color: rgba(0,0,0,0.6);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  line-height: 1.4;
}
.dot {
  color: rgba(0,0,0,0.3);
}
.head-right {
  flex-shrink: 0;
}
.report-btn {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.3;
  padding: 6px 8px;
  color: #2a1c10;
  cursor: pointer;
}

/* 구분선 */
.divider-line {
  border-top: 1px solid rgba(0,0,0,0.07);
  margin: 16px 0 20px;
}

/* 미디어 + 정보 */
.media-and-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 대표 이미지 */
.main-image-wrap {
  width: 100%;
  max-width: 480px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.1);
  background: #fff;
  margin: 0 auto 16px;
}
.main-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  background: #fdfdfd;
}

/* 썸네일 줄 */
.thumb-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 20px;
  flex-wrap: nowrap;
}
.thumb-box {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  border: 2px solid #8a6a48;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
  cursor: pointer;
}
.thumb-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 동물 정보 카드 */
.pet-info-card {
  width: 100%;
  max-width: 480px;
  background-color: #fffdf8;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 6px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.03);
  padding: 16px;
  margin: 0 auto 28px;
  color: #2a1c10;
}
.info-head {
  font-size: 14px;
  font-weight: 600;
  color: #6e5336;
  line-height: 1.4;
  margin-bottom: 12px;
}
.info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}
.info-list li {
  display: grid;
  grid-template-columns: 70px 1fr;
  row-gap: 4px;
  column-gap: 8px;
  margin-bottom: 6px;
}
.info-key {
  color: rgba(0,0,0,0.6);
}
.info-val {
  color: #2a1c10;
  word-break: keep-all;
}

/* 본문 */
.content-block {
  max-width: 680px;
  margin: 0 auto 24px;
  font-size: 14px;
  line-height: 1.6;
  color: #2a1c10;
  white-space: pre-line;
  text-align: center;
}
.content-text {
  word-break: keep-all;
}

/* 좋아요/공유 */
.action-row {
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
  column-gap: 8px;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border-top: 1px solid rgba(0,0,0,0.07);
  padding-top: 16px;
}
.like-btn,
.share-btn {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  padding: 8px 12px;
  line-height: 1.3;
  font-size: 13px;
  cursor: pointer;
  color: #2a1c10;
}
.like-btn.active {
  border-color: #d53016;
  color: #d53016;
  font-weight: 600;
}
.stats-right {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(0,0,0,0.6);
  font-size: 12px;
}
.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 댓글 카드 */
.comment-card {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 16px 32px rgba(0,0,0,0.06);
  padding: 16px 20px 24px;
}
.comment-head {
  margin-bottom: 16px;
}
.comment-title {
  font-size: 14px;
  font-weight: 600;
  color: #2a1c10;
  line-height: 1.4;
}
.count {
  color: #8a6a48;
  margin-left: 4px;
}

/* 댓글 리스트 */
.comment-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}
.comment-item {
  border-top: 1px solid rgba(0,0,0,0.05);
  padding: 12px 0;
  font-size: 13px;
  line-height: 1.5;
  color: #2a1c10;
}
.comment-item:first-child {
  border-top: 0;
}
.comment-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 4px;
}
.comment-writer {
  font-weight: 600;
  color: #2a1c10;
}
.comment-date {
  color: rgba(0,0,0,0.5);
}
.comment-text {
  white-space: pre-line;
  word-break: keep-all;
}

/* 빈 댓글 */
.comment-empty {
  font-size: 13px;
  color: rgba(0,0,0,0.5);
  padding: 16px 0;
  text-align: center;
  border-top: 1px solid rgba(0,0,0,0.05);
}

/* 댓글 입력 */
.comment-write {
  border-top: 1px solid rgba(0,0,0,0.07);
  padding-top: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: flex-start;
}
.comment-input {
  width: 100%;
  min-height: 60px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.15);
  background: #fffdf8;
  font-size: 13px;
  line-height: 1.4;
  padding: 10px;
  outline: none;
  resize: vertical;
  color: #2a1c10;
}
.comment-send-btn {
  background: #f5f0e8;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.3;
  cursor: pointer;
  min-width: 64px;
  font-weight: 500;
  color: #2a1c10;
}

/* ==== 공유 모달 ==== */
.share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
}

.share-modal {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 24px 48px rgba(0,0,0,0.18);
  border: 1px solid rgba(0,0,0,0.07);
  max-width: 360px;
  width: 100%;
  padding: 16px 16px 20px;
  font-family: inherit;
  color: #2a1c10;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.share-title {
  font-size: 16px;
  font-weight: 600;
  color: #2a1c10;
  line-height: 1.4;
}

.share-close-btn {
  background: none;
  border: 0;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  color: rgba(0,0,0,0.6);
  padding: 4px;
}

.share-desc {
  font-size: 13px;
  line-height: 1.4;
  color: rgba(0,0,0,0.6);
  margin-bottom: 12px;
  white-space: pre-line;
}

/* 링크 + 복사아이콘 라인 */
.share-link-row {
  display: flex;
  align-items: stretch;
  background: #fafafa;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.share-link-input {
  flex: 1;
  border: 0;
  background: #fafafa;
  font-size: 13px;
  line-height: 1.4;
  padding: 10px 12px;
  color: #2a1c10;
  font-family: inherit;
  outline: none;
  resize: none;
  min-width: 0;
}

.share-copy-icon-btn {
  background: #ffe8b8;
  border: 0;
  border-left: 1px solid rgba(0,0,0,0.15);
  padding: 0 10px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  min-width: 40px;
  color: #2a1c10;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 메인 복사 버튼 */
.share-copy-main-btn {
  width: 100%;
  background: #e7ca94;
  border: 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: #2a1c10;
  padding: 12px;
  cursor: pointer;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

/* 취소 버튼 */
.share-cancel-btn {
  width: 100%;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.4;
  color: #2a1c10;
  padding: 12px;
  cursor: pointer;
  margin-bottom: 8px;
}

/* 복사 완료 메시지 */
.copy-done-msg {
  font-size: 12px;
  color: #4caf50;
  text-align: center;
  line-height: 1.4;
}

/* 반응형 */
@media (max-width: 768px) {
  .post-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .media-and-info {
    align-items: stretch;
  }

  .main-image-wrap {
    max-width: 100%;
  }

  .pet-info-card {
    max-width: 100%;
  }

  .content-block {
    text-align: left;
  }

  .thumb-row {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
}
</style>
