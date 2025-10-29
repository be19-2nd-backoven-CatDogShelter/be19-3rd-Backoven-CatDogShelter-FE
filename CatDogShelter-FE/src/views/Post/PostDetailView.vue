<template>
  <article v-if="post" class="post-detail">
    <!-- 상단: 좌측 '목록으로', 우측 '게시글 신고' -->
    <div class="topbar">
      <RouterLink class="back" :to="{ name: 'post', query: { page: 1 } }">← 목록으로</RouterLink>

      <div class="top-actions">
        <button class="report-post" type="button" @click="reportPost">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M4 4v16M6 4h9l-1.5 3L18 10H6"
                  fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>게시글 신고</span>
        </button>
      </div>
    </div>

    <h1 class="title">{{ post.title }}</h1>

    <div class="meta">
      <span class="author-wrap">
        <button type="button" class="author-btn" @click="userMenuOpen = !userMenuOpen">
          <img class="author-ico" src="@/assets/인원아이콘.svg" alt="" />
          {{ post.author.name }}
        </button>

        <!-- 드롭다운 (아래 2번에서 만든 컴포넌트) -->
        <UserQuickMenu
          v-if="userMenuOpen"
          class="author-menu"
          :user="post.author"
          @close="userMenuOpen = false"
          @view-profile="goProfile"
          @send-message="goMessage"
        />
      </span>
      <span class="badge">{{ post.category }}</span>
      <span class="dot">·</span>
      <span class="date">{{ post.date }}</span>

      <!-- ✅ 여기 추가: 조회/좋아요/댓글 인라인 통계 -->
      <div class="stats-inline" aria-label="조회/좋아요/댓글 통계">
        <span class="stat">
          <!-- eye (views) -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          {{ post.stats.views }}
        </span>

        <span class="stat">
          <!-- heart (likes) -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-7-4.35-9.5-8A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 7c-2.5 3.65-9.5 8-9.5 8z"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ post.stats.likes }}
        </span>

        <span class="stat">
          <!-- comment -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          {{ post.stats.comments }}
        </span>
      </div>
    </div>


    <div class="body">
      <div v-if="post.images && post.images.length" class="gallery">
        <img v-for="(img,i) in post.images" :key="i" :src="img.src" :alt="img.alt" />
      </div>
      <p v-for="(p,i) in post.content" :key="i">{{ p }}</p>
    </div>

    <!-- 하단 액션: 좋아요/공유만 중앙 -->
    <div class="actions">
      <button class="chip" :class="{ on: isLiked }" @click="toggleLike">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M12 21s-7-4.35-9.5-8A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 7c-2.5 3.65-9.5 8-9.5 8z"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        좋아요 {{ post.stats.likes }}
      </button>
      <button class="chip" @click="openShare">공유하기</button>
    </div>

    <!-- (요청으로 제거) 이전/다음 글 네비게이션 없음 -->

    <!-- 댓글 -->
    <section class="comments">
      <h2 class="c-title">댓글 <span class="num">{{ post.stats.comments }}</span></h2>

      <ul v-if="post.comments?.length" class="c-list">
        <li v-for="c in post.comments" :key="c.id" class="c-item">
          <div class="avatar" aria-hidden="true">{{ c.author?.[0] || 'E' }}</div>
          <div class="c-box">
            <div class="c-head">
              <strong class="c-author">{{ c.author || '이지윤' }}</strong>
              <span class="c-time">{{ c.createdAt }}</span>
            </div>
            <p class="c-text">{{ c.text }}</p>

            <!-- 댓글 신고: 본문 아래로 이동, 삭제 기능 제거 -->
            <button
              class="c-report-under"
              type="button"
              @click="openReport({ targetType: 'comment', targetId: c.id })"
            >
              신고하기
            </button>
          </div>
        </li>
      </ul>

      <!-- 닉네임 입력 제거, 이지윤 번호 자동 부여 -->
      <form class="c-form" @submit.prevent="addComment">
        <textarea v-model="newComment" class="input" placeholder="댓글을 입력하세요" rows="3" required />
        <div class="c-actions">
          <button type="submit" class="submit">댓글 작성</button>
        </div>
      </form>
    </section>
  </article>

  <article v-else class="post-detail">
    <p>존재하지 않는 게시글입니다.</p>
    <RouterLink class="back" :to="{ name: 'post' }">목록으로</RouterLink>
  </article>

  <ShareModal v-model="showShare" :share-url="shareUrl" />
  <UserProfileModal v-model="showProfile" :user="selectedUser" />
  <UserMessageModal v-model="showMessage" :user="selectedUser" />
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShareModal from '@/components/share/ShareModal.vue'
import { getDummyDetail } from './detail/dummies.js'
import { openReport } from '@/components/report'
import UserQuickMenu from '@/components/user/UserQuickMenu.vue'
import { onBeforeUnmount } from 'vue' 
import UserProfileModal from '@/components/user/UserProfileModal.vue'
import UserMessageModal from '@/components/user/UserMessageModal.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))
const userMenuOpen = ref(false)
const state = reactive({ post: null, isLiked: false })
const newComment = ref('')
const showProfile = ref(false)
const showMessage = ref(false)
const selectedUser = ref(null)

const storageKey = computed(() => `post:detail:${id.value}`)
const post   = computed(() => state.post)
const isLiked = computed(() => state.isLiked)
const showShare = ref(false)
const shareUrl = computed(() => {
  const resolved = router.resolve({ name: 'post.detail', params: { id: id.value } })
  return new URL(resolved.href, window.location.origin).toString()
})
const openShare = () => { showShare.value = true }
const closeOnOutside = (e) => {
  if (!e.target.closest('.author-wrap')) userMenuOpen.value = false
}
onMounted(() => document.addEventListener('click', closeOnOutside, true))
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutside, true))

function goProfile(u){
  selectedUser.value = u || post.value?.author
  showProfile.value = true
  userMenuOpen.value = false
}
function goMessage(u){
  selectedUser.value = u || post.value?.author
  showMessage.value = true
  userMenuOpen.value = false
}

function load() {
  // 1) 사용자 저장 상세 우선
  const savedDetail = JSON.parse(localStorage.getItem(`post:detail:${id.value}`) || 'null')
  let base = null
  if (savedDetail && savedDetail.title) {
    base = savedDetail
  } else {
    const d = getDummyDetail(id.value)
    if (d) base = structuredClone ? structuredClone(d) : JSON.parse(JSON.stringify(d))
  }
  if (!base) { state.post = null; return }

  // 2) 좋아요/댓글 최신 반영
  const saved = JSON.parse(localStorage.getItem(storageKey.value) || 'null')
  if (saved) {
    if (typeof saved.likes === 'number') base.stats.likes = saved.likes
    if (Array.isArray(saved.comments))   base.comments    = saved.comments
    if (typeof saved.isLiked === 'boolean') state.isLiked = saved.isLiked
    base.stats.comments = base.comments.length
  }
  state.post = base
}

function persist() {
  if (!state.post) return
  localStorage.setItem(storageKey.value, JSON.stringify({
    likes: state.post.stats.likes,
    isLiked: state.isLiked,
    comments: state.post.comments
  }))
}

function toggleLike() {
  if (!state.post) return
  state.isLiked ? state.post.stats.likes-- : state.post.stats.likes++
  state.isLiked = !state.isLiked
  persist()
}

function share() {
  try {
    if (navigator.share) {
      navigator.share({ title: post.value?.title || '게시글', url: location.href })
      return
    }
  } catch {}
  navigator.clipboard?.writeText(location.href)
  alert('링크가 복사되었습니다.')
}

// 댓글 추가(닉네임 없이 이지윤 번호 자동)
function addComment() {
  const text = newComment.value.trim()
  if (!text || !state.post) return

  const DEFAULT_NICKNAME = '이지윤'   // 디폴트 닉네임
  const d = new Date()
  const ts = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`

  state.post.comments.push({
    id: Date.now(),
    author: DEFAULT_NICKNAME,         // ← 여기!
    text,
    createdAt: ts
  })
  state.post.stats.comments = state.post.comments.length
  newComment.value = ''
  persist()
}

function reportPost(){
  if(!post.value?.id) return
  openReport({ targetType: 'post', targetId: post.value.id })
}

onMounted(load)
watch(id, load)
</script>

<style scoped>
.post-detail{max-width:880px;margin:24px auto;padding:22px 24px;background:#fff;border-radius:14px;box-shadow:0 12px 22px rgba(0,0,0,.06)}
/* 상단 바 */
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.back{color:#6b5b4a}


/* 게시글 신고 버튼 */
.top-actions{display:flex;align-items:center;gap:8px}
.report-post{
  display:inline-flex;align-items:center;gap:6px;
  padding:6px 10px;border-radius:8px;
  border:1px solid #e8e2d6;background:#fff;color:#6b5b4a;font-weight:700;
}
.report-post:hover{background:#fff9f6;border-color:#f2b8b8;color:#a83b3b}

.title{margin:8px 0 4px;font-size:24px;font-weight:800}
.meta{
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  min-height: 34px;
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 0.8px solid #E5E7EB;
}

.meta-left{
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* 오른쪽 끝으로 밀기 */
.stats-inline{
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;        /* <= 오른쪽 끝 정렬 포인트 */
}

.stat{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8f8f8f;
  font-size: 13px;
}
.stat svg{ width:16px; height:16px; }

/* 헤더-본문 구분선 */
.divider{
  height: 1px;
  background: #ececec;
  margin-top: 12px;
}

@media (max-width: 640px){
  .stats-inline{ gap: 10px; }
  .stat{ font-size: 12px; }
  .stat svg{ width:15px; height:15px; }
}


.body{margin-top:18px;line-height:1.7}
.gallery{display:grid;gap:12px;justify-items:center;margin-bottom:12px}

/* 하단 액션: 중앙 정렬 */
.actions{display:flex;justify-content:center;gap:10px;margin:16px 0 8px}
.chip{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 12px;border-radius:999px;border:1px solid #eadfcd;background:#fff;color:#5a4a38;
  box-shadow:0 2px 6px rgba(0,0,0,.05); font-weight:700;
}
.chip.on{background:#b87445;color:#fff;border-color:#b87445}

/* 댓글 */
.comments{margin-top:22px;background:#F9FAFB;border:0px solid #eee;border-radius:12px;padding:16px;}
.c-title{margin:0 0 12px;font-size:15px}
.c-title .num{color:#8a6a3f}
.c-list{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.c-item{display:flex;gap:10px;align-items:flex-start}
.avatar{width:28px;height:28px;border-radius:50%;background:#f0e7d8;border:1px solid #eadfcd;display:grid;place-items:center;font-size:12px;color:#6b5b4a}
.c-box{flex:1;background:#fff;border:1px solid #eee;border-radius:10px;padding:10px}
.c-head{display:flex;gap:8px;align-items:center;color:#6b7280;font-size:12px;margin-bottom:4px}
.c-author { font-weight:700; color:#3c3425; }
.c-time { color:#6b7280; font-size:12px; }
.c-text{margin:0}

/* 댓글 신고(본문 아래) */
.c-report-under{
  margin-top:8px;background:transparent;border:0;
  color:#a83b3b;font-size:12px;padding:0;cursor:pointer
}
.c-report-under:hover{text-decoration:underline}

/* 닉네임/삭제 등 이전 스타일 무력화 */
.c-row-actions{display:none !important}
.c-del{display:none !important}

.c-form{margin-top:12px;display:grid;gap:8px}
.input{width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;background:#fff;resize:vertical}
.c-actions{display:flex;justify-content:flex-end}
.submit{padding:8px 14px;border-radius:10px;border:0;background:#e7c07d;color:#3c3425;font-weight:800}

.author-wrap { position: relative; display: inline-block; }
.author-btn {
  display:inline-flex; align-items:center; gap:8px;
  padding:4px 8px; border:0; background:transparent;
  border-radius:8px; cursor:pointer; color:#1f2937; font-weight:700;
}
.author-btn:hover { background:#f7f4ee; }
.author-ico { width:18px; height:18px; display:block; }
.author-menu { position:absolute; top:32px; left:0; z-index:20; }

/* 우측 끝 정렬되는 조회/좋아요/댓글 인라인 통계 */
.stats-inline{
  display:inline-flex; align-items:center; gap:14px;
  margin-left:auto;                        /* 오른쪽 끝 정렬 */
}
.stat{ display:inline-flex; align-items:center; gap:6px; color:#8f8f8f; font-size:13px; }
.stat svg{ width:16px; height:16px; }

@media (max-width: 640px){
  .stats-inline{ gap:10px; }
  .stat{ font-size:12px; }
  .stat svg{ width:15px; height:15px; }
}

</style>




