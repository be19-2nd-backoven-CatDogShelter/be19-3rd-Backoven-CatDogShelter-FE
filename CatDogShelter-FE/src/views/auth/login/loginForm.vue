<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { login, useAuth } from '../useAuth'

const role = ref('USER') // 'USER' | 'SHELTER_HEAD'
const form = ref({ email: '', password: '' })
const keep = ref(false)

const { loading, error, authed } = useAuth()
const router = useRouter()
const hasSignup = computed(() => router.hasRoute('signup')) 

const roleLabel = computed(() => role.value === 'USER' ? '일반회원' : '보호소장 회원')
const signupRoute = computed(() =>
  role.value === 'USER' ? { name: 'signup.user' } : { name: 'signup.shelter' }
)
const signupLabel = computed(() =>
  role.value === 'USER' ? '일반회원 회원가입' : '보호소장 회원가입'
)
const signupHint = computed(() =>
  role.value === 'USER'
    ? '아직 회원이 아니신가요? 일반회원으로 가입해 주세요.'
    : '보호소장님, 안냥보호센터와 함께해요. 보호소장 전용 회원가입으로 진행됩니다.'
)

/** ✅ 임시 관리자 우회 로그인 추가 */
const submit = async () => {
  // 1) 임시 관리자 계정이면 백엔드 호출 없이 바로 통과
  if (form.value.email === 'admin' && form.value.password === 'Admin!2025demo') {
    authed.value = true
    // 로그인 상태 플래그
    localStorage.setItem('authed', '1')
    // 라우터 가드/헤더 분기용 역할 값
    localStorage.setItem('role', 'ADMIN')        // router.beforeEach에서 사용
    localStorage.setItem('userRole', 'admin')     // 헤더 드롭다운 분기용(있으면)
    // 필요하면 더미 유저 정보 저장
    localStorage.setItem('user', JSON.stringify({
      account: 'admin',
      name: '관리자',
    }))
    // 그냥 홈으로 (헤더의 “내 정보”는 /admin으로 향함)
    await router.push({ name: 'home' })
    return
  }

  // 2) 일반 로그인 플로우
  const ok = await login({ ...form.value, role: role.value, keep: keep.value })
  if (ok) {
    router.push({ name: 'home' })
  }
}

const emit = defineEmits(['success'])
</script>

<template>
  <section class="card" role="dialog" aria-modal="true" aria-label="로그인">
    <!-- 상단 로고 + 타이틀 -->
    <header class="card-head">
      <img class="logo" src="@/assets/logo.svg" alt="안냥보호센터" />
      <h2 class="title">안냥보호센터 로그인</h2>
      <p class="subtitle">더 좋은 입양문화를 만들어가는 길</p>
    </header>

    <!-- 역할 탭 -->
    <div class="seg">
      <button
        class="seg-btn"
        :class="{ active: role==='USER' }"
        type="button"
        @click="role='USER'"
        aria-pressed="role==='USER'"
      >일반회원</button>
      <button
        class="seg-btn"
        :class="{ active: role==='SHELTER_HEAD' }"
        type="button"
        @click="role='SHELTER_HEAD'"
        aria-pressed="role==='SHELTER_HEAD'"
      >보호소장 회원</button>
    </div>

    <!-- 입력 폼 -->
    <form class="form" @submit.prevent="submit" novalidate>
      <label class="field">
        <span class="label">아이디(또는 이메일)</span>
        <input
          v-model.trim="form.email"
          type="text"
          autocomplete="username"
          required
          placeholder="아이디를 입력하세요"
        />
      </label>

      <label class="field">
        <span class="label">비밀번호</span>
        <input
          v-model.trim="form.password"
          type="password"
          autocomplete="current-password"
          minlength="6"
          required
          placeholder="비밀번호를 입력하세요"
        />
      </label>

      <label class="keep">
        <input type="checkbox" v-model="keep" />
        <span>로그인 유지</span>
      </label>

      <button class="submit" type="submit" :disabled="loading">
        <span v-if="!loading">로그인</span>
        <span v-else>로그인 중...</span>
      </button>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
    </form>

    <!-- 하단 링크 -->
    <p class="hint" style="text-align:center; margin:10px 0 6px; color:#8a8a8a; font-size:12px;">
      {{ signupHint }}
    </p>
    <div class="links">
      <!-- 회원가입 -->
      <router-link :to="signupRoute" class="link main">{{ signupLabel }}</router-link>

      <!-- 아이디 / 비밀번호 찾기 (한 줄) -->
      <p class="find-links">
        <router-link
          v-if="router.hasRoute && router.hasRoute('find.id')"
          :to="{ name:'find.id' }"
          class="link"
        >아이디</router-link>
        <span class="sep"> / </span>
        <router-link
          v-if="router.hasRoute
                && (router.hasRoute('find.password.request') || router.hasRoute('find.password'))"
          :to="router.hasRoute('find.password.request')
                ? { name:'find.password.request' }
                : { name:'find.password' }"
          class="link"
        >비밀번호 찾기</router-link>
      </p>
    </div>
  </section>
</template>

<style scoped>
.card {
  --card-w: 520px;
  --gutter: 24px;
  --ctl-h: 42px;
  width: var(--card-w);
  max-width: 92vw;
  background: #fff;
  border-radius: 16px;
  padding: 24px var(--gutter) 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}
.card * { box-sizing: border-box; }

.card-head { text-align: center; margin-bottom: 10px; }
.logo { width: 56px; height: 56px; margin: 6px auto 4px; display: block; }
.title { font-size: 18px; margin: 4px 0 2px; color: #333; }
.subtitle { font-size: 12px; color: #8a8a8a; margin: 0; }

.seg {
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  background: #f2f2f2; padding: 4px; border-radius: 12px; margin: 10px 0 14px;
}
.seg-btn { height: 36px; border-radius: 8px; background: transparent; border: 0; font-weight: 600; color: #777; cursor: pointer; }
.seg-btn.active { background: #e7c98c; color: #2c2c2c; }

.form { margin-top: 6px; }
.field { display: block; margin-bottom: 10px; }
.label { display: block; font-size: 12px; color: #666; margin-bottom: 6px; }
input[type="text"], input[type="password"] {
  width: 100%; height: var(--ctl-h);
  padding: 0 14px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #fafafa;
  outline: none;
}
input:focus { border-color: #d1b57a; background: #fff; }

.keep { display:flex; align-items:center; gap:8px; margin: 6px 0 10px; color:#666; font-size: 13px; }

.submit {
  width: 100%; height: var(--ctl-h); border-radius: 10px; border: 0;
  background: #1c1c1c; color: #fff; font-weight: 700; cursor: pointer;
}
.submit:disabled { opacity: .6; cursor: default; }

.hint { text-align:center; margin:10px 0 6px; color:#8a8a8a; font-size:12px; }

.links { margin-top: 6px; text-align: center; color:#666; font-size: 13px; }
.link { color:#666; text-decoration: none; }
.link.main { color: #c6932d; font-weight: 700; }
.link:hover { text-decoration: underline; }
.dot { margin: 0 6px; color:#bdbdbd; }
</style>
