<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { signup, useAuth } from '../../useAuth'

const router = useRouter()
const { loading, error } = useAuth()

const form = ref({
  ceoName: '',
  username: '',
  password: '',
  password2: '',
  email: '',
  shelterPhone: '',
  managerPhone: '',
  region: '',
  shelterName: '',
  bizNumber: '',
  corpNumber: '',
  address: '',
  agree: false,
})

const pwOk = computed(() => form.value.password.length >= 6 && form.value.password === form.value.password2)

const submit = async () => {
  if (!pwOk.value) return
  if (!form.value.agree) { alert('약관에 동의해 주세요.'); return }

  const ok = await signup({
    role: 'SHELTER_HEAD',
    ceoName: form.value.ceoName.trim(),
    username: form.value.username.trim(),
    password: form.value.password,
    email: form.value.email.trim(),
    shelterPhone: form.value.shelterPhone.trim(),
    managerPhone: form.value.managerPhone.trim(),
    region: form.value.region,
    shelterName: form.value.shelterName.trim(),
    bizNumber: form.value.bizNumber.trim(),   // 111-22-33344 형태
    corpNumber: form.value.corpNumber.trim(), // 법인번호
    address: form.value.address.trim(),
  })

  if (ok) router.push({ name: 'login' })
}
</script>

<template>
  <section class="wrap">
    <div class="card">
      <header class="head">
        <button class="back" type="button" @click="router.push({ name:'login' })">
            <svg viewBox="0 0 20 20" width="18" height="18"><path d="M12 4L6 10l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            로그인으로
        </button>
        <img class="logo" src="@/assets/logo.svg" alt="댕냥쉼터" />
        <h2>보호소장 회원가입</h2>
        <p class="sub">보호소 운영자 전용 가입</p>
      </header>


      <form class="form" @submit.prevent="submit" novalidate>
  <div class="row2">
    <label class="field">
      <span>이름(대표자 성명) *</span>
      <input v-model.trim="form.ceoName" required />
    </label>
    <label class="field">
      <span>아이디 *</span>
      <input v-model.trim="form.username" required minlength="4" placeholder="영문/숫자 4자 이상" />
    </label>
  </div>

  <div class="row2">
    <label class="field">
      <span>비밀번호 *</span>
      <input v-model="form.password" type="password" required minlength="6" placeholder="6자 이상" />
    </label>
    <label class="field">
      <span>비밀번호 확인 *</span>
      <input v-model="form.password2" type="password" required minlength="6" />
      <small class="hint" :class="{ ok: pwOk, bad: !pwOk && form.password2 }">
        {{ pwOk ? '비밀번호가 일치합니다.' : (form.password2 ? '비밀번호가 일치하지 않습니다.' : '') }}
      </small>
    </label>
  </div>

  <label class="field full">
    <span>이메일 *</span>
    <input v-model.trim="form.email" type="email" required placeholder="shelter@example.com" />
  </label>

  <!-- 이후 항목들은 캡처처럼 한 줄씩 전체 폭 -->
  <label class="field full">
    <span>전화번호 *</span>
    <input v-model.trim="form.shelterPhone" inputmode="tel" placeholder="02-000-0000" />
  </label>

  <label class="field full">
    <span>사업자 등록번호 *</span>
    <input v-model.trim="form.bizNumber" placeholder="00000-00000" />
  </label>

  <label class="field full">
    <span>법인 등록번호 *</span>
    <input v-model.trim="form.corpNumber" placeholder="000000-0000000" />
  </label>

  <label class="field full">
    <span>사업장 주소</span>
    <input v-model.trim="form.address" placeholder="도로명 주소" />
  </label>

  <label class="agree full">
    <input type="checkbox" v-model="form.agree" />
    <span>보호소장 전용 약관 및 개인정보 처리에 동의합니다. *</span>
  </label>

  <button class="submit full" type="submit" :disabled="loading || !pwOk">회원가입</button>
  <p v-if="error" class="error full" role="alert" style="text-align:center; color:#d33; font-size:13px; margin-top:4px;">
    {{ error }}
  </p>
</form>

    </div>
  </section>
</template>

<style scoped>
/* ===== 공통 토큰 ===== */
.card {
  --card-w: 520px;
  --gutter: 24px;
  --ctl-h: 42px;
  width: var(--card-w);
  max-width: 92vw;
  margin: 0 auto;            
  background: #fff;
  border-radius: 16px;
  padding: 24px var(--gutter) 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  position: relative;
}
.form {
  /* ✅ 2열 그리드 + 일정 간격 */
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.form .row2 { /* 기존 래퍼를 레이아웃에서 지우듯 평탄화 */
  display: contents;
}
.field, .agree { display:grid; gap:6px; }
.field > span { font-size:12px; color:#666; }

/* 가로 전체 사용 */
.full { grid-column: 1 / -1; }

/* 컨트롤 통일 */
input, select, textarea, button.submit {
  height: var(--ctl-h);
  padding: 0 14px;
  border:1px solid #e1e1e1;
  border-radius:10px;
  background:#fafafa;
  outline:none;
  box-sizing:border-box;
}
textarea { padding-top:10px; padding-bottom:10px; min-height: 120px; }
input:focus, select:focus, textarea:focus { border-color:#d1b57a; background:#fff; }

/* 힌트/오류 라인은 행간을 건드리지 않게 */
.hint { font-size:12px; color:#999; margin-top:4px; min-height:14px; }

/* 동의 체크 작고 깔끔하게 */
.agree { align-items:center; grid-auto-flow: column; justify-content: start; gap:8px; }
.agree input[type="checkbox"] { width:18px; height:18px; }
.agree span { font-size:12px; color:#777; }

/* 버튼 */
button.submit {
  border:0; background:#1c1c1c; color:#fff; font-weight:700; cursor:pointer;
}
button.submit:disabled { opacity:.6; cursor:default; }

/* 상단 뒤로가기 버튼 유지 (있다면) */
.back {
  position:absolute; left:16px; top:16px;
  display:inline-flex; align-items:center; gap:6px;
  height:32px; padding:0 10px; border:1px solid #eadfcd; border-radius:8px;
  background:#fff; color:#6b5b4a; cursor:pointer;
}

/* 반응형: 모바일에서 1열 */
@media (max-width:560px){
  .form { grid-template-columns: 1fr; }
  .full { grid-column: 1 / 2; }
}

.wrap {
  display: flex;
  justify-content: center;   
  align-items: flex-start;   
  padding: 40px 16px;
  background: #efe6d7;
  min-height: 100%;
  width: 100%;
}

.logo {
  width: 56px;               
  height: 56px;              
  display: block;
  margin: 6px auto 4px;     
  object-fit: contain;
}

</style>

