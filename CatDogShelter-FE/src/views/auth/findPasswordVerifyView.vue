<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// ②에서 넘겨준 값 사용 (query)
const userAccount = ref(route.query.userAccount || '')
const email = ref(route.query.email || '')

// 6자리 코드 UI
const boxes = Array.from({ length: 6 }, () => ref(''))
const inputs = Array.from({ length: 6 }, () => ref(null))
const code = computed(() => boxes.map(b => (b.value || '')[0] || '').join(''))

// 타이머/쿨다운
const leftSec = ref(300)  // 3분
const cooldown = ref(0)   // 재전송 60초 쿨다운
let t1=null, t2=null

const tickTimer = () => {
  t1 && clearInterval(t1)
  leftSec.value = 300
  t1 = setInterval(() => {
    leftSec.value -= 1
    if (leftSec.value <= 0) { clearInterval(t1) }
  }, 1000)
}
const startCooldown = (sec=60) => {
  cooldown.value = sec
  t2 && clearInterval(t2)
  t2 = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearInterval(t2)
  }, 1000)
}

const loading = ref(false)
const msg = ref('')
const err = ref('')

// 포커스/입력 제어
const onInput = (i, e) => {
  const v = e.target.value.replace(/\D/g,'').slice(0,1)
  boxes[i].value = v
  if (v && i < 5) inputs[i+1].value?.focus()
}
const onKeydown = (i, e) => {
  if (e.key === 'Backspace' && !boxes[i].value && i > 0) {
    inputs[i-1].value?.focus()
  }
}
const onPaste = (e) => {
  const text = (e.clipboardData?.getData('text') || '').replace(/\D/g,'').slice(0,6)
  for (let i=0;i<6;i++) boxes[i].value = text[i] || ''
  inputs[Math.min(text.length,5)].value?.focus()
}

const resend = async () => {
  if (cooldown.value>0) return
  err.value=''; msg.value=''
  try {
    // ②와 동일 엔드포인트 (재전송)
    const res = await fetch('/user-service/user/password/code/request', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      // ⚠️ 백엔드 DTO 키에 맞춰 조정
      body: JSON.stringify({ userAccount: userAccount.value, email: email.value })
      // body: JSON.stringify({ user_account: userAccount.value, email1: email.value })
    })
    const ct = res.headers.get('content-type') || ''
    const data = ct.includes('application/json') ? await res.json().catch(()=>({})) : await res.text().catch(()=> '')
    if (!res.ok) throw new Error((data && data.message) || data || '요청 실패')
    msg.value = (data && data.message) || data || '인증번호를 재전송했습니다.'
    startCooldown(60)
    tickTimer() // 남은 시간 리셋
  } catch(e) {
    err.value = e.message || '재전송에 실패했습니다.'
  }
}

const submit = () => {
  err.value = ''; msg.value = ''
  if (code.value.length !== 6) {
    err.value = '6자리 인증번호를 입력하세요.'
    return
  }
  router.push({
    name: 'find.password.reset',
    query: {
      userAccount: userAccount.value,
      email: email.value,
      verificationCode: code.value,
    }
  })
}

onMounted(() => {
  tickTimer()
  inputs[0].value?.focus()
})
onUnmounted(() => { t1 && clearInterval(t1); t2 && clearInterval(t2) })
</script>

<template>
  <section class="wrap">
    <div class="card">
      <header class="head">
        <img class="logo" src="@/assets/logo.svg" alt="땅냥쉼터" />
        <h2>비밀번호 찾기</h2>
        <p class="sub"><b>{{ email }}</b> 으로 발송된 6자리 인증번호를 입력해주세요</p>
      </header>

      <div class="code-box" @paste.prevent="onPaste">
        <input v-for="(b,i) in boxes" :key="i" ref="inputs" class="cell"
               inputmode="numeric" maxlength="1" autocomplete="one-time-code"
               v-model="b.value" @input="onInput(i,$event)" @keydown="onKeydown(i,$event)" />
      </div>

      <div class="meta">
        <span class="timer" :class="{ danger: leftSec<=30 }">
          {{ Math.floor(leftSec/60).toString().padStart(2,'0') }}:{{ (leftSec%60).toString().padStart(2,'0') }}
        </span>
        <button class="link" :disabled="cooldown>0" @click="resend">
          {{ cooldown>0 ? `인증번호 재발송 (${cooldown}s)` : '인증번호 재발송' }}
        </button>
      </div>

      <button class="btn primary" :disabled="loading" @click="submit">인증 확인</button>

      <p v-if="msg" class="msg ok">{{ msg }}</p>
      <p v-if="err" class="msg err">{{ err }}</p>

      <p class="back"><router-link :to="{ name:'find.password.request' }">← 인증번호 다시 받기</router-link></p>
    </div>
  </section>
</template>

<style scoped>
.wrap{padding:24px}
.card{max-width:560px;margin:36px auto;background:#fff;border-radius:16px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.head{text-align:center;margin-bottom:12px}
.logo{width:56px;height:56px;margin:6px auto 4px;display:block}
.sub{font-size:12px;color:#8a8a8a;margin:0}
.code-box{display:flex;justify-content:center;gap:10px;margin:16px 0}
.cell{width:48px;height:56px;text-align:center;font-size:24px;border:1px solid #e1e1e1;border-radius:10px;background:#fafafa;outline:none}
.cell:focus{border-color:#d1b57a;background:#fff}
.meta{display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:12px}
.timer{font-weight:700;color:#666}
.timer.danger{color:#d84a1b}
.link{background:none;border:none;color:#1677ff;cursor:pointer;text-decoration:underline}
.btn.primary{width:100%;height:44px;border:0;border-radius:10px;background:#1c1c1c;color:#fff;font-weight:700}
.msg{margin-top:10px;font-size:14px}
.msg.ok{color:#1677ff}
.msg.err{color:#d84a1b}
.back{margin-top:12px;text-align:center}
</style>
