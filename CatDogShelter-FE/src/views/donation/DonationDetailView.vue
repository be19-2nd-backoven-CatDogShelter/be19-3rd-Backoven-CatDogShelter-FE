<template>
  <div class="donation-detail-page">
    <section class="detail-card">
      <!-- ===== 상단 (목록가기 / 삭제버튼) ===== -->
      <div class="detail-top-row">
        <button class="back-link" @click="goList">← 목록으로</button>

        <button
          v-if="isMyPost"
          class="delete-btn"
          @click="onDeletePost"
        >
          게시글 삭제
        </button>
      </div>

      <!-- ===== 제목 / 메타 ===== -->
      <header class="post-head">
        <h1 class="post-title">{{ post.title }}</h1>

        <ul class="meta-list">
          <!-- 보호소명 뱃지처럼 -->
          <li class="meta-category" v-if="post.shelterName">
            {{ post.shelterName }}
          </li>

          <li class="meta-writer">{{ post.writer }}</li>
          <li class="meta-date">{{ post.createdAt }}</li>
          <li class="meta-view">조회 {{ post.view }}</li>
        </ul>
      </header>

      <!-- ===== 본문 ===== -->
      <div class="post-body">
        <p class="post-content" v-html="formattedContent"></p>
      </div>

      <!-- ===== 액션 버튼들 ===== -->
      <div class="action-row">
        <button class="action-chip" @click="toggleLike">
          🤍 좋아요 {{ post.likeCount }}
        </button>
        <button class="action-chip">🔗 공유하기</button>
        <button class="action-chip report-chip">🚨 신고하기</button>
      </div>


      <!-- ===== 댓글 영역 ===== -->
      <section class="comment-block">
        <h2 class="comment-title">
          댓글 <span>{{ comments.length }}</span>
        </h2>

        <!-- ✅ 닉네임 입력칸 없음 -->
        <div class="comment-write-area">
          <textarea
            v-model.trim="newComment"
            class="comment-textarea"
            placeholder="댓글을 입력하세요"
          ></textarea>

          <div class="comment-submit-row">
            <button class="comment-submit-btn" @click="submitComment">
              댓글 작성
            </button>
          </div>
        </div>

        <!-- 댓글 리스트 -->
      <ul class="comment-list">
  <li v-for="c in comments" :key="c.id" class="comment-item">
    <div class="comment-meta">
      <span class="comment-writer">{{ c.writer }}</span>
      <span class="comment-date">{{ c.createdAt }}</span>
    </div>

    <p class="comment-content">{{ c.content }}</p>

    <!-- 일단 수정/삭제 버튼은 항상 보이게 -->
    <div class="comment-actions">
      <button @click="updateComment(c.id, prompt('내용 수정', c.content) || c.content)">
        수정
      </button>
      <button @click="deleteComment(c.id)">삭제</button>
    </div>
  </li>
</ul>
  <div v-if="comments.length === 0" class="comment-item">
    <div class="comment-content" style="color:#8b7a67;font-size:14px;">
      아직 댓글이 없습니다.
    </div>
  </div>


      </section>
    </section>
  </div>
</template>



<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'DonationDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const postId = route.params.id

    // 임시 로그인/식별자 (나중에 토큰 기반으로 치환)
    const dummyHeadId = 3   // 보호소장 id (삭제/권한용)
    const dummyUserId = 6   // 실제 user 테이블에 존재하는 user_id

    // ===== 게시글 상태 =====
    const post = ref({
      id: null,
      title: '',
      content: '',
      shelterName: '',
      writer: '',
      createdAt: '',
      view: 0,
      likeCount: 0,
      // 서버가 이미지 리스트 돌려주면 여기에도 추가 가능 ex) images: []
    })

    // 내가 쓴 글인지 여부 (삭제 버튼 노출용)
    const isMyPost = ref(false)

    // ===== 댓글 상태 =====
    const comments = ref([])
    const newComment = ref('')

    // ===== 본문 줄바꿈 처리 =====
    const formattedContent = computed(() =>
      post.value.content
        ? post.value.content.replace(/\n/g, '<br/>')
        : ''
    )

    // ===== 목록으로 이동 =====
    const goList = () => {
      router.push('/donation')
    }

    // ===== 게시글 상세 불러오기 =====
    // GET /post-service/donation-posts/query/posts/{postId}
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/query/posts/${postId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
            },
          }
        )

        if (!res.ok) {
          throw new Error('게시글 조회 실패')
        }

        const data = await res.json()

        // 응답을 화면 모델로 매핑
        post.value = {
          id: data.id,
          title: data.title,
          content: data.content,          // 본문
          shelterName: data.shelterName,  // 보호소명
          writer: data.userName,          // 작성자
          createdAt: data.createdAt,      // 작성일
          view: data.view,
          likeCount: data.likeCount,
          // 만약 data.images 같은 게 있다면 여기에 붙이면 됨
        }

        // TODO: 실제로는 data.headId === 내 headId 이런식으로 비교해야 함
        isMyPost.value = true
      } catch (err) {
        console.error('[Error] 게시글 조회 실패:', err)
      }
    }

    // ===== 댓글 목록 불러오기 =====
    // GET /post-service/donation-posts/query/posts/{postId}/comments
  const fetchComments = async () => {
  try {
    const res = await fetch(
      `http://localhost:8000/post-service/donation-posts/query/posts/${postId}/comments`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
        },
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('[댓글 조회 실패]', res.status, errText)
      return
    }

    // 👇 전체 응답
    const data = await res.json()
    // data.comments 가 진짜 댓글 배열임
    const arr = Array.isArray(data.comments) ? data.comments : []

    comments.value = arr.map(item => ({
      id: item.id,
      writer: item.userName,        // "김하진"
      createdAt: item.createdAt,    // "2025-10-28 07:38:58"
      content: item.content,        // "test"
      badge: item.userRating,       // "댕냥보호천사"
      // userId가 안 오니까 일단 생략
    }))

    // (선택) 디버그 로그
    console.log('[comments mapped]', comments.value)
  } catch (err) {
    console.error('[Error] 댓글 조회 중 예외:', err)
  }
}

    // ===== 댓글 작성 =====
    // POST /post-service/donation-posts/{postId}/comments
    // body: { content, userId, headId }
    const submitComment = async () => {
      if (!newComment.value.trim()) return

      const payload = {
        content: newComment.value,
        userId: dummyUserId,
        headId: dummyHeadId,
      }

      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/${postId}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
            },
            body: JSON.stringify(payload),
          }
        )

        if (!res.ok) {
          const msg = await res.text()
          console.error('[submitComment] fail body:', msg)
          throw new Error(`댓글 작성 실패 ${res.status}: ${msg}`)
        }

        // 성공했으니까 입력창 비우고
        newComment.value = ''

        // 최신 댓글 다시 불러오기
        await fetchComments()
      } catch (err) {
        console.error('[Error] 댓글 작성 실패:', err)
        alert('댓글 작성 중 오류가 발생했습니다.')
      }
    }

    // ===== 댓글 수정 =====
    // PUT /post-service/donation-posts/comments/{commentId}?userId=6
    const updateComment = async (commentId, newContent) => {
      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/comments/${commentId}?userId=${dummyUserId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
            },
            body: JSON.stringify({
              content: newContent,
            }),
          }
        )

        if (!res.ok) {
          const msg = await res.text()
          throw new Error(`댓글 수정 실패 ${res.status}: ${msg}`)
        }

        await fetchComments()
      } catch (err) {
        console.error('[Error] 댓글 수정 실패:', err)
        alert('댓글 수정 중 오류가 발생했습니다.')
      }
    }

    // ===== 댓글 삭제 =====
    // DELETE /post-service/donation-posts/comments/{commentId}?userId=6
    const deleteComment = async (commentId) => {
      const ok = confirm('이 댓글을 삭제할까요?')
      if (!ok) return

      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/comments/${commentId}?userId=${dummyUserId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
            },
          }
        )

        if (!res.ok) {
          const msg = await res.text()
          throw new Error(`댓글 삭제 실패 ${res.status}: ${msg}`)
        }

        await fetchComments()
      } catch (err) {
        console.error('[Error] 댓글 삭제 실패:', err)
        alert('댓글 삭제 중 오류가 발생했습니다.')
      }
    }

    // ===== 게시글 삭제 =====
    // DELETE /post-service/donation-posts/{postId}?headId=3
    const onDeletePost = async () => {
      const ok = confirm('정말 삭제하시겠습니까?')
      if (!ok) return

      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/${postId}?headId=${dummyHeadId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
            },
          }
        )

        if (!res.ok) {
          const msg = await res.text()
          throw new Error(`삭제 실패 ${res.status}: ${msg}`)
        }

        router.push('/donation')
      } catch (err) {
        console.error('[Error] 게시글 삭제 실패:', err)
        alert('게시글 삭제 중 오류가 발생했습니다.')
      }
    }

    // ===== 좋아요 =====
    // POST /post-service/donation-posts/{postId}/like?userId=3  (좋아요)
    // DELETE /post-service/donation-posts/{postId}/like?userId=3 (취소)
    // 일단은 누르면 좋아요 추가만
    const toggleLike = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/${postId}/like?userId=${dummyUserId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
            },
          }
        )

        if (!res.ok) {
          const msg = await res.text()
          throw new Error(`좋아요 실패 ${res.status}: ${msg}`)
        }

        // 다시 게시글 상세 불러와서 likeCount 갱신
        await fetchPost()
      } catch (err) {
        console.error('[Error] 좋아요 실패:', err)
        alert('좋아요 처리 중 오류가 발생했습니다.')
      }
    }

    // 마운트 시 최초 로드
    onMounted(() => {
      fetchPost()
      fetchComments()
    })

    return {
      post,
      comments,
      newComment,
      formattedContent,
      isMyPost,

      goList,
      submitComment,
      updateComment,
      deleteComment,
      onDeletePost,
      toggleLike,
      dummyUserId,
    }
  },
}
</script>

<style scoped>
.donation-detail-page {
  background-color: #f5efe6;
  padding: 24px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.detail-card {
  background-color: #fffdf8;
  border: 1px solid rgba(120, 72, 24, 0.15);
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  font-family: 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif;
}

.detail-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.back-link {
  background: none;
  border: 0;
  color: #4a3726;
  font-size: 16px;
  line-height: 1.4;
  cursor: pointer;
  padding: 0;
}

.delete-btn {
  background-color: #fff4f1;
  border: 1px solid #e9a091;
  border-radius: 8px;
  font-size: 14px;
  padding: 8px 12px;
  color: #8a3a2b;
  cursor: pointer;
}

.post-head {
  margin-bottom: 20px;
}

.post-title {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
  color: #2f2010;
  word-break: keep-all;
  margin-bottom: 16px;
}

.meta-list {
  display: flex;
  flex-wrap: wrap;
   align-items: center;
  gap: 8px 12px;
  font-size: 14px;
  color: #6a5642;
  line-height: 1.4;
    list-style: none;
  padding-left: 0;
}

.meta-category {
  background-color: #f3e7d9;
  color: #4a3726;
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 500;
  font-size: 13px;
}

.meta-writer,
.meta-date,
.meta-view {
  color: #6a5642;
}

.post-body {
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.6;
  color: #3b2a18;
  white-space: pre-line;
  word-break: break-word;
}

.post-content {
  font-size: 16px;
  line-height: 1.7;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.action-chip {
  background-color: #fff;
  border: 1px solid rgba(120, 72, 24, 0.3);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 14px;
  line-height: 1.3;
  color: #4a3726;
}

.report-chip {
  background-color: #fff6f6;
  border-color: #d88a7c;
  color: #8a3a2b;
}

.related-nav {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-top: 1px solid rgba(120, 72, 24, 0.15);
  border-bottom: 1px solid rgba(120, 72, 24, 0.15);
  padding: 16px 0;
  margin-bottom: 24px;
}
.related-link {
  color: #1a0dab;
  text-decoration: underline;
  font-size: 16px;
  line-height: 1.4;
}

.comment-block {
  background-color: #fdfaf4;
  border-radius: 10px;
  border: 1px solid rgba(120,72,24,0.12);
  padding: 16px;
  margin-bottom: 16px;
}

.comment-title {
  font-size: 18px;
  font-weight: 600;
  color: #3b2a18;
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.comment-write-area {
  background-color: #fffefc;
  border: 1px solid rgba(120,72,24,0.2);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.comment-textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border: 0;
  outline: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #2f2010;
  background-color: transparent;
}

.comment-submit-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.comment-submit-btn {
  background-color: #d5b28e;
  border: 1px solid #a27643;
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}


.comment-item {
  background-color: #fffefc;
  border-radius: 8px;
  border: 1px solid rgba(120,72,24,0.15);
  padding: 12px 14px;
}

.comment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  font-size: 13px;
  color: #6a5642;
  line-height: 1.4;
  margin-bottom: 6px;
}

.comment-writer {
  font-weight: 600;
  color: #4a3726;
}

.comment-content {
  font-size: 15px;
  line-height: 1.5;
  color: #3b2a18;
  white-space: pre-line;
}

.no-comment {
  font-size: 14px;
  color: #8b7a67;
  text-align: center;
  padding: 24px 0;
}
</style>