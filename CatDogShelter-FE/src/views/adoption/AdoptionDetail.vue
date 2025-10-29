<template>
  <div class="page">
    <div class="detail-box">

      <!-- 🔙 뒤로가기 -->
      <button class="back" @click="$router.push('/adoption')">
        ← 목록으로
      </button>

      <!-- 상단 정보 -->
      <div class="top-info">
        <div class="header-row">
          <div class="tag-area">
            <span class="tag type">{{ post.animalType }}</span>
            <span class="tag">{{ post.breed }}</span>
          </div>
          <button class="report-btn" @click="reportPost">📢 게시글 신고</button>
        </div>

        <h2 class="title">{{ post.title }}</h2>

        <div class="meta-row">
          <div class="author-info">
            <span class="icon">👤</span>
            <span class="name">{{ post.writerName }}</span>
            <span class="badge">{{ post.userRating || "보호소장" }}</span>
            <span class="date">{{ formatDate(post.createdAt) }}</span>
          </div>

          <div class="stats">
            <span class="stat">♡ {{ post.recommendCount }}</span>
            <span class="stat">💬 {{ comments.length }}</span>
            <span class="stat">👁 {{ post.view }}</span>
          </div>
        </div>
      </div>

      <!-- 이미지 -->
      <div class="image-section" v-if="post.files && post.files.length">
        <swiper
          :navigation="true"
          :pagination="{ clickable: true }"
          class="detail-swiper"
        >
            <swiper-slide
              v-for="file in post.files"
              :key="file.id"
            >
              <img
                :src="getFileUrl(file)"
                alt="post image"
                class="post-image"
              />
            </swiper-slide>
        </swiper>

        <!-- ▶ 페이지 번호 표시 -->
        <div class="page-indicator">
          {{ activeIndex + 1 }} / {{ post.files.length }}
        </div>
      </div>

      <!-- 🐾 동물 정보 -->
      <section class="animal-info">
        <h3 class="section-title">동물 정보</h3>
        
        <div class="info-layout">
          <div class="info-col">
            <div class="info-row">
              <span class="label">종류:</span>
              <span class="value">{{ post.animalType }}</span>
            </div>
            <div class="info-row">
              <span class="label">나이:</span>
              <span class="value">{{ post.age }}살</span>
            </div>
            <div class="info-row">
              <span class="label">색상:</span>
              <span class="value">{{ post.color }}</span>
            </div>
          </div>

          <div class="info-col">
            <div class="info-row">
              <span class="label">품종:</span>
              <span class="value">{{ post.breed }}</span>
            </div>
            <div class="info-row">
              <span class="label">성별:</span>
              <span class="value">{{ post.gender }}</span>
            </div>
            <div class="info-row">
              <span class="label">체중:</span>
              <span class="value">{{ post.weight }}kg</span>
            </div>
          </div>

          <div class="info-col">
            <div class="health-title">건강 정보</div>
            <div class="health-row">
              <span
                class="health-badge"
                :class="{ 'complete': post.vaccination === 'Y', 'incomplete': post.vaccination !== 'Y'}"
              >
                {{ post.vaccination === 'Y' ? '🟢 예방접종 완료' : '🔴 예방접종 미완료' }}
              </span>
            </div>
            <div class="health-row">
              <span
                class="health-badge"
                :class="{ 'complete': post.neutering === 'Y', 'incomplete': post.neutering !== 'Y'}"
              >
                {{ post.neutering === 'Y' ? '🟢 중성화 완료' : '🔴 중성화 미완료' }}
              </span>
            </div>
          </div>
        </div>

        <div class="contact-section">
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span class="contact-label">연락처:</span>
            <span class="contact-value">{{ post.userPhone }}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <span class="contact-label">위치:</span>
            <span class="contact-value">{{ post.sidoName }} {{ post.sigunguName }}</span>
          </div>
        </div>
      </section>

      <!-- 본문 -->
      <div class="content-text">{{ post.content }}</div>

      <!-- ✅ 버튼 (좋아요 토글 + 공유하기 모달) -->
      <div class="action-bar">
        <button 
          class="action-btn like" 
          :class="{ 'liked': isLiked }"
          @click="toggleLike"
        >
          {{ isLiked ? '♥' : '♡' }} 좋아요 {{ likeCount }}
        </button>
        <button class="action-btn share" @click="showShareModal = true">
          🔗 공유하기
        </button>
      </div>

      <!-- 댓글 -->
      <section class="comment-area">
        <h3 class="comment-header">댓글 <span class="comment-count">{{ comments.length }}</span></h3>

        <div v-if="comments.length === 0" class="empty-comment">
          아직 댓글이 없습니다 😢
        </div>

        <div v-for="(c, i) in comments" :key="i" class="comment-item">
          <div class="comment-profile">👤</div>
          <div class="comment-content">
            <div class="comment-author">{{ c.writerName }}</div>
            <div class="comment-time">{{ formatDate(c.displayDate) }}</div>
            <p class="comment-message">{{ c.content }}</p>
              <button class="reply-link" @click="reportComment(c)">🚨 신고하기</button>
          </div>
        </div>

        <div class="comment-input-wrapper">
          <textarea v-model="commentText" class="comment-textarea" placeholder="댓글을 입력하세요"></textarea>
          <button class="submit-btn" @click="postComment">댓글 작성</button>
        </div>
      </section>

    </div>

    <!-- ✅ 공유하기 모달 -->
    <div v-if="showShareModal" class="modal-overlay" @click="showShareModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>댕냥센터 게시글 공유하기</h3>
          <button class="modal-close" @click="showShareModal = false">✕</button>
        </div>
        
        <p class="modal-description">
          가족을 기다리는 댕냥이의 이야기를 함께 퍼뜨려주세요 :-)
        </p>

        <div class="url-box">
          <input 
            type="text" 
            :value="shareUrl" 
            readonly 
            ref="urlInput"
            class="url-input"
          />
          <button class="copy-icon-btn" @click="copyUrl">
            📋
          </button>
        </div>

        <button class="copy-btn" @click="copyUrl">링크 복사</button>
        <button class="cancel-btn" @click="showShareModal = false">취소</button>

        <!-- 복사 완료 알림 -->
        <div v-if="showCopyAlert" class="copy-alert">
          ✅ 링크가 복사되었습니다!
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { openReport } from '@/components/report'

const activeIndex = ref(0);

function onSlideChange(swiper) {
  activeIndex.value = swiper.activeIndex;
}

const route = useRoute();
const post = ref({});
const comments = ref([]);
const commentText = ref('');

// ✅ 좋아요 상태
const isLiked = ref(false);
const likeCount = ref(0);

// ✅ 공유하기 모달
const showShareModal = ref(false);
const showCopyAlert = ref(false);

// ✅ 공유 URL
const shareUrl = computed(() => {
  return `https://catdogshelter.com/adoption-post/${route.params.id}`;
});

onMounted(async () => {
  // If a tempKey is provided (created by the write page), display blob URLs from sessionStorage
  const tempKey = route.query.tempKey
  if (tempKey) {
    try {
      const raw = sessionStorage.getItem(tempKey)
      if (raw) {
        const blobUrls = JSON.parse(raw)
        post.value = post.value || {}
        post.value.files = blobUrls.map((u, i) => ({ id: `blob-${i}`, fileUrl: u, __isBlob: true }))
        comments.value = []
        likeCount.value = 0
        // remove the key so it won't be reused
        sessionStorage.removeItem(tempKey)
      }
    } catch (e) {
      console.warn('failed to load temp images from sessionStorage', e)
    }

    // Try to resolve server URLs as well — if/when available these will replace blob URLs
    resolveAllFileUrls()
    return
  }

  const res = await fetch(`http://localhost:8000/post-service/adoption-post/${route.params.id}`);
  const data = await res.json();
  
  post.value = data;
  comments.value = data.comments || [];
  likeCount.value = data.recommendCount || 0;
  // Attempt to resolve file URLs for each returned file (pick the first that actually loads)
  resolveAllFileUrls();
  
  // TODO: 로그인한 사용자가 좋아요를 눌렀는지 확인하는 API 호출
  // isLiked.value = await checkIfLiked(route.params.id);
});

// ✅ 좋아요 토글
async function toggleLike() {
  // TODO: 로그인 체크
  // if (!isLoggedIn) {
  //   alert('로그인이 필요합니다.');
  //   return;
  // }

  try {
    // optimistic update
    const prevLiked = isLiked.value
    const prevCount = likeCount.value
    if (isLiked.value) {
      isLiked.value = false
      likeCount.value = Math.max(0, likeCount.value - 1)
    } else {
      isLiked.value = true
      likeCount.value = likeCount.value + 1
    }

    // Attempt to persist to backend; controller expects POST /{postId}/liked with body { userId, headId }
    const userId = sessionStorage.getItem('userId') ? parseInt(sessionStorage.getItem('userId')) : null
    const headId = sessionStorage.getItem('headId') ? parseInt(sessionStorage.getItem('headId')) : null

    const res = await fetch(`http://localhost:8000/post-service/adoption-post/${route.params.id}/liked`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, headId })
    })

    if (!res.ok) {
      // revert optimistic update
      isLiked.value = prevLiked
      likeCount.value = prevCount
      const body = await res.text().catch(() => '')
      console.warn('좋아요 저장 실패:', res.status, body)
    }
  } catch (error) {
    console.error('좋아요 처리 중 오류:', error)
    // revert on network error
    isLiked.value = !isLiked.value
    // adjust likeCount conservatively
    if (isLiked.value) likeCount.value++
    else likeCount.value = Math.max(0, likeCount.value - 1)
  }
}

// ✅ URL 복사
function copyUrl() {
  const input = document.createElement('input');
  input.value = shareUrl.value;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  
  // 복사 완료 알림
  showCopyAlert.value = true;
  setTimeout(() => {
    showCopyAlert.value = false;
  }, 2000);
}

function getImage(name) {
  return name
    ? `http://localhost:8000/post-service/adoption-post/${route.params.id}/files/${name}`
    : "/no-image.png";
}

// Return the best available URL for a file object returned by the backend.
function getFileUrl(file) {
  if (!file) return '/no-image.png'

  // If backend already provided a fileUrl, use it (prefix host when it's a relative path)
  if (file.fileUrl) {
    try {
      if (file.fileUrl.startsWith('http')) return file.fileUrl
      // ensure leading slash
      const path = file.fileUrl.startsWith('/') ? file.fileUrl : `/${file.fileUrl}`
      return `http://localhost:8000${path}`
    } catch (e) {
      // fallthrough
    }
  }

  // Prefer fileRename if available (uses per-post files endpoint)
  // If we've previously resolved a working URL for this file, return it
  const key = file.fileRename || file.storageFileName || file.id || JSON.stringify(file)
  if (resolvedFileUrls.value[key]) return resolvedFileUrls.value[key]

  // Otherwise, return a reasonable immediate candidate so the <img> can start loading while
  // async resolution runs (resolveAllFileUrls was called on mount). This keeps behavior
  // deterministic when server already supplies a valid fileUrl.
  if (file.fileRename) {
    return `http://localhost:8000/post-service/adoption-post/${route.params.id}/files/${file.fileRename}`
  }

  // fallback
  return '/no-image.png'
}

// Try a list of candidate URLs for each file, using an Image() probe to detect the first
// URL that successfully loads. Stores results in `resolvedFileUrls` keyed by fileRename/storageFileName/id.
function resolveAllFileUrls() {
  if (!post.value || !post.value.files || !post.value.files.length) return;

  post.value.files.forEach(file => {
    const key = file.fileRename || file.storageFileName || file.id || JSON.stringify(file)
    // If already resolved, skip
    if (resolvedFileUrls.value[key]) return;

    const candidates = [];

    // if backend provided full URL, prefer it first
    if (file.fileUrl) {
      const url = file.fileUrl.startsWith('http') ? file.fileUrl : `http://localhost:8000${file.fileUrl.startsWith('/') ? file.fileUrl : '/' + file.fileUrl}`
      candidates.push(url)
    }

    if (file.fileRename) {
      // Try common variations used across different backend deployments
      candidates.push(`http://localhost:8000/post-service/adoption-post/image/${file.fileRename}`)
      candidates.push(`http://localhost:8000/post-service/adoption-post/${route.params.id}/files/${file.fileRename}`)
      candidates.push(`http://localhost:8000/files/adoption/${file.fileRename}`)
      // Server controller in this project exposes /adoption-post/... (see controller code)
      candidates.push(`http://localhost:8000/adoption-post/image/${file.fileRename}`)
      candidates.push(`http://localhost:8000/adoption-post/${route.params.id}/files/${file.fileRename}`)
    }

    if (file.storageFileName) {
      candidates.push(`http://localhost:8000/files/adoption/${file.storageFileName}`)
    }

    // Try candidates in order, pick the first that loads
    tryCandidatesSequentially(candidates).then(successUrl => {
      if (successUrl) resolvedFileUrls.value[key] = successUrl
    })
  })
}

function tryCandidatesSequentially(candidates) {
  return new Promise(resolve => {
    if (!candidates || candidates.length === 0) return resolve(null)

    let idx = 0

    function tryOne() {
      const url = candidates[idx]
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = () => {
        idx++
        if (idx >= candidates.length) return resolve(null)
        tryOne()
      }
      img.src = url
    }

    tryOne()
  })
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

// 댓글 작성: 작성자는 고정으로 '이지윤'
async function postComment() {
  const content = commentText.value && commentText.value.trim();
  if (!content) {
    alert('댓글을 입력해주세요.');
    return;
  }

  const newComment = {
    writerName: '이지윤',
    content,
    displayDate: new Date().toISOString(),
  };

  // Optimistic UI 업데이트
  comments.value = [newComment, ...comments.value];
  commentText.value = '';

  // 시도: 백엔드에 저장 (실패해도 UI는 유지)
  try {
    await fetch(`http://localhost:8000/post-service/adoption-post/${route.params.id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writerName: newComment.writerName, content: newComment.content })
    });
  } catch (err) {
    // 백엔드가 없거나 API가 다르면 콘솔에만 기록
    console.warn('댓글 저장 실패(무시됨):', err);
  }
}

// 댓글 신고: 전역 리포트 모달 열기
function reportComment(comment) {
  const targetId = comment && (comment.id ?? null);
  openReport({ targetType: 'comment', targetId });
}

// 게시글 신고 버튼 핸들러
function reportPost() {
  const targetId = post.value && post.value.id ? post.value.id : route.params.id
  openReport({ targetType: 'post', targetId })
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  background: #f0ebe5;
  padding: 50px 20px 100px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.detail-box {
  background: #fff;
  width: 100%;
  max-width: 900px;
  padding: 40px 50px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* 뒤로가기 */
.back {
  background: none;
  border: none;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  padding: 0;
  margin-bottom: 30px;
  font-weight: 400;
}

/* 헤더 */
.top-info {
  margin-bottom: 30px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tag-area {
  display: flex;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 5px 12px;
  background: #fff5e6;
  border: 1px solid #ffd280;
  border-radius: 15px;
  color: #b8860b;
  font-weight: 500;
}

.tag.type {
  background: #ffe4b3;
  font-weight: 600;
}

.report-btn {
  background: #fff;
  border: 1px solid #ddd;
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 11px;
  color: #666;
  cursor: pointer;
}

.title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.6;
  color: #222;
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.author-info .icon {
  font-size: 14px;
}

.author-info .name {
  font-weight: 500;
  color: #333;
}

.author-info .badge {
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #666;
}

.author-info .date {
  color: #999;
}

.stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

/* 이미지 영역 전체 */
.image-section {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  margin: 25px 0;
}

/* 슬라이더 중앙 정렬 */
.detail-swiper {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

/* 각 슬라이드도 중앙 정렬 */
.swiper-slide {
  display: flex !important;
  justify-content: center;
  align-items: center;
}

/* PC에서도 항상 중앙 + 비율 유지 */
.post-image {
  width: auto;
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

/* ✅ 아래 쪽 페이지 표시 */
.page-indicator {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 6px 12px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 600;
}

/* 화살표 버튼 */
.swiper-button-prev,
.swiper-button-next {
  width: 42px;
  height: 42px;
  background: rgba(255,255,255,0.95);
  border-radius: 50%;
  color: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background: #fff;
}

/* 동물 정보 */
.animal-info {
  background: #fffbf5;
  border: 1px solid #f5e8d3;
  border-radius: 10px;
  padding: 25px;
  margin: 25px 0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #b8860b;
  margin-bottom: 18px;
}

.info-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.info-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  font-size: 13px;
}

.info-row .label {
  color: #777;
}

.info-row .value {
  color: #333;
  font-weight: 500;
  margin-left: 4px;
}

.health-title {
  font-size: 13px;
  color: #777;
  margin-bottom: 4px;
}

.health-row {
  margin-bottom: 6px;
}

.health-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background: #fff;
  display: inline-block;
  font-weight: 500;
}

.health-badge.complete {
  color: #2d7a4f;
}

.health-badge.incomplete {
  color: #d32f2f;
}

.contact-section {
  padding-top: 18px;
  border-top: 1px solid #f5e8d3;
}

.contact-item {
  font-size: 13px;
  color: #555;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-icon {
  font-size: 14px;
}

.contact-label {
  color: #777;
}

.contact-value {
  color: #333;
  font-weight: 500;
}

/* 본문 */
.content-text {
  line-height: 1.8;
  color: #444;
  font-size: 14px;
  margin: 30px 0;
  white-space: pre-wrap;
}

/* ✅ 액션 버튼 */
.action-bar {
  display: flex;
  justify-content: center;
  gap: 14px;
  padding: 24px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin: 30px 0;
}

.action-btn {
  background: #fff;
  border: 1.5px solid #e8d5b7;
  padding: 11px 24px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
  color: #7a5d3a;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #fef9f3;
  border-color: #d4b896;
}

/* ✅ 좋아요 활성화 상태 */
.action-btn.like.liked {
  background: #ffe4e1;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

/* 댓글 */
.comment-area {
  margin-top: 40px;
}

.comment-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.comment-count {
  color: #ff8c42;
  font-weight: 600;
  margin-left: 6px;
}

.empty-comment {
  text-align: center;
  padding: 60px 20px;
  color: #aaa;
  background: #fafafa;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 24px;
}

.comment-item {
  display: flex;
  gap: 14px;
  padding: 20px 0;
  border-bottom: 1px solid #f5f5f5;
}

.comment-profile {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f4e4c8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.comment-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.comment-message {
  font-size: 13px;
  line-height: 1.6;
  color: #444;
  margin-bottom: 10px;
}

.reply-link {
  background: none;
  border: none;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.reply-link:hover {
  color: #666;
}

.comment-input-wrapper {
  margin-top: 30px;
  position: relative;
}

.comment-textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  font-size: 13px;
  font-family: inherit;
  background: #fafafa;
  min-height: 110px;
  resize: vertical;
  line-height: 1.6;
}

.comment-textarea:focus {
  outline: none;
  border-color: #d4b896;
  background: #fff;
}

.comment-textarea::placeholder {
  color: #aaa;
}

.submit-btn {
  position: absolute;
  bottom: 18px;
  right: 18px;
  background: #e8d5b7;
  border: none;
  padding: 9px 22px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #5a4628;
  cursor: pointer;
}

.submit-btn:hover {
  background: #dcc5a3;
}

/* ✅ 공유하기 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 440px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-close:hover {
  color: #333;
}

.modal-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
}

.url-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
}

.url-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
}

.copy-icon-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
}

.copy-btn {
  width: 100%;
  background: #e8d5b7;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #5a4628;
  cursor: pointer;
  margin-bottom: 10px;
}

.copy-btn:hover {
  background: #dcc5a3;
}

.cancel-btn {
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  padding: 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #f8f8f8;
}

/* ✅ 복사 완료 알림 */
.copy-alert {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #4caf50;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 768px) {
  .detail-box {
    padding: 30px 24px;
  }

  .info-layout {
    grid-template-columns: 1fr 1fr;
  }

  .meta-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .post-image {
    max-height: 350px;
  }

  .modal-content {
    padding: 24px;
    width: 95%;
  }
}
</style>