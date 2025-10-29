<!-- 이용약관 -->
<template>
  <section class="terms-page">
    <div class="terms-inner">
      <!-- ===== 목차 (왼쪽 사이드) ===== -->
      <aside class="terms-aside">
        <nav class="toc">
          <h2 class="toc-head">목차</h2>
          <ul class="toc-list">
            <li
              v-for="item in tocItems"
              :key="item.id"
            >
              <button
                class="toc-link"
                :class="{ active: activeSection === item.id }"
                @click="goTo(item.id)"
              >
                {{ item.label }}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- ===== 본문 ===== -->
      <main class="terms-content">
    
        <header class="intro-card">
          <h1 class="page-title">이용약관</h1>
          <p class="page-desc">
            댕냥쉼터는 유기·길동물(길에서 생활 중인 동물 포함)을 사랑하는 사람들이
            모여 책임 있는 입양과 따뜻한 보호 문화를 만들고,
            구조/목격 제보가 빠르게 전달될 수 있도록 돕는 커뮤니티입니다.
            본 약관은 서비스 이용자가 안전하고 신뢰 가능한 환경에서 활동할 수 있도록,
            서비스 사용 조건, 회원의 의무, 게시물 관리 원칙 등을 규정합니다.
          </p>
          <p class="page-desc sub">
            약관은 실제 서비스 운영 상황에 맞춰 개선될 수 있으며,
            변경 사항은 서비스 내 공지 또는 알림을 통해 사전 안내됩니다.
          </p>
        </header>

        <!-- ====================== 조항들 ====================== -->

        <!-- 제1조 -->
        <section
          id="article-1"
          class="article-card"
          data-id="article-1"
        >
          <h2 class="article-title">제1조 (목적)</h2>
          <p class="article-body">
            이 약관은 "댕냥쉼터" 서비스의 이용 조건 및 절차, 회원과 운영자의 권리 및
            의무, 책임 사항을 규정함을 목적으로 합니다.
          </p>
          <p class="article-body">
            특히, 본 서비스는 실종/목격 제보, 입양 연계, 자원봉사 및 후원 활동 등
            반려동물을 둘러싼 다양한 보호 행위가 실제로 이어질 수 있도록 돕는 것을
            핵심 가치로 합니다. 이 가치를 훼손하거나 타 이용자에게 피해를 주는 행위에
            대해서는 운영 정책에 따라 제한이 있을 수 있습니다.
          </p>
        </section>

        <!-- 제2조 -->
        <section
          id="article-2"
          class="article-card"
          data-id="article-2"
        >
          <h2 class="article-title">제2조 (정의)</h2>
          <ul class="list-body">
            <li>
              <strong>"서비스"</strong>란 댕냥쉼터에서 제공하는 웹/모바일 화면,
              게시판, 커뮤니티, 메신저 등 모든 기능을 의미합니다.
            </li>
            <li>
              <strong>"회원"</strong>이란 약관에 동의하고 가입한 이용자를 말합니다.
            </li>
            <li>
              <strong>"게시물"</strong>이란 회원이 서비스에 등록한 글, 사진, 댓글,
              위치 정보, 구조/실종 제보 등의 모든 컨텐츠를 의미합니다.
            </li>
            <li>
              <strong>"보호소 계정 / 단체 계정"</strong>은 실제 보호소나 단체가
              등록/인증하여 운영하는 계정을 말하며, 일반 회원과는 별도의
              책임·관리 기준이 적용될 수 있습니다.
            </li>
          </ul>
        </section>

        <!-- 제3조 -->
        <section
          id="article-3"
          class="article-card"
          data-id="article-3"
        >
          <h2 class="article-title">제3조 (약관의 효력 및 변경)</h2>
          <ul class="list-body">
            <li>본 약관은 서비스 화면에 게시하거나 기타 방식으로 공지함으로써 효력이 발생합니다.</li>
            <li>
              운영자는 필요한 경우 서비스 개선을 위해 약관을 변경할 수 있으며,
              중요한 내용(예: 개인정보 활용 범위, 게시물 공개 범위 등)이 바뀌는 경우
              합리적인 기간 전에 공지합니다.
            </li>
            <li>
              회원이 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고
              회원 탈퇴를 요청할 수 있습니다. 변경 이후에도 계속 이용하는 경우,
              변경된 약관에 동의한 것으로 간주됩니다.
            </li>
          </ul>
        </section>

        <!-- 제4조 -->
        <section
          id="article-4"
          class="article-card"
          data-id="article-4"
        >
          <h2 class="article-title">제4조 (회원가입 및 계정관리)</h2>
          <ul class="list-body">
            <li>
              회원가입은 실제 연락 가능한 이메일(또는 기타 인증 수단)을 통해 진행되며,
              타인의 명의나 허위 정보로 가입할 수 없습니다.
            </li>
            <li>
              회원은 자신의 계정을 직접 관리할 책임이 있으며,
              계정 보안(비밀번호 관리 포함)에 대한 책임은 회원 본인에게 있습니다.
            </li>
            <li>
              보호소/기관 등 단체 계정은 별도 인증 절차를 거칠 수 있으며,
              허위로 기관을 사칭할 경우 운영진에 의해 사전 통보 없이 계정이 제한될 수 있습니다.
            </li>
            <li>
              회원은 운영 정책을 반복적으로 위반하거나 타인/동물에게 피해를 유발할 경우
              서비스 이용이 제한될 수 있습니다.
            </li>
          </ul>
        </section>

        <!-- 제5조 -->
        <section
          id="article-5"
          class="article-card"
          data-id="article-5"
        >
          <h2 class="article-title">제5조 (서비스의 이용)</h2>
          <ul class="list-body">
            <li>서비스는 원칙적으로 무료로 제공됩니다. 다만 특정 기능은 추후 별도 고지 후 유료화될 수 있습니다.</li>
            <li>운영상 또는 기술상의 필요에 따라 일부 서비스가 일시 중단될 수 있습니다.</li>
            <li>
              긴급 공지(예: 실종 동물 실시간 제보 등)나 신고 대응 등
              안전을 위한 판단이 필요한 경우, 운영자는
              필요한 범위에서 게시물을 우선 노출하거나 전달할 수 있습니다.
            </li>
            <li>
              반대로, 사기성 모금/입양 브로커 행위 등
              타 이용자에게 피해가 우려되는 게시물은 사전 통보 없이 노출이 제한되거나 삭제될 수 있습니다.
            </li>
          </ul>
        </section>

        <!-- 제6조 -->
        <section
          id="article-6"
          class="article-card"
          data-id="article-6"
        >
          <h2 class="article-title">제6조 (게시물의 관리 및 책임)</h2>
          <ul class="list-body">
            <li>
              게시물의 책임은 작성자에게 있습니다. 작성자는 제보/입양/후원 등
              사실과 다른 정보를 올리지 않도록 주의해야 하며,
              타인(또는 단체)의 연락처나 개인정보를 제3자 동의 없이 공개해서는 안 됩니다.
            </li>
            <li>
              운영자는 커뮤니티의 안전과 신뢰를 위해,
              다음과 같은 게시물에 대해 임시 차단, 비공개 전환, 수정 요청,
              혹은 삭제 조치를 할 수 있습니다.
              <ul class="list-body nested">
                <li>허위 사실 유포 또는 금전적 피해 유도(사칭 모금 등)</li>
                <li>도움이 필요한 동물을 이용한 과도한 자극성/학대성 표현</li>
                <li>반려동물 거래/분양 알선 등 법령 또는 운영 정책에 위배되는 내용</li>
                <li>특정인에 대한 비방, 모욕, 개인정보 노출(전화번호/주소 등)</li>
              </ul>
            </li>
            <li>
              게시물을 작성/업로드한 시점부터 해당 게시물은 서비스 운영 및 홍보,
              구조/입양 연결, 안전 고지 등의 목적으로
              일정 범위 안에서 복제/저장/노출될 수 있습니다.
              (예: 실종 동물 공지를 SNS에 공유, 제보 내용을 유관 보호소에 전달 등)
              단, 상업적 광고 목적으로 무단 판매/재가공하는 일은 없습니다.
            </li>
          </ul>
        </section>

        <!-- 제7조 -->
        <section
          id="article-7"
          class="article-card"
          data-id="article-7"
        >
          <h2 class="article-title">제7조 (개인정보 보호 및 유출 방지)</h2>
          <ul class="list-body">
            <li>
              운영자는 관련 법령과 내부 정책에 따라 개인정보를 안전하게 보관·관리하며,
              개인정보 처리에 관한 보다 상세한 내용은
              별도의 「개인정보 처리방침」에서 안내합니다.
            </li>
            <li>
              회원은 게시물 작성 시 제3자의 개인정보(전화번호, 주소 등)를
              동의 없이 공개할 수 없으며, 이를 위반할 경우 법적 책임은 게시자 본인에게 있습니다.
            </li>
            <li>
              플랫폼 내에서 알게 된 타 회원의 개인정보를
              무단으로 수집/저장/스팸 연락 등에 활용하는 것은 금지됩니다.
            </li>
          </ul>
        </section>

        <!-- 제8조 -->
        <section
          id="article-8"
          class="article-card"
          data-id="article-8"
        >
          <h2 class="article-title">제8조 (권리·의무 및 면책)</h2>
          <ul class="list-body">
            <li>
              회원은 타인(또는 단체)을 사칭하거나 허위 사실을 유포해서는 안 되며,
              구조/입양/후원과 같이 실제 금전·책임이 수반되는 영역에서는
              가능한 정확하고 검증 가능한 정보를 제공해야 합니다.
            </li>
            <li>
              운영자는 회원 간 직접 발생한 분쟁(입양 약속 파기, 개인 간 금전거래 등)에
              개입하지 않는 것을 원칙으로 하나,
              커뮤니티 안전을 현저히 침해한다고 판단되는 경우
              제한적으로 중재 또는 이용 제한 조치를 취할 수 있습니다.
            </li>
            <li>
              천재지변, 시스템 장애, 통신사 사정 등 불가항력으로 서비스 제공이 어려운 경우,
              이에 대한 책임은 제한될 수 있습니다.
            </li>
          </ul>
        </section>

        <!-- 제9조 -->
        <section
          id="article-9"
          class="article-card"
          data-id="article-9"
        >
          <h2 class="article-title">제9조 (약관의 준거법 및 분쟁해결)</h2>
          <ul class="list-body">
            <li>
              본 약관은 대한민국 법을 기준으로 해석됩니다.
            </li>
            <li>
              서비스 이용과 관련하여 운영자와 회원 사이에 이견이 발생할 경우
              상호 협의를 우선하며,
              협의로 해결되지 않는 분쟁은 관련 법령에 따른 절차 및 관할 기관을 통해
              처리합니다.
            </li>
          </ul>
          <p class="last-updated">
            본 약관은 서비스 안정화 과정에서 지속적으로 보완될 수 있습니다.
            반드시 최신 약관 내용을 확인해 주세요.
          </p>
        </section>
      </main>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TermsView',
  data() {
    return {
      tocItems: [
        { id: 'article-1', label: '제1조 (목적)' },
        { id: 'article-2', label: '제2조 (정의)' },
        { id: 'article-3', label: '제3조 (약관의 효력 및 변경)' },
        { id: 'article-4', label: '제4조 (회원가입 및 계정관리)' },
        { id: 'article-5', label: '제5조 (서비스의 이용)' },
        { id: 'article-6', label: '제6조 (게시물의 관리 및 책임)' },
        { id: 'article-7', label: '제7조 (개인정보 보호 및 유출 방지)' },
        { id: 'article-8', label: '제8조 (권리·의무 및 면책)' },
        { id: 'article-9', label: '제9조 (준거법 및 분쟁해결)' },
      ],
      activeSection: 'article-1',
      observer: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      const options = {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0,
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id')
            if (id) {
              this.activeSection = id
            }
          }
        })
      }, options)

      const sections = this.$el.querySelectorAll('[data-id]')
      sections.forEach((secEl) => {
        if (secEl) this.observer.observe(secEl)
      })
    })
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  },
  methods: {
    goTo(id) {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }
}
</script>

<style scoped>

:root {
  --page-bg: #efe8dd;            
  --panel-bg: #fff8ef;           
  --panel-border: rgba(0, 0, 0, 0.05);
  --text-main: #2a1c10;          
  --text-dim: rgba(42, 28, 16, 0.7);
  --accent-bg: #f5d8a4;        
  --accent-border: #c9a569;
  --accent-text: #2a1c10;
  --radius-lg: 10px;
  --radius-md: 8px;
  --radius-sm: 6px;
  --shadow-soft: 0 12px 30px rgba(0, 0, 0, 0.06);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.04);
  --font-title: 600;
  --font-strong: 600;
}


.terms-page {
  background-color: var(--page-bg);
  color: var(--text-main);
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 16px 40px;
  line-height: 1.5;
  font-size: 15px;
}

.terms-inner {
  width: 100%;
  max-width: 1280px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  position: relative;
}


.terms-aside {
  position: relative;
  position: sticky;
  top: 24px;
  align-self: flex-start;
}

.toc {
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 16px 16px 8px;
  min-height: 200px;
  
}

.toc-head {
  font-size: 14px;
  font-weight: var(--font-title);
  color: var(--text-main);
  margin-bottom: 12px;
}

.toc-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  margin: 0;
}

.toc-link {
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text-main);
  transition: all 0.15s ease;
  border: 1px solid transparent;
  word-break: keep-all;
  text-decoration: none;
}

.toc-link:hover {
  background-color: var(--accent-bg);
  border-color: var(--accent-border);
  color: var(--accent-text);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.toc-link.active {
  background-color: var(--accent-bg);
  border: 1px solid var(--accent-border);
  color: var(--accent-text);
  font-weight: var(--font-strong);
}


.terms-content {
      font-family: "Pretendard", "Noto Sans KR", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue",
    Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 24px;
}


.intro-card {
  background: var(--panel-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--panel-border);
  box-shadow: var(--shadow-soft);
  padding: 20px 24px 24px;
}

.page-title {
  font-size: 20px;
  line-height: 1.3;
  font-weight: var(--font-title);
  color: var(--text-main);
  margin-bottom: 12px;
}

.page-desc {
  color: var(--text-dim);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 6px;
  word-break: keep-all;
}

.page-desc.sub {
  font-size: 13px;
  line-height: 1.5;
  color: rgba(42, 28, 16, 0.6);
}


.article-card {
  background: var(--panel-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--panel-border);
  box-shadow: var(--shadow-card);
  padding: 20px 24px 24px;
}

.article-title {
  font-size: 16px;
  font-weight: var(--font-title);
  line-height: 1.4;
  margin-bottom: 12px;
  color: var(--text-main);
}

.article-body {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-main);
  word-break: keep-all;
  margin-bottom: 10px;
}


.list-body {
  padding-left: 16px;
  margin: 0;
  display: grid;
  row-gap: 8px;
  font-size: 14px;
  color: var(--text-main);
}

.list-body > li {
  position: relative;
  list-style: none;
  line-height: 1.5;
  word-break: keep-all;
  font-size: 14px;
  color: var(--text-main);
  background-repeat: no-repeat;
}

.list-body > li strong {
  font-weight: var(--font-strong);
  color: var(--text-main);
}


.list-body.nested {
  padding-left: 16px;
  font-size: 13px;
  row-gap: 6px;
  color: var(--text-main);
}


.last-updated {
  font-size: 12px;
  color: rgba(42, 28, 16, 0.55);
  line-height: 1.4;
  margin-top: 16px;
}


@media (max-width: 900px) {
  .terms-inner {
    grid-template-columns: 1fr;
  }

  .terms-aside {
    position: relative;
    top: 0;
    order: 2;
  }

  .terms-content {
    order: 1;
  }

  .toc {
    position: relative;
    top: 0;
    box-shadow: none;
    border-radius: var(--radius-md);
    border: 1px solid var(--panel-border);
    background: transparent;
    padding: 12px;
  }

  .toc-head {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .toc-link {
    font-size: 13px;
    padding: 6px 8px;
  }
}
</style>