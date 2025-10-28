<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// ③에서 넘겨받은 값
const userAccount = ref(route.query.userAccount || '')
const email = ref(route.query.email || '')
const verificationCode = ref(route.query.verificationCode || '')

// 새 비밀번호
const pw = ref('')
const pw2 = ref('')
const lenOk   = computed(() => pw.value.length >= 8)
const hasNum  = computed(() => /\d/.test(pw.value))
const hasEng  = computed(() => /[A-Za-z]/.test(pw.value))
const matchOk = computed(() => pw.value && pw.value === pw2.value)
const canSubmit = computed(() => lenOk.value && hasNum.value && hasEng.value && matchOk.value)

const loading = ref(false)
const msg = ref('')
const err = ref('')

const submit = async () => {
  msg.value=''; err.value=''; loading.value=true
  try {
    if (!canSubmit.value) throw new Error('비밀번호 규칙을 확인해주세요.')
    // 게이트웨이 프록시: /user-service → 8000
    const res = await fetch('/user-service/user/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAccount: userAccount.value,
        verificationCode: verificationCode.value,
        newPassword: pw.value
      })
    })
    const ct = res.headers.get('content-type') || ''
    const data = ct.includes('application/json') ? await res.json().catch(()=>({})) : await res.text().catch(()=> '')
    if (!res.ok) throw new Error((data && data.message) || data || '요청 실패')

    msg.value = (data && data.message) || data || '비밀번호가 변경되었습니다.'
    setTimeout(   setTimeout(() => {router.replace({ name: 'login', query: { reset: 'ok' } })
   }, 1200))
  } catch (e) {
    err.value = e.message || '변경에 실패했습니다.'
  } finally {
    loading.value=false
  }
}
</script>

<template>
  <section class="wrap">
    <div class="card">
      <header class="head">
        <img class="logo" src="@/assets/logo.svg" alt="땅냥쉼터" />
        <h2>비밀번호 찾기</h2>
        <p class="sub">새 비밀번호를 설정해주세요</p>
      </header>

      <div class="info">
        <span class="tag">아이디</span>
        <b>{{ userAccount }}</b>
        <span class="dot">·</span>
        <span class="tag">이메일</span>
        <b>{{ email }}</b>
      </div>

      <form class="form" @submit.prevent="submit">
        <label class="field">
          <span class="label">인증번호</span>
          <input v-model.trim="verificationCode" inputmode="numeric" maxlength="6" placeholder="6자리 코드" required />
        </label>

        <label class="field">
          <span class="label">새 비밀번호</span>
          <input v-model="pw" type="password" placeholder="8자 이상, 영문/숫자 포함" autocomplete="new-password" required />
        </label>

        <ul class="rules">
          <li :class="{ok:lenOk}">8자 이상</li>
          <li :class="{ok:hasEng}">영문 포함</li>
          <li :class="{ok:hasNum}">숫자 포함</li>
        </ul>

        <label class="field">
          <span class="label">비밀번호 확인</span>
          <input v-model="pw2" type="password" placeholder="한 번 더 입력" autocomplete="new-password" required />
        </label>
        <p class="hint" :class="{ok:matchOk, err:!matchOk && pw2}">
          {{ matchOk ? '비밀번호가 일치합니다.' : (pw2 ? '비밀번호가 일치하지 않습니다.' : '') }}
        </p>

        <button class="btn primary" :disabled="!canSubmit || loading">
          <span v-if="!loading">비밀번호 변경 완료</span>
          <span v-else>변경 중...</span>
        </button>
      </form>

      <p v-if="msg" class="msg ok">{{ msg }}</p>
      <p v-if="err" class="msg err">{{ err }}</p>

      <p class="back"><router-link :to="{ name: 'find.password.request' }">← 인증번호 다시 받기</router-link></p>
    </div>
  </section>
</template>

<style scoped>
.wrap{padding:24px}
.card{max-width:560px;margin:36px auto;background:#fff;border-radius:16px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.head{text-align:center;margin-bottom:12px}
.logo{width:56px;height:56px;margin:6px auto 4px;display:block}
.sub{font-size:12px;color:#8a8a8a;margin:0}
.info{display:flex;justify-content:center;gap:6px;margin:6px 0 10px;color:#666;font-size:13px}
.info .tag{color:#888}
.info .dot{color:#bdbdbd}
.form{display:grid;gap:12px;margin-top:10px}
.field{display:grid;gap:6px}
.label{font-size:12px;color:#666}
input{height:44px;padding:0 14px;border:1px solid #e1e1e1;border-radius:8px;background:#fafafa}
input:focus{border-color:#d1b57a;background:#fff}
.rules{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:0;padding:0;list-style:none;color:#888;font-size:12px}
.rules li{padding-left:18px;position:relative}
.rules li::before{content:'•';position:absolute;left:6px;top:0}
.rules li.ok{color:#1a7f37}
.hint{font-size:12px;margin:0 0 6px;color:#888}
.hint.ok{color:#1a7f37}.hint.err{color:#d84a1b}
.btn.primary{height:44px;border:0;border-radius:10px;background:#1c1c1c;color:#fff;font-weight:700}
.msg{margin-top:10px;font-size:14px}
.msg.ok{color:#1677ff}.msg.err{color:#d84a1b}
.back{margin-top:12px;text-align:center}
</style>
