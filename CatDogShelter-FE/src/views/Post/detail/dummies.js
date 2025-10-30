// src/views/post/detail/dummies.js

// 이미지 자동 로딩(../image 폴더)
// 예: 33-1.jpg, 33-2.jpg ...
const glob = import.meta.glob('../image/*', { eager: true })
const IMG = {}
for (const [path, mod] of Object.entries(glob)) {
  const file = path.split('/').pop()
  IMG[file] = mod.default || mod
}
function imagesFor(id, max = 8) {
  const out = []
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  for (let i = 1; i <= max; i++) {
    let found = null
    for (const ext of exts) {
      const name = `${id}-${i}.${ext}`
      if (IMG[name]) { found = IMG[name]; break }
    }
    if (!found) break
    out.push(found)
  }
  return out
}

const pad2 = (n) => String(n).padStart(2, '0')
const toYMD = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`

// ───────────────────────────────────────────────────────────────
// 1) 24~33: 기존 10개 더미 (작성 내용 유지)
//    날짜: 24가 최신(2025-10-10) → 33이 가장 오래(2025-10-01)
const RAW_24_33 = [
  { id: 33, category: '강아지', title: '우리집 강아지 산책 코스 추천', author: '박지수',  date: '2025-10-01',
    content: [
      '우리 동네 산책 코스를 공유합니다. 그늘과 물 있는 코스를 위주로 다녀요.',
      '초보 보호자분들께도 부담 없는 평지 루트가 좋아요.'
    ],
  },
  { id: 32, category: '강아지', title: '강아지 리드줄 추천 부탁해요',   author: '김민준',  date: '2025-10-02',
    content: [
      '처음 쓰는 리드줄이라 길이/소재가 고민입니다.',
      '경험담과 제품 추천 부탁드려요!'
    ],
  },
  { id: 31, category: '강아지', title: '강아지 배변패드 뭐가 좋아요?',   author: '이서연',  date: '2025-10-03',
    content: [
      '흡수력/탈취 잘 되는 제품 위주로 찾고 있어요.',
      '가성비 제품도 추천 환영!'
    ],
  },
  { id: 30, category: '강아지', title: '강아지 사회화 팁 모음',       author: '정다훈',  date: '2025-10-04',
    content: [
      '낯선 환경 적응시키는 법, 산책 예절, 다른 견과의 인사 등 체크리스트 정리했습니다.'
    ],
  },
  { id: 29, category: '강아지', title: '겨울 산책 복장 추천',         author: '최수빈',  date: '2025-10-05',
    content: [
      '보온성 좋은 하네스/방한 조끼 추천받습니다.',
      '발바닥 보호를 위한 부츠도 고민 중이에요.'
    ],
  },
  { id: 28, category: '강아지', title: '첫 목욕 생존기 공유',          author: '오슬기',  date: '2025-10-06',
    content: [
      '샴푸부터 말리기까지 첫 목욕하며 배운 꿀팁을 정리했어요.'
    ],
  },
  { id: 27, category: '강아지', title: '사료 바꾸고 설사 멈췄어요',     author: '류하늘',  date: '2025-10-07',
    content: [
      '알레르기 의심으로 사료를 바꿨더니 확실히 나아졌습니다.',
      '천천히 전환하는 게 포인트였어요.'
    ],
  },
  { id: 26, category: '강아지', title: '하네스 vs 목줄 뭐 쓰세요?',     author: '윤태호',  date: '2025-10-08',
    content: [
      '각각 장단점이 궁금합니다. 초보에게는 어떤 게 더 나을까요?'
    ],
  },
  { id: 25, category: '강아지', title: '강아지 치석 관리 어떻게?',       author: '고예린',  date: '2025-10-09',
    content: [
      '덴탈껌/칫솔/스케일링 중에 현실적으로 꾸준히 하기 좋은 방법이 뭘까요?'
    ],
  },
  { id: 24, category: '고양이', title: '고양이 간식 추천 받아요',       author: '한지훈',  date: '2025-10-10',
    content: [
      '저알레르기/저지방 간식 위주로 추천 부탁드립니다.',
      '선호/비선호 성분도 알려주세요.'
    ],
  },
]

// ───────────────────────────────────────────────────────────────
// 2) 23~2: 새로 채운 22개 더미(첫 페이지와 겹치지 않는 내용)
//    날짜: 23이 2025-09-30 → 2가 2025-09-09 (하루씩 -1)
const RAW_2_23 = [
  { id: 23, category: '강아지', title: '겨울철 털관리 체크리스트', author: '박성민', date: '2025-09-30',
    content: [
      '첫 추위가 오기 전에 빗질 주기를 주 3회로 올렸고, 털엉킴 방지 스프레이를 바꿨다.',
      '산책 후 드라잉 시간은 10분 내로. 발바닥 사이도 꼭 말려주니 피부 트러블이 줄었다.'
    ],
    stats: { views: 62, likes: 7, comments: 1 },
    comments: [{ id: 2301, author: '오슬기', createdAt: '2025-09-30 12:10', text: '체크리스트 공유 감사합니다!' }]
  },
  { id: 22, category: '고양이', title: '모래 갈아주는 주기, 이렇게 하니 편해짐', author: '임가현', date: '2025-09-29',
    content: [
      '전량 교체는 2주, 보충은 이틀에 한 번으로 고정.',
      '탈취제 최소화 + 통풍/일광으로 냄새 스트레스가 확 줄었다.'
    ],
    stats: { views: 45, likes: 6, comments: 2 },
    comments: [
      { id: 2201, author: '정해빈', createdAt: '2025-09-29 09:23', text: '보충 주기 참고할게요!' },
      { id: 2202, author: '노지훈', createdAt: '2025-09-29 11:47', text: '일광 진짜 중요… 동감합니다.' }
    ]
  },
  { id: 21, category: '강아지', title: '배변 실수 되돌이 해결 로그', author: '차유진', date: '2025-09-28',
    content: [
      '환경 변화로 실수가 늘어 재학습 루틴을 만들었다.',
      '성공 때마다 즉시 보상, 실수는 조용히 치우기. 5일차부터 성공률 상승.'
    ],
    stats: { views: 71, likes: 8, comments: 1 },
    comments: [{ id: 2101, author: '김민준', createdAt: '2025-09-28 20:31', text: '루틴 참고해서 저도 재도전!' }]
  },
  { id: 20, category: '고양이', title: '장난감 로테이션 실험: 흥미 유지', author: '문채원', date: '2025-09-27',
    content: [
      '장난감 7개를 3일 간격으로 돌려 사용.',
      '반응 없는 장난감은 숨겨두었다가 2주 뒤 꺼내면 관심이 부활.'
    ],
    stats: { views: 39, likes: 5, comments: 0 },
    comments: []
  },
  { id: 19, category: '강아지', title: '리액티브 견 대처 루틴(마주치기 훈련)', author: '최수빈', date: '2025-09-26',
    content: [
      '먼거리 관찰 → 이름 부르면 시선 전환 → 보상. 반응 전에 끊어주는 게 핵심.',
      '3주차부터 같은 코스에서 짖음이 절반 이하로 감소.'
    ],
    stats: { views: 84, likes: 11, comments: 2 },
    comments: [
      { id: 1901, author: '정다훈', createdAt: '2025-09-26 19:30', text: '타이밍 잡는 게 어렵더라고요.' },
      { id: 1902, author: '윤태호', createdAt: '2025-09-26 20:41', text: '기록 감사합니다. 따라 해볼게요!' }
    ]
  },
  { id: 18, category: '고양이', title: '창틀 해먹 DIY 재료/도면 공유', author: '배도윤', date: '2025-09-25',
    content: [
      '흡착컵 4개, 패브릭 1장, PVC 파이프만으로도 충분히 튼튼.',
      '일광욕 스팟 생기고 낮잠 시간이 길어졌다.'
    ],
    stats: { views: 57, likes: 9, comments: 3 },
    comments: [
      { id: 1801, author: '고예린', createdAt: '2025-09-25 15:01', text: '도면 PDF 부탁드려요!' },
      { id: 1802, author: '임가현', createdAt: '2025-09-25 18:23', text: '우리 집 창틀에도 딱이네요.' },
      { id: 1803, author: '한지훈', createdAt: '2025-09-25 19:02', text: '흡착컵은 어떤 제품 쓰셨나요?' }
    ]
  },
  { id: 17, category: '강아지', title: '칫솔/치약 바꾸고 치석 케어 정착', author: '윤태호', date: '2025-09-24',
    content: [
      '실리콘 핑거브러시 → 소프트 브러시 순으로 적응시키니 거부감이 줄었다.',
      '건식 간식 줄이고 물 섭취 늘린 게 치석 줄이는 데 한몫.'
    ],
    stats: { views: 66, likes: 10, comments: 1 },
    comments: [{ id: 1701, author: '류하늘', createdAt: '2025-09-24 22:10', text: '순서가 포인트였군요!' }]
  },
  { id: 16, category: '고양이', title: '헤어볼 줄이는 간식/놀이 조합', author: '서우진', date: '2025-09-23',
    content: [
      '브러싱 전 캣그래스 조금, 끝나고 수분 많은 간식. 소량이라도 꾸준히.',
      '토 횟수가 월 4회 → 1회로 감소.'
    ],
    stats: { views: 59, likes: 8, comments: 0 },
    comments: []
  },
  { id: 15, category: '강아지', title: '노견 관절 보조제 3종 비교', author: '정해빈', date: '2025-09-22',
    content: [
      '글루코사민/콘드로이틴/초록입홍합 성분 위주 비교.',
      '산책 후 절뚝임이 덜해졌고 스트레칭도 길어졌다.'
    ],
    stats: { views: 73, likes: 12, comments: 2 },
    comments: [
      { id: 1501, author: '박지수', createdAt: '2025-09-22 21:40', text: '브랜드 명도 알려주세요!' },
      { id: 1502, author: '이서연', createdAt: '2025-09-22 23:15', text: '초록입홍합 저도 체감 있었어요.' }
    ]
  },
  { id: 14, category: '고양이', title: '자동급식기 스케줄 최적화', author: '고예린', date: '2025-09-21',
    content: [
      '야식 타이밍을 23:30 → 22:40으로 당기니 새벽 기상이 사라졌다.',
      '양은 유지하고 시간만 조절.'
    ],
    stats: { views: 52, likes: 7, comments: 0 },
    comments: []
  },
  { id: 13, category: '강아지', title: '비 오는 날 실내 놀이 12가지', author: '오슬기', date: '2025-09-20',
    content: [
      '노즈워크 매트, 수건 당기기, 타겟터치 게임이 체력 소모에 좋았다.',
      '짧게 여러 세트로 쪼개면 지루함이 줄어든다.'
    ],
    stats: { views: 81, likes: 13, comments: 1 },
    comments: [{ id: 1301, author: '정다훈', createdAt: '2025-09-20 18:12', text: '타겟터치 꿀팁 얻어갑니다.' }]
  },
  { id: 12, category: '고양이', title: '스크래처 위치 바꿔본 후기', author: '노지훈', date: '2025-09-19',
    content: [
      '창가 옆 → 캣타워 아래로 옮기니 사용 빈도가 확 올랐다.',
      '동선에 걸리게 두는 게 포인트.'
    ],
    stats: { views: 34, likes: 4, comments: 0 },
    comments: []
  },
  { id: 11, category: '강아지', title: '분리불안 저녁 루틴 기록', author: '박지수', date: '2025-09-18',
    content: [
      '저녁 산책 후 10분 안정화 → 퍼즐 급여 → 조용한 무시 타임.',
      '예고 신호와 귀가 루틴이 일정해지니 울음이 줄었다.'
    ],
    stats: { views: 68, likes: 9, comments: 2 },
    comments: [
      { id: 1101, author: '김민준', createdAt: '2025-09-18 21:03', text: '루틴 정리 최고입니다.' },
      { id: 1102, author: '류하늘', createdAt: '2025-09-18 23:10', text: '퍼즐 급여 바로 적용!' }
    ]
  },
  { id: 10, category: '고양이', title: '중성화 후 회복 케어 메모', author: '정다훈', date: '2025-09-17',
    content: [
      '1~2일차 넥카라 필수, 화장실 턱 낮춰주니 편해했다.',
      '체온 체크와 수분 섭취 기록만 해도 안심.'
    ],
    stats: { views: 55, likes: 8, comments: 1 },
    comments: [{ id: 1001, author: '서우진', createdAt: '2025-09-17 20:18', text: '체크리스트 저장했습니다.' }]
  },
  { id: 9, category: '강아지', title: '알레르기 의심 식품 체크리스트', author: '이서연', date: '2025-09-16',
    content: [
      '단백질 소스는 한 번에 하나씩, 2주 간격으로 변경하며 반응 기록.',
      '간식은 성분 단순한 것으로 바꾸니 가려움이 진정.'
    ],
    stats: { views: 91, likes: 14, comments: 3 },
    comments: [
      { id: 901, author: '정해빈', createdAt: '2025-09-16 14:51', text: '기록지가 핵심이네요.' },
      { id: 902, author: '오슬기', createdAt: '2025-09-16 19:33', text: '경험 공유 감사합니다!' },
      { id: 903, author: '차유진', createdAt: '2025-09-16 22:05', text: '저도 시도해봅니다.' }
    ]
  },
  { id: 8, category: '고양이', title: '물을 더 마시게 하는 작은 변화', author: '정해빈', date: '2025-09-15',
    content: [
      '식기 3개 분산 배치, 그릇은 얕게. 물 온도는 미지근하게.',
      '하루 섭취량이 평균 20~30ml 증가.'
    ],
    stats: { views: 41, likes: 5, comments: 0 },
    comments: []
  },
  { id: 7, category: '강아지', title: '하네스 사이즈 다시 맞추니 산책이 편해짐', author: '한지훈', date: '2025-09-14',
    content: [
      '어깨 앞부분 눌리지 않도록 두께감 있는 타입으로 교체.',
      '밀림 없이 고정되니 끌어당김이 줄었다.'
    ],
    stats: { views: 63, likes: 10, comments: 1 },
    comments: [{ id: 701, author: '윤태호', createdAt: '2025-09-14 21:40', text: '리드줄 길이도 같이 조절하니 확 달라지더라고요.' }]
  },
  { id: 6, category: '고양이', title: '다묘 합사 2주차 진도 공유', author: '임가현', date: '2025-09-13',
    content: [
      '문틈 냄새 교환 → 동시 식사 → 펜스 너머 놀이까지 진행.',
      '캣닢 없이도 서로 코인사 가능한 수준까지 도달.'
    ],
    stats: { views: 76, likes: 12, comments: 2 },
    comments: [
      { id: 601, author: '문채원', createdAt: '2025-09-13 15:12', text: '단계별 정리 최고예요.' },
      { id: 602, author: '배도윤', createdAt: '2025-09-13 18:27', text: '우리 집도 곧… 용기 얻고 갑니다.' }
    ]
  },
  { id: 5, category: '강아지', title: '발톱 깎기 실패/성공 비교 기록', author: '류하늘', date: '2025-09-12',
    content: [
      '실패: 한 번에 길들이려다 긴장만 높아짐.',
      '성공: 하루 1발가락, 맛보상 크게. 한 달 만에 전부 편하게 가능.'
    ],
    stats: { views: 48, likes: 7, comments: 0 },
    comments: []
  },
  { id: 4, category: '고양이', title: '캣닢 반응 테스트 결과 공유', author: '고예린', date: '2025-09-11',
    content: [
      '건조 잎 → 반응 보통, 스프레이형 → 반응 최고.',
      '반응 없는 친구는 실버바인으로 대체해서 반응 확인.'
    ],
    stats: { views: 53, likes: 9, comments: 1 },
    comments: [{ id: 401, author: '정다훈', createdAt: '2025-09-11 20:44', text: '실버바인 꿀팁 고맙습니다.' }]
  },
  { id: 3, category: '강아지', title: '초보 보호자에게 도움 된 앱/사이트', author: '김민준', date: '2025-09-10',
    content: [
      '접종 스케줄 앱, 산책 기록 앱, 증상 체크 사이트를 모아봤다.',
      '광고 적은 서비스 위주로 골라서 스트레스가 덜했다.'
    ],
    stats: { views: 69, likes: 8, comments: 2 },
    comments: [
      { id: 301, author: '박지수', createdAt: '2025-09-10 11:22', text: '정리 감사합니다!' },
      { id: 302, author: '이서연', createdAt: '2025-09-10 21:19', text: '저도 써보고 후기 남길게요.' }
    ]
  },
  { id: 2, category: '고양이', title: '냥줍 준비 체크리스트(필수/선택)', author: '노지훈', date: '2025-09-09',
    content: [
      '케이지, 담요, 웻푸드, 웨트티슈, 휴대용 화장실까지 챙기니 안정감이 달랐다.',
      '24시 병원 위치와 이동 경로를 미리 저장해두자.'
    ],
    stats: { views: 77, likes: 15, comments: 4 },
    comments: [
      { id: 201, author: '임가현', createdAt: '2025-09-09 08:42', text: '체크리스트 저장했어요!' },
      { id: 202, author: '정해빈', createdAt: '2025-09-09 10:10', text: '필수/선택 나눈 게 좋네요.' },
      { id: 203, author: '서우진', createdAt: '2025-09-09 13:55', text: '이동 경로 미리보기 꿀팁!' },
      { id: 204, author: '문채원', createdAt: '2025-09-09 18:02', text: '도움 많이 됐습니다 🙏' }
    ]
  },
]

// ───────────────────────────────────────────────────────────────
// 상세 객체 빌더
const makeDetail = (r) => {
  const imgs = imagesFor(r.id)
  return {
    id: r.id,
    board: 'free',
    title: r.title || '',
    category: r.category || '',
    author: { name: typeof r.author === 'string' ? r.author : (r.author?.name || '') },
    date: r.date || '2025-09-30',
    stats: {
      views: r.stats?.views ?? 0,
      likes: r.stats?.likes ?? 0,
      comments: r.stats?.comments ?? (Array.isArray(r.comments) ? r.comments.length : 0),
    },
    images: imgs.map((src, i) => ({ src, alt: `${r.title || '이미지'} ${i + 1}` })),
    content: Array.isArray(r.content) ? r.content : [],
    prev: null, next: null,
    comments: Array.isArray(r.comments) ? r.comments : [],
    attachments: [],
    tags: [],
  }
}

// ───────────────────────────────────────────────────────────────
// 3) MAP 빌드: 24~33 실제 더미 + 23~2 실제 더미
const MAP = new Map()
for (const r of RAW_24_33.concat(RAW_2_23)) MAP.set(r.id, makeDetail(r))

// (혹시 빠진 id가 있다면) placeholder 보충 — 기본은 2025-09-30부터 하루씩 감소
function placeholderFor(id) {
  const base = new Date('2025-09-30')
  const offset = id - 23               // 23:0, 22:-1, ... 2:-21
  const d = new Date(base)
  d.setDate(d.getDate() + offset)
  return {
    id, title: '', category: '',
    author: { name: '' },
    date: toYMD(d),
    stats: { views: 0, likes: 0, comments: 0 },
    images: [], content: [],
    prev: null, next: null,
    comments: [],
    attachments: [], tags: [],
  }
}
// 보충(실제로는 없겠지만 혹시 누락이 있으면 채움)
for (let id = 33; id >= 2; id--) {
  if (!MAP.has(id)) MAP.set(id, placeholderFor(id))
}

// 4) prev/next 연결 (숫자 오름차순 기준)
const ORDER_ASC = Array.from(MAP.keys()).sort((a, b) => a - b)
for (let i = 0; i < ORDER_ASC.length; i++) {
  const id = ORDER_ASC[i]
  const prevId = ORDER_ASC[i - 1] ?? null
  const nextId = ORDER_ASC[i + 1] ?? null
  const me = MAP.get(id)
  me.prev = prevId ? { id: prevId, title: MAP.get(prevId)?.title || '' } : null
  me.next = nextId ? { id: nextId, title: MAP.get(nextId)?.title || '' } : null
}

// ───────────────────────────────────────────────────────────────
// 공개 API
export function getDummyDetail(id) {
  const d = MAP.get(Number(id))
  return d ? JSON.parse(JSON.stringify(d)) : null
}
export function getDummyThumb(id) {
  const d = MAP.get(Number(id))
  return d?.images?.[0]?.src || ''
}
export function getAllDummyIds(desc = true) {
  const ids = Array.from(MAP.keys())
  return desc ? ids.sort((a,b) => b - a) : ids.sort((a,b) => a - b)
}
