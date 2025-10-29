// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/views/auth/useAuth'

// ===== Auth =====
import LoginView from '@/views/auth/login/index.vue'
import SignupUserView from '@/views/auth/signup/user/index.vue'
import SignupShelterView from '@/views/auth/signup/shelter/index.vue'

// ===== Main pages =====
import HomeView from '@/views/HomeView.vue'
import VolunteerView from '@/views/volunteer/VolunteerView.vue'
import DonationView from '@/views/DonationView.vue'
import DonationDetailView from '@/views/donation/DonationDetailView.vue'
import AdoptionView from '@/views/adoption/AdoptionView.vue'
import AdoptionWrite from '@/views/adoption/AdoptionWrite.vue'
import MissingView from '@/views/MissingView.vue'
import SightingView from '@/views/Sighting/SightingView.vue'
import SightingDetailView from '@/views/Sighting/SightingDetailView.vue'
import SightingWriteView from '@/views/Sighting/SightingWriteView.vue'
import PostView from '@/views/Post/PostView.vue'
import PostDetailView from '@/views/Post/PostDetailView.vue'
import PostWriteView from '@/views/Post/PostWriteView.vue'
import HeroesrankingView from '@/views/heros/HeroesrankingView.vue'
import DonationWrite from '@/views/donation/DonationWrite.vue'

// ===== Footer pages =====
import AboutView from '@/views/footer/AboutView.vue'
import TermsView from '@/views/footer/TermsView.vue'
import PrivacyView from '@/views/footer/PrivacyView.vue'
import CommunityGuideView from '@/views/footer/CommunityGuideView.vue'
import AdoptionProcessView from '@/views/footer/AdoptionProcessView.vue'
import VolunteerGuideView from '@/views/footer/VolunteerGuideView.vue'
import FaqView from '@/views/footer/FaqView.vue'
import AdminPageView from '@/views/AdminPageView.vue'

// ===== Misc views =====
import ShelterheadMypageView from '@/views/volunteer/shelterhead/ShelterheadMypageView.vue'
import ApplicantsView from '@/views/volunteer/shelterhead/Applicants.vue'

// ===== Missing post =====
import MissingPostWirte from '@/views/missing/MissingPostWirte.vue'
import MissingDetailView from '@/views/missing/MissingDetailView.vue'

// ===== User MyPage =====
import UserMyPageView from '@/views/mypage/UserMyPageView.vue'
import UserEdit from '@/views/mypage/UserEdit.vue'
import UserMessages from '@/views/mypage/UserMessages.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    // Home
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    
    // Auth
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup.user', component: SignupUserView },
    { path: '/signup/shelter', name: 'signup.shelter', component: SignupShelterView },
    { path: '/_signup', redirect: { name: 'signup.user' } },
    { path: '/auth/find-id', name: 'find.id', component: () => import('@/views/auth/findIdView.vue') },
    { path: '/auth/find-password', name: 'find.password.request', component: () => import('@/views/auth/findPasswordRequestView.vue') },
    { path: '/auth/find-password/verify', name: 'find.password.verify', component: () => import('@/views/auth/findPasswordVerifyView.vue') },
    { path: '/auth/find-password/reset', name: 'find.password.reset', component: () => import('@/views/auth/findPasswordResetView.vue') },

    // Volunteer board
    {
      path: '/volunteer',
      component: VolunteerView,
      children: [
        {
          path: 'detail/:id',
          name: 'VolunteerDetail',
          component: () => import('@/views/volunteer/recruit/VolunteerDetailView.vue'),
          props: true,
        },
        {
          path: 'review/:id',
          name: 'VolunteerReviewDetail',
          component: () => import('@/views/volunteer/review/VolunteerReviewDetailView.vue'),
          props: true,
        },
        {
          path: 'review/insert',
          name: 'VolunteerReviewInsert',
          component: () => import('@/views/volunteer/review/VolunteerReviewInsertView.vue'),
        },
      ],
    },

    // Donation board
    { path: '/donation', name: 'donation', component: DonationView },
    { path: '/donation/:id', name: 'donation-detail', component: DonationDetailView, props: true },
    { path: '/donation/write', name: 'donation.write', component: DonationWrite },

    // Adoption board
    { path: '/adoption', name: 'adoption', component: AdoptionView },
    { path: '/adoption-post/:id', name: 'adoptionDetail', component: () => import('@/views/adoption/AdoptionDetail.vue'), props: true },
    { path: '/adoption/write', name: 'AdoptionWrite', component: AdoptionWrite },

    // Missing board
    { path: '/missing', name: 'missing', component: MissingView },
    { path: '/missing/write', name: 'missing.write', component: MissingPostWirte },
    { path: '/missing/:postId', name: 'missing-detail', component: MissingDetailView, props: true },

    // Sighting board
    { path: '/sighting', name: 'sighting', component: SightingView },

    // Adoption write
    {
      path: '/adoption/write',
      name: 'AdoptionWrite',
      component: AdoptionWrite,
    },


{
  path: '/adoption-post/:id',
  name: 'adoption-detail',
  component: () =>
    import('@/views/adoption/AdoptionDetail.vue'),
  props: true,
},
    // Missing board list
    {
      path: '/missing',
      name: 'missing',
      component: MissingView,
    },

    // Missing report write
    {
      path: '/missing/write',
      name: 'missing.write',
      component: MissingPostWirte,
    },
    {
      path: '/missing/:postId',
      name: 'missing-detail',
      component: MissingDetailView,
      props: true,
    },

    // Sighting board list
    {
      path: '/sighting',
      name: 'sighting',
      component: SightingView
    },
    {
      path: "/sighting/:id",
      name: "sighting-detail",
      component: SightingDetailView
    },
    {
      path: "/sighting/write",
      name: "sighting-write",
      component: SightingWriteView
    },
      

    // Community board list
    {
      path: '/post',
      name: 'post',
      component: PostView,
    },

    // Community board write
    {
      path: '/post/write',
      name: 'post.write',
      component: PostWriteView,
    },

    // Community board detail
    {
      path: '/post/:id',
      name: 'post.detail',
      component: PostDetailView,
      props: true,
    },

    // Redirect if someone hits /post.write directly
    {
      path: '/post.write',
      redirect: { name: 'post.write' },
    },

    // Heroes
    { path: '/heroes', name: 'heroes', component: HeroesrankingView },

    // Footer pages
    { path: '/about', component: AboutView },
    { path: '/terms', component: TermsView },
    { path: '/privacy', component: PrivacyView },
    { path: '/community-guide', component: CommunityGuideView },
    { path: '/adoption-process', component: AdoptionProcessView },
    { path: '/volunteer-guide', component: VolunteerGuideView },
    { path: '/faq', component: FaqView },

    // User MyPage
    {
      path: '/mypage',
      component: UserMyPageView,
      beforeEnter: (to, from, next) => {
        const { isAuthed } = useAuth()
        if (!isAuthed.value) {
          alert("로그인이 필요합니다.")
          return next('/login')
        }
        next()
      }
    },
    { path: '/mypage/edit', name: 'mypage-edit', component: UserEdit, meta: { requiresAuth: true } },
    { path: '/mypage/messages', name: 'mypage-messages', component: UserMessages, meta: { requiresAuth: true } },

    // Shelter head mypage
    {
      path: '/shelter-head/mypage',
      component: ShelterheadMypageView,
      meta: { requiresShelter: true },
      children: [
        {
          path: 'recruitinsert',
          name: 'VolunteerRecruitInsert',
          component: () => import('@/views/volunteer/recruit/VolunteerRecruitInsertView.vue'),
        },
        {
          path: 'applicants',
          name: 'ShelterApplicants',
          component: ApplicantsView,
        },
      ],
    },

    // Admin page
    { path: '/admin', name: 'admin', component: AdminPageView, meta: { requiresAdmin: true } },

    // 404
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('role')
  
  // 관리자 페이지 접근 제어
  if (to.meta?.requiresAdmin) {
    if (role === 'ADMIN') return next()
    alert('관리자만 접근 가능한 페이지입니다.')
    return next({ name: 'login' })
  }
  
  // 보호소장 페이지 접근 제어
  if (to.meta?.requiresShelter) {
    if (role === 'SHELTER_HEAD') return next()
    alert('보호소장만 접근 가능한 페이지입니다.')
    return next({ name: 'login' })
  }
  
  next()
})

export default router