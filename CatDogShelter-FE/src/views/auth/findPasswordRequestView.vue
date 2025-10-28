<script setup>

import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
 const router = useRouter()

const userAccount = ref('')   // 아이디
const email = ref('')         // 이메일
const loading = ref(false)
const msg = ref('')
const err = ref('')
const cooldown = ref(0)
let timer = null

const startCooldown = (sec = 60) => {
  cooldown.value = sec
  timer && clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

const submit = async () => {
  msg.value = ''; err.value = ''; loading.value = true
  try {
    // ✅ 엔드포인트는 백엔드에 맞춰 조정
    // 예) /user-service/user/password/code/request  (프록시로 8000 전달)
    const res = await fetch('/user-service/user/password/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAccount: userAccount.value, email: email.value })
    })

    const ct = res.headers.get('content-type') || ''
    const data = ct.includes('application/json')
      ? await res.json().catch(() => ({}))
      : await res.text().catch(() => '')

    if (!res.ok) throw new Error((data && data.message) || data || '요청 실패')

    msg.value = (data && data.message) || data || '인증번호를 전송했습니다. 메일함을 확인하세요.'
    router.push({
        name: 'find.password.verify',
        query: { userAccount: userAccount.value, email: email.value }
    })
  } catch (e) {
    err.value = e.message || '잠시 후 다시 시도해주세요.'
  } finally {
    loading.value = false
  }
}

onUnmounted(() => timer && clearInterval(timer))
</script>

<template>
  <section class="wrap">
    <div class="card">
      <header class="head">
        <img class="logo" src="@/assets/logo.svg" alt="땅냥쉼터" />
        <h2>비밀번호 찾기</h2>
        <p class="sub">아이디와 이메일을 입력하여 본인 확인을 진행해주세요</p>
      </header>

      <form class="form" @submit.prevent="submit">
        <label class="field">
          <span class="label">아이디</span>
          <input v-model.trim="userAccount" type="text" placeholder="아이디를 입력하세요" required />
        </label>

        <label class="field">
          <span class="label">이메일 주소</span>
          <input v-model.trim="email" type="email" placeholder="example@email.com" required />
        </label>

        <button class="btn" :disabled="loading || cooldown>0">
          <span v-if="cooldown===0 && !loading">인증번호 발송</span>
          <span v-else-if="loading">전송 중...</span>
          <span v-else>재전송 ({{ cooldown }}s)</span>
        </button>
      </form>

      <p v-if="msg" class="msg ok">{{ msg }}</p>
      <p v-if="err" class="msg err">{{ err }}</p>

      <div class="notice">
        <strong>안내사항</strong>
        <ul>
          <li>입력하신 이메일로 인증번호가 전송됩니다.</li>
          <li>이메일이 오지 않으면 스팸함을 확인해주세요.</li>
          <li>가입하지 않은 이메일/아이디 조합이라도 결과는 동일하게 응답합니다.</li>
        </ul>
      </div>

      <p class="back"><router-link :to="{ name: 'login' }">로그인으로 돌아가기</router-link></p>
    </div>
  </section>
</template>

<style scoped>
.wrap{padding:24px}
.card{max-width:560px;margin:36px auto;background:#fff;border-radius:16px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.head{text-align:center;margin-bottom:12px}
.logo{width:56px;height:56px;margin:6px auto 4px;display:block}
.sub{font-size:12px;color:#8a8a8a;margin:0}
.form{display:grid;gap:12px;margin-top:10px}
.field{display:grid;gap:6px}
.label{font-size:12px;color:#666}
input{height:44px;padding:0 14px;border:1px solid #e1e1e1;border-radius:8px;background:#fafafa}
input:focus{border-color:#d1b57a;background:#fff}
.btn{height:44px;border:0;border-radius:10px;background:#e34d4d;color:#fff;font-weight:700;cursor:pointer}
.btn:disabled{opacity:.65;cursor:default}
.msg{margin-top:10px;font-size:14px}
.msg.ok{color:#1677ff}
.msg.err{color:#d84a1b}
.notice{margin-top:14px;background:#fff7e8;border:1px solid #ffe2b9;border-radius:10px;padding:12px}
.notice strong{display:block;margin-bottom:6px}
.notice ul{margin:0;padding-left:18px;color:#7a6a4b;font-size:13px}
.back{margin-top:14px;text-align:center}
</style>
