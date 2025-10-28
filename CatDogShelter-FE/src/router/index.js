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
import LoginPlaceholderView from '@/views/LoginPlaceholderView.vue'


// ===== 실종게시판=====
// ===== Missing post writer =====
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
    { path: '/_signup', redirect: { name: 'signup.user' } },   // legacy path cleanup

    // Volunteer board (list layout)
    {
      path: '/volunteer',
      component: VolunteerView,
      children: [
        {
          // Volunteer recruiting detail
          path: 'detail/:id',
          name: 'VolunteerDetail',
          component: () =>
            import('@/views/volunteer/recruit/VolunteerDetailView.vue'),
          props: true,
        },
        {
          // Volunteer review detail
          path: 'review/:id',
          name: 'VolunteerReviewDetail',
          component: () =>
            import('@/views/volunteer/review/VolunteerReviewDetailView.vue'),
          props: true,
        },
        {
          // Volunteer review write
          path: 'review/insert',
          name: 'VolunteerReviewInsert',
          component: () =>
            import('@/views/volunteer/review/VolunteerReviewInsertView.vue'),
        },
      ],
    },

    // Donation board list
    {
      path: '/donation',
      name: 'donation',
      component: DonationView,
    },

    // Donation detail
    {
      path: '/donation/:id',
      name: 'donation-detail',
      component: DonationDetailView,
      props: true,
    },
    //후원게시판 글작성
    {
      path: '/donation/write',
      name: 'donation.write',
      component: DonationWrite,
    },

    // Adoption board list
    {
      path: '/adoption',
      name: 'adoption',
      component: AdoptionView,
    },

    // Adoption detail
    {
      path: '/adoption-post/:id',
      name: 'adoptionDetail',
      component: () =>
        import('@/views/adoption/AdoptionDetail.vue'),
      props: true,
    },

    // Adoption write
    {
      path: '/adoption/write',
      name: 'AdoptionWrite',
      component: AdoptionWrite,
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
      component: SightingView,
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
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesrankingView,
    },

    // footer / policy / guide pages
    {
      path: '/about',
      component: AboutView,
    },
    {
      path: '/terms',
      component: TermsView,
    },
    {
      path: '/privacy',
      component: PrivacyView,
    },
    {
      path: '/community-guide',
      component: CommunityGuideView,
    },
    {
      path: '/adoption-process',
      component: AdoptionProcessView,
    },
    {
      path: '/volunteer-guide',
      component: VolunteerGuideView,
    },
    {
      path: '/faq',
      component: FaqView,
    },

    // ✅ User MyPage
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
    {
      path: '/mypage/edit',
      name: 'mypage-edit',
      component: UserEdit,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/mypage/messages',
      name: 'mypage-messages',
      component: UserMessages,
      meta: { requiresAuth: true }
    },

    // // ✅ Shelter MyPage
    // {
    //   path: '/shelter-head/mypage',
    //   name: 'shelter-mypage',
    //   component: ShelterheadMypageView,
    //   meta: { requiresAuth: true, role: 'shelter' }
    // },

    // shelter head mypage
    {
      path: '/shelter-head/mypage',
      component: ShelterheadMypageView,
      children: [
        {
          path: 'recruitinsert',
          name: 'VolunteerRecruitInsert',
          component: () =>
            import('@/views/volunteer/recruit/VolunteerRecruitInsertView.vue'),
        },
        {
          path: 'applicants',
          name: 'ShelterApplicants',
          component: ApplicantsView,
        },
      ],
    },

    // src/router/index.js
    { path: '/auth/find-id', name: 'find.id', component: () => import('@/views/auth/findIdView.vue') },
    { path: '/auth/find-password', name: 'find.password.request', component: () => import('@/views/auth/findPasswordRequestView.vue') },
    { path: '/auth/find-password/verify', name: 'find.password.verify', component: () => import('@/views/auth/findPasswordVerifyView.vue') },
    { path: '/auth/find-password/reset', name: 'find.password.reset', component: () => import('@/views/auth/findPasswordResetView.vue') },




    // ===== duplicated routes (kept to match existing structure) =====
    { path: '/post', name: 'post', component: PostView },
    { path: '/post/write', name: 'post.write', component: PostWriteView },
    { path: '/post/:id', name: 'post.detail', component: PostDetailView, props: true },

    { path: '/post.write', redirect: { name: 'post.write' } },
    { path: '/about', component: AboutView },
    { path: '/terms', component: TermsView },
    { path: '/privacy', component: PrivacyView },
    { path: '/community-guide', component: CommunityGuideView },
    { path: '/adoption-process', component: AdoptionProcessView },
    { path: '/volunteer-guide', component: VolunteerGuideView },
    { path: '/faq', component: FaqView },

    // {

    //   path: '/volunteer/detail/:id',
    //   name: 'volunteer-detail',
    //   component: () => import('@/views/volunteer/VolunteerDetailView.vue'),
    //   props: true, // <== 이거 있으면 route params를 props로 받을 수 있음
    // },
    {
      path: '/shelter-head/mypage',                 // 보호소장 마이페이지 라우팅 (중복 선언 존중)

      component: ShelterheadMypageView,
      children: [
        {
          path: 'recruitinsert',
          name: 'VolunteerRecruitInsert',
          component: () => import('@/views/volunteer/recruit/VolunteerRecruitInsertView.vue')
        },
        {
          path: 'applicants',
          name: 'ShelterApplicants',
          component: ApplicantsView,
        }
      ]
    },
        {
      path: '/admin',
      name: 'admin',
      component: AdminPageView,
      meta: { requiresAdmin: true },
    },


    //   // login test screen (kept for reference)
    //   {
    //     path: '/login',
    //     name: 'login',
    //     component: LoginPlaceholderView,
    //   },
    // ],
    // 404 → home
    { path: '/:pathMatch(.*)*', redirect: '/' },


  ],
  // always scroll to top on route change
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAdmin) {
    const role = localStorage.getItem('role')
    if (role === 'ADMIN') return next()
    return next({ name: 'login' })
  }
  next()
})

export default router