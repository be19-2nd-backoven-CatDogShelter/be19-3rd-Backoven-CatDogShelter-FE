<template>
  <header class="site-header">
    <nav class="navbar">
      <!-- 왼쪽: 로고 + 메뉴 -->
      <div class="nav-left">
        <RouterLink to="/" class="logo" aria-label="댕냥쉼터 홈으로">
          <img src="@/assets/logo.svg" alt="댕냥쉼터 로고" class="logo-img" />
          <span class="brand">댕냥쉼터</span>
        </RouterLink>

        <ul class="menu">
          <li><RouterLink to="/volunteer">봉사게시판</RouterLink></li>
          <li><RouterLink to="/donation">후원게시판</RouterLink></li>
          <li><RouterLink to="/adoption">입양게시판</RouterLink></li>
          <li><RouterLink to="/missing">실종게시판</RouterLink></li>
          <li><RouterLink to="/sighting">목격게시판</RouterLink></li>
          <li><RouterLink to="/post">자유게시판</RouterLink></li>
          <li><RouterLink to="/heroes">댕냥히어로즈</RouterLink></li>
        </ul>
      </div>

      <!-- 오른쪽: 로그인 / 마이페이지 / 로그아웃 -->
      <div class="nav-right">
        <!-- 로그인 전 -->
        <button
          v-if="!authed"
          class="auth-btn login-only"
          @click="goLogin"
        >
          로그인
        </button>

        <!-- 로그인 후 -->
        <template v-else>
          <!-- 마이페이지 드롭다운 -->
          <div class="mypage-dropdown">
            <button class="auth-btn mypage-btn">
              마이페이지
            </button>
            
            <!-- 드롭다운 메뉴 -->
            <div class="dropdown-menu">
              <RouterLink :to="myPageTo" class="dropdown-item">
                내 정보
              </RouterLink>
              <RouterLink to="/mypage/messages" class="dropdown-item">
                쪽지보내기
              </RouterLink>
              <RouterLink to="/volunteer" class="dropdown-item">
                내 봉사활동
              </RouterLink>
            </div>
          </div>

          <button class="auth-btn logout-btn" @click="doLogout">
            로그아웃
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/views/auth/useAuth'

const router = useRouter()
const { authed, logout } = useAuth()

// 로그인 상태에 따라 로컬 role을 반영 (초기/변경 모두)
const userRole = ref(localStorage.getItem('userRole') || 'user')
watch(authed, (v) => {
  userRole.value = v ? (localStorage.getItem('userRole') || 'user') : 'user'
})

// "내 정보" 버튼 목적지 계산 (관리자 → /admin, 보호소장 → /shelter-head/mypage, 일반 → /mypage)
const myPageTo = computed(() => {
  const role = (localStorage.getItem('role') || '').toUpperCase()
  if (role === 'ADMIN') return '/admin'
  if (role === 'SHELTER_HEAD' || userRole.value === 'shelter') return '/shelter-head/mypage'
  return '/mypage'
})

function goLogin() {
  router.push({ name: 'login' })
}

function doLogout() {
  logout()
  localStorage.removeItem('role')
  localStorage.removeItem('userRole')
  router.push({ name: 'home' })
}
</script>

<style scoped>
/* ====== 기본 구조 ====== */
.site-header {
  width: 100%;
  background-color: #f7ecd1;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  display: flex;
  justify-content: center;
}

.navbar {
  width: 100%;
  max-width: 1400px;
  height: 70px;
  margin: 0 auto;
  min-height: 56px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  font-family: "Pretendard Variable", "Noto Sans KR", system-ui, sans-serif;
}

/* ====== 왼쪽: 로고 + 메뉴 ====== */
.nav-left {
  display: flex;
  align-items: center;
  gap: 50px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #000;
}
.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.brand {
  font-size: 22px;
  font-weight: 700;
  color: #000;
  line-height: 1;
}

/* 메뉴 */
.menu {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  margin: 0;
  padding: 0;
}
.menu a {
  text-decoration: none;
  color: #000;
  font-weight: 700;
  font-size: 18px;
  line-height: -0.2px;
  transition: opacity .15s ease;
}
.menu a:hover { opacity: .7; }
.menu :deep(.router-link-active) {
  text-decoration: underline 1px dotted rgba(0,0,0,0.5);
  text-underline-offset: 3px;
  opacity: .9;
}

/* ====== 오른쪽: 계정 버튼 ====== */
.nav-right { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.auth-btn {
  background-color: #fff; 
  color: #000;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 6px; 
  padding: 8px 12px; 
  min-width: 80px;
  text-align: center; 
  font-size: 14px; 
  font-weight: 600; 
  line-height: 1.2;
  cursor: pointer; 
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  transition: background-color .15s ease, filter .15s ease, transform .02s ease;
}
.auth-btn:hover { 
  filter: brightness(.97); 
  background-color: #fff; 
}
.auth-btn:active { 
  transform: translateY(1px); 
}

/* ====== 마이페이지 드롭다운 ====== */
.mypage-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 160px;
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 1000;
}

.mypage-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f7ecd1;
}

.dropdown-item:active {
  background-color: #e6cf9c;
}

/* 드롭다운 화살표 */
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: white;
  border-left: 1px solid rgba(0,0,0,0.1);
  border-top: 1px solid rgba(0,0,0,0.1);
  transform: rotate(45deg);
}

/* ====== 반응형 ====== */
@media (max-width: 1100px) {
  .menu { gap: 20px; font-size: 14px; }
}

@media (max-width: 900px) {
  .navbar { padding: 10px 16px; }
  .brand { font-size: 16px; }
  .menu { gap: 16px; }
  .auth-btn { min-width: auto; padding: 8px 10px; font-size: 13.5px; }
  .dropdown-menu { min-width: 140px; }
  .dropdown-item { padding: 10px 16px; font-size: 13px; }
}

@media (max-width: 640px) {
  .menu { display: none; }
}
</style>