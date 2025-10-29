<!-- src/views/auth/FindIdView.vue -->
<script setup>
import { ref } from 'vue'

const email = ref('')
const msg = ref('')
const err = ref('')
const loading = ref(false)

const submit = async () => {
  msg.value = ''
  err.value = ''
  loading.value = true
  try {
    // Vite 프록시 기준: 5173 → (proxy) → 8000
    const response = await fetch('/user-service/user/find-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // ✅ 백엔드가 email1로 받음 (Postman 스샷 기준)
      body: JSON.stringify({ email: email.value })
      // 만약 DTO가 email이면 ↓로 교체
      // body: JSON.stringify({ email: email.value })
    })

    const ct = response.headers.get('content-type') || ''
    let message = ''
    if (ct.includes('application/json')) {
      const data = await response.json().catch(() => ({}))
      message = data.message || data.msg || data.result || ''
    } else {
      message = await response.text().catch(() => '')
    }

    if (!response.ok) throw new Error(message || '요청 실패')
    msg.value = message || '등록된 이메일로 아이디가 전송되었습니다.'
  } catch (e) {
    err.value = e.message || '잠시 후 다시 시도해주세요.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="card">
    <header class="head">
      <img class="logo" src="@/assets/logo.svg" alt="댕냥쉼터" />
      <h2>계정 찾기</h2>
      <p class="sub">가입 시 활용한 이메일 주소를 입력해주세요</p>
    </header>

    <form class="form" @submit.prevent="submit">
      <label class="field">
        <span class="label">이메일 주소</span>
        <input v-model.trim="email" type="email" placeholder="example@mail.com" required />
      </label>
      <button class="submit" :disabled="loading">
        <span v-if="!loading">아이디 찾기</span>
        <span v-else>전송 중...</span>
      </button>
    </form>

    <p v-if="msg" class="msg ok">{{ msg }}</p>
    <p v-if="err" class="msg err">{{ err }}</p>

    <p class="back"><router-link :to="{ name: 'login' }">로그인으로 돌아가기</router-link></p>
  </section>
</template>

<style scoped>
.card{max-width:520px;margin:48px auto;background:#fff;border-radius:16px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.head{text-align:center;margin-bottom:12px}
.logo{width:56px;height:56px;margin:6px auto 4px;display:block}
.sub{font-size:12px;color:#8a8a8a;margin:0}
.form{display:grid;gap:12px;margin-top:10px}
.field{display:grid;gap:6px}
.label{font-size:12px;color:#666}
input{height:42px;padding:0 14px;border:1px solid #e1e1e1;border-radius:8px;background:#fafafa}
input:focus{border-color:#d1b57a;background:#fff}
.submit{height:42px;border:0;border-radius:10px;background:#e7c98c;font-weight:700}
.msg.ok{color:#1677ff;margin-top:8px}
.msg.err{color:#d84a1b;margin-top:8px}
.back{margin-top:14px;text-align:center}
</style>
