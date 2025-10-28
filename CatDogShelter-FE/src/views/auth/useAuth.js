import { reactive, computed, toRefs } from 'vue'
import { loginAPI, signupAPI, meAPI } from './service'
import { ref } from 'vue'

const user = ref(null)
const loading = ref(false)
const error = ref(null)
const state = reactive({
  authed: localStorage.getItem('authed') === '1',  // ✅ 쿠키 대신 그림자 플래그
  loading: false,
  error: '',
  role: localStorage.getItem('role') || ''   // ← 추가: 'ADMIN' | 'USER' | ''
})

export const isAuthed = computed(() => state.authed)

function persist() {
  if (state.token) localStorage.setItem('token', state.token)
  else localStorage.removeItem('token')

  if (state.user) localStorage.setItem('user', JSON.stringify(state.user))
  else localStorage.removeItem('user')
}

function resolveRole(me) {
  if (!me) return ''
  if (me.role && /ADMIN/i.test(me.role)) return 'ADMIN'
  const rid = me.ratingId ?? me.rating_id
  if (rid !== undefined) return Number(rid) === -1 ? 'ADMIN' : 'USER'
  return 'USER'
}

export async function login(form) {
  state.loading = true; state.error = ''
  try {
    await loginAPI(form)                  // 200 오면 성공(쿠키는 서버가 셋)
    state.authed = true
    localStorage.setItem('authed', '1')
    const me = await fetchMe()
    const r = resolveRole(me)
    state.role = r
    localStorage.setItem('role', r)
    return true
  } catch (e) {
    state.error = e.message || '로그인 실패'
    return false
  } finally {
    state.loading = false
  }
}

export async function signup(form) {
  state.loading = true; state.error = ''
  try { await signupAPI(form); return true }
  catch (e) { state.error = e.message || '회원가입 실패'; return false }
  finally { state.loading = false }
}

export function logout() {
  // 서버 쿠키는 만료 전까지 남지만, UI 상태는 즉시 로그아웃 처리
  state.authed = false
  localStorage.removeItem('authed')
  state.role = ''
  localStorage.removeItem('role')
}

async function fetchMe() {
  loading.value = true
  try {
    const res = await fetch('/user-service/me', {
      credentials: 'include',
      headers: {
        Authorization: localStorage.getItem('accessToken')
          ? `Bearer ${localStorage.getItem('accessToken')}`
          : ''
      }
    })
    if (!res.ok) throw new Error('unauthorized')
        user.value = await res.json()
    const r = resolveRole(user.value)
    if (r) {
      state.role = r
      localStorage.setItem('role', r)
    }
    return user.value
  } catch (e) {
    user.value = null
    return null
  } finally {
    loading.value = false
  }
}


export function useAuth() {
  return { ...toRefs(state), isAuthed, login, signup, logout, fetchMe }
}