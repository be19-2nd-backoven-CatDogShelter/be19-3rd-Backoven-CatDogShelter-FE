<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../useAuth'

const router = useRouter()
const { signup, loading, error } = useAuth()
const DEFAULT_RATING_ID = 1

const SIGUNGU_LIST = [
  { id: 1,  name: '종로구',   sidoId: 1 },
  { id: 2,  name: '중구',     sidoId: 1 },
  { id: 3,  name: '용산구',   sidoId: 1 },   // ← VSCode가 붙여넣을 때 깨지면 name 키로 바꿔주세요
  { id: 4,  name: '성동구',   sidoId: 1 },
  { id: 5,  name: '광진구',   sidoId: 1 },
  { id: 6,  name: '동대문구', sidoId: 1 },
  { id: 7,  name: '중랑구',   sidoId: 1 },
  { id: 8,  name: '성북구',   sidoId: 1 },
  { id: 9,  name: '강북구',   sidoId: 1 },
  { id: 10, name: '도봉구',   sidoId: 1 },
  { id: 11, name: '중구',     sidoId: 2 },
  { id: 12, name: '서구',     sidoId: 2 },
  { id: 13, name: '동구',     sidoId: 2 },
  { id: 14, name: '영도구',   sidoId: 2 },
  { id: 15, name: '부산진구', sidoId: 2 },
  { id: 16, name: '중구',     sidoId: 3 },
  { id: 17, name: '동구',     sidoId: 3 },
  { id: 18, name: '서구',     sidoId: 3 },
  { id: 19, name: '중구',     sidoId: 4 },
  { id: 20, name: '동구',     sidoId: 4 },
  { id: 21, name: '남구',     sidoId: 4 },
  { id: 22, name: '동구',     sidoId: 5 },
  { id: 23, name: '동구',     sidoId: 6 },
  { id: 24, name: '중구',     sidoId: 7 },
  { id: 25, name: '수원시',   sidoId: 8 },
  { id: 26, name: '수원시 장안구', sidoId: 8 },
  { id: 27, name: '수원시 권선구', sidoId: 8 },
  { id: 28, name: '춘천시',   sidoId: 9 },
  { id: 29, name: '청주시',   sidoId: 10 },
]

const SIDO_LIST = [
  { id: 1,  code: 11, name: '서울특별시' },
  { id: 2,  code: 26, name: '부산광역시' },
  { id: 3,  code: 27, name: '대구광역시' },
  { id: 4,  code: 28, name: '인천광역시' },
  { id: 5,  code: 29, name: '광주광역시' },
  { id: 6,  code: 30, name: '대전광역시' },
  { id: 7,  code: 31, name: '울산광역시' },
  { id: 8,  code: 41, name: '경기도' },
  { id: 9,  code: 42, name: '강원도' },
  { id: 10, code: 43, name: '충청북도' },
]

const form = ref({
  name: '',
  username: '',
  password: '',
  password2: '',
  email: '',
  phone: '',
  region: '',
  address: '',
  agree: false,
  sigunguId: '',  
  sidoId: '',            
  ratingId: DEFAULT_RATING_ID 
})

const pwOk = computed(
  () => form.value.password.length >= 6 && form.value.password === form.value.password2
)

const submit = async () => {
  if (!pwOk.value) return
  if (!form.value.agree) {
    alert('약관에 동의해 주세요.')
    return
  }

const payload = {
  userName: form.value.name.trim(),
  userAccount: form.value.username.trim(),
  userPassword: form.value.password,
  email: form.value.email.trim(),
  detailAddress: form.value.address.trim(),
  userPhone: form.value.phone.trim(),
  userStatus: 'GENERAL',
  activationDate: new Date().toISOString().slice(0, 10),
  ratingId: Number(form.value.ratingId),      // ← 1로 고정 전송
  sigunguId: Number(form.value.sigunguId),    // ← 드롭다운에서 선택한 값
}
const ok = await signup(payload) 
  if (ok) router.push({ name: 'login' })
}
</script>

<template>
  <section class="wrap">
    <div class="card">
      <header class="head">
        <button class="back" type="button" @click="router.push({ name: 'login' })">
          <svg viewBox="0 0 20 20" width="18" height="18">
            <path d="M12 4L6 10l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          로그인으로
        </button>
        <img class="logo" src="@/assets/logo.svg" alt="안냥보호센터" />
        <h2>회원가입</h2>
      </header>

      <form class="form" @submit.prevent="submit" novalidate>
        <div class="row2">
          <label class="field">
            <span>이름 *</span>
            <input v-model.trim="form.name" required />
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
            <!-- 높이 맞춤용 빈 힌트 -->
            <small class="hint blank">placeholder</small>
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
          <input v-model.trim="form.email" type="email" required placeholder="example@mail.com" />
        </label>

        <div class="row2">
        <label class="field full">
            <span>연락처</span>
            <input v-model.trim="form.phone" inputmode="tel" placeholder="010-0000-0000" />
        </label>
        </div>

        <div class="row2">
        <!-- 시/도 -->
        <label class="field">
          <span>시/도 *</span>
          <select v-model="form.sidoId" required>
            <option value="" disabled>선택</option>
            <option v-for="s in SIDO_LIST" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
        </label>

        <!-- 시/군/구 (연동 없이 UI만) -->
        <label class="field">
          <span>시군구 *</span>
          <select v-model="form.sigunguId" required :disabled="!form.sidoId">
            <option value="" disabled>
              {{ form.sidoId ? '선택' : '시/도를 먼저 선택' }}
            </option>
            <option v-for="g in SIGUNGU_LIST" :key="g.id" :value="g.id">
              {{ g.name }}
            </option>
          </select>
        </label>

            <!-- 등급은 고정값으로 보내므로 UI는 굳이 노출 안 함 -->
            <label class="field" style="display:none">
                <span>등급</span>
                <input v-model="form.ratingId" type="number" />
            </label>
        </div>

        <label class="field full">
          <span>주소</span>
          <input v-model.trim="form.address" placeholder="도로명 주소" />
        </label>

        <label class="agree full">
          <input type="checkbox" v-model="form.agree" />
          <span>개인정보 처리 및 이용약관에 동의합니다. *</span>
        </label>

        <button class="submit full" type="submit" :disabled="loading || !pwOk">회원가입</button>

        <p v-if="error" class="error full" role="alert">
          {{ error }}
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
/* Layout */
.wrap {
  display: grid;
  place-items: center;
  padding: 40px 16px;
  background: #efe6d7;
  min-height: 100%;
}

.card {
  --card-w: 520px;
  --gutter: 24px;
  --ctl-h: 42px;
  width: var(--card-w);
  max-width: 92vw;
  background: #fff;
  border-radius: 16px;
  padding: 24px var(--gutter) 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .08);
  position: relative;
}

.head {
  text-align: center;
  margin-bottom: 10px;
}

.logo {
  width: 56px;
  height: 56px;
  margin: 6px auto 4px;
  display: block;
}

h2 {
  margin: 6px 0 0;
  font-size: 22px;
}

.back {
  position: absolute;
  left: 16px;
  top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #eadfcd;
  border-radius: 8px;
  background: #fff;
  color: #6b5b4a;
  cursor: pointer;
}

/* Form grid */
.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.form .row2 {
  display: contents;
}
.field,
.agree {
  display: grid;
  gap: 6px;
}
.field > span {
  font-size: 12px;
  color: #666;
}
.full {
  grid-column: 1 / -1;
}

/* Controls */
input,
select,
textarea,
button.submit {
  height: var(--ctl-h);
  padding: 0 14px;
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  background: #fafafa;
  outline: none;
  box-sizing: border-box;
}
textarea {
  padding-top: 10px;
  padding-bottom: 10px;
  min-height: 120px;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #d1b57a;
  background: #fff;
}

/* Hint / error */
.hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  min-height: 14px;
}
.error {
  text-align: center;
  color: #d33;
  font-size: 13px;
  margin-top: 4px;
}

/* Agree */
.agree {
  align-items: center;
  grid-auto-flow: column;
  justify-content: start;
  gap: 8px;
}
.agree input[type='checkbox'] {
  width: 18px;
  height: 18px;
}
.agree span {
  font-size: 12px;
  color: #777;
}

/* Button */
button.submit {
  border: 0;
  background: #1c1c1c;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
button.submit:disabled {
  opacity: .6;
  cursor: default;
}

/* Responsive */
@media (max-width: 560px) {
  .form {
    grid-template-columns: 1fr;
  }
  .full {
    grid-column: 1 / 2;
  }
}
</style>
