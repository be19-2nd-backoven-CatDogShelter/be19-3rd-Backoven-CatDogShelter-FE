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
          <button class="report-btn">📢 게시글 신고</button>
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
            <span class="stat">💬 {{ post.commentCount }}</span>
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
        :src="`http://localhost:8000/post-service/adoption-post/image/${file.fileRename}`"
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

      <!-- 버튼 -->
      <div class="action-bar">
        <button class="action-btn like">♡ 좋아요 {{ post.recommendCount }}</button>
        <button class="action-btn share">🔗 공유하기</button>
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
            <div class="comment-author">{{ c.writer }}</div>
            <div class="comment-time">{{ formatDate(c.createdAt) }}</div>
            <p class="comment-message">{{ c.content }}</p>
            <button class="reply-link">💬 답글하기</button>
          </div>
        </div>

        <div class="comment-input-wrapper">
          <textarea class="comment-textarea" placeholder="댓글을 입력하세요"></textarea>
          <button class="submit-btn">댓글 작성</button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";


const activeIndex = ref(0);

function onSlideChange(swiper) {
  activeIndex.value = swiper.activeIndex;
}
const route = useRoute();
const post = ref({});
const comments = ref([]);

onMounted(async () => {
  const res = await fetch(`http://localhost:8000/post-service/adoption-post/${route.params.id}`);
  const data = await res.json();
  
  console.log('API Response:', data); // ✅ 디버깅: API 응답 확인
  console.log('Comments from API:', data.comments); // ✅ 디버깅: 댓글 확인
  
  post.value = data;
  
  // ✅ API에서 받아온 댓글 사용 (더미 데이터 제거)
  comments.value = data.comments || [];
  
  // 더미 댓글 제거!
  // comments.value = [
  //   { writer: "부천 유기견 보호소", content: "좋은 가족 만나길 바랍니다!", createdAt: "2025-10-21 16:20" },
  //   { writer: "강지은", content: "너무 귀여워요 🥰", createdAt: "2025-10-21 15:30" },
  // ];
});

function getImage(name) {
  return name
    ? `http://localhost:8000/post-service/adoption-post/${route.params.id}/image/${name}`
    : "/no-image.png";
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
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


/* 모바일 화면 조정 */
@media (max-width: 768px) {
  .post-image {
    max-height: 350px;
  }
}


.pet-image {
  width: 100%;
  height: auto;
  display: block;
}

.arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.arrow-btn:hover {
  background: #fff;
}

.arrow-btn.left {
  left: 16px;
}

.arrow-btn.right {
  right: 16px;
}

.page-indicator {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 6px 14px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
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

/* 액션 버튼 */
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
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  margin-bottom: 12px;
}
.detail-swiper {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
}

/* 화살표 버튼 스타일 */
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

/* 아래 인디케이터 */
.page-indicator {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.75);
  color: #fff;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}
.detail-swiper {
  display: flex;
  justify-content: center;
}

.swiper-slide {
  display: flex;
  justify-content: center;
}

.post-image {
  width: auto;
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

}
</style>