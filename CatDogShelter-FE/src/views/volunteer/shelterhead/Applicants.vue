<template>
  <div class="applicants-page">
    <header class="page-header">
      <div>
        <h1 class="page-title">신청 · 봉사 관리</h1>
        <p class="page-subtitle">
          신청자 확인부터 봉사 시간 관리까지 한눈에 살펴보고 필요한 조치를 빠르게 수행해보세요.
        </p>
      </div>
      <button class="back-btn" @click="goBack">
        ← 마이페이지로
      </button>
    </header>

    <section class="stats-grid">
      <article class="stat-card" v-for="card in summaryCards" :key="card.label">
        <div class="stat-icon" :class="card.intent">
          {{ card.icon }}
        </div>
        <div class="stat-content">
          <p class="stat-label">{{ card.label }}</p>
          <p class="stat-value">{{ card.value }}</p>
          <span class="stat-hint">{{ card.hint }}</span>
        </div>
      </article>
    </section>

    <section class="management-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">신청 내역 관리</h2>
          <p class="card-description">
            봉사 신청 현황을 확인하고, 승인·반려 처리를 통해 봉사 일정을 조율하세요.
          </p>
        </div>
        <div class="card-controls">
          <div class="search-field">
            <span class="search-icon">🔍</span>
            <input
              v-model.trim="applicantKeyword"
              type="search"
              placeholder="신청자 이름 또는 봉사 활동 검색"
            />
          </div>
          <select v-model="applicantSort" class="control-select">
            <option value="latest">신청일 최신순</option>
            <option value="oldest">신청일 오래된순</option>
          </select>
        </div>
      </div>

      <div class="status-filter">
        <button
          v-for="option in applicantStatusOptions"
          :key="option.key"
          :class="['status-chip', { active: applicantStatusFilter === option.key }]"
          @click="applicantStatusFilter = option.key"
        >
          {{ option.label }}
          <span class="chip-count" v-if="option.key !== 'all'">
            {{ applicantStatusCount(option.key) }}
          </span>
        </button>
      </div>

      <div class="applicants-layout">
        <div class="table-wrapper">
          <table class="applicant-table">
            <thead>
              <tr>
                <th>신청자</th>
                <th>신청일</th>
                <th>희망 활동</th>
                <th>예상 소요</th>
                <th>상태</th>
                <th class="actions-col">조치</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="applicant in filteredApplicants"
                :key="applicant.id"
                :class="{ selected: selectedApplicant?.id === applicant.id }"
                @click="selectApplicant(applicant)"
              >
                <td>
                  <div class="cell-primary">
                    <span class="avatar">{{ getInitial(applicant.name) }}</span>
                    <div>
                      <p class="cell-title">{{ applicant.name }}</p>
                      <p class="cell-sub">{{ applicant.contact }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="cell-text">{{ formatDate(applicant.appliedAt) }}</span>
                </td>
                <td>
                  <p class="cell-title">{{ applicant.volunteerTitle }}</p>
                  <p class="cell-sub">{{ applicant.memo }}</p>
                </td>
                <td>
                  <span class="cell-text">{{ applicant.time }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="applicant.statusKey">
                    {{ statusLabelMap[applicant.statusKey] }}
                  </span>
                </td>
                <td class="actions-col">
                  <div class="row-actions">
                    <button
                      class="row-btn approve"
                      @click.stop="setApplicantStatus(applicant, 'approved')"
                    >
                      승인
                    </button>
                    <button
                      class="row-btn reject"
                      @click.stop="setApplicantStatus(applicant, 'rejected')"
                    >
                      반려
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredApplicants.length">
                <td colspan="6" class="empty-state">
                  <p>조건에 맞는 신청자가 없습니다.</p>
                  <span>검색어나 상태 필터를 다시 확인해 주세요.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <aside class="details-panel" v-if="selectedApplicant">
          <h3>신청자 상세</h3>
          <div class="detail-card">
            <div class="detail-header">
              <span class="avatar large">{{ getInitial(selectedApplicant.name) }}</span>
              <div>
                <p class="detail-name">{{ selectedApplicant.name }}</p>
                <span class="status-badge" :class="selectedApplicant.statusKey">
                  {{ statusLabelMap[selectedApplicant.statusKey] }}
                </span>
              </div>
            </div>

            <dl class="detail-list">
              <div>
                <dt>희망 봉사</dt>
                <dd>{{ selectedApplicant.volunteerTitle }}</dd>
              </div>
              <div>
                <dt>신청일</dt>
                <dd>{{ formatDate(selectedApplicant.appliedAt) }}</dd>
              </div>
              <div>
                <dt>예상 소요</dt>
                <dd>{{ selectedApplicant.time }}</dd>
              </div>
              <div>
                <dt>연락처</dt>
                <dd>{{ selectedApplicant.contact }}</dd>
              </div>
              <div>
                <dt>메모</dt>
                <dd>{{ selectedApplicant.memo }}</dd>
              </div>
              <div>
                <dt>특이사항</dt>
                <dd>{{ selectedApplicant.note }}</dd>
              </div>
            </dl>

            <div class="detail-actions">
              <button class="detail-btn primary" @click="setApplicantStatus(selectedApplicant, 'approved')">
                승인 처리
              </button>
              <button class="detail-btn subtle" @click="goToMessages">
                쪽지 보내기
              </button>
              <button class="detail-btn danger" @click="setApplicantStatus(selectedApplicant, 'rejected')">
                반려 처리
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="management-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">봉사 시간 관리</h2>
          <p class="card-description">
            봉사 참여 일정을 확인하고, 필요한 안내나 기록을 바로 남겨보세요.
          </p>
        </div>
        <div class="card-controls">
          <div class="search-field">
            <span class="search-icon">🔎</span>
            <input
              v-model.trim="recordKeyword"
              type="search"
              placeholder="봉사자 또는 역할 검색"
            />
          </div>
          <select v-model="recordStatusFilter" class="control-select">
            <option value="all">전체 상태</option>
            <option value="approved">출석 확인</option>
            <option value="pending">확인 대기</option>
          </select>
        </div>
      </div>

      <div class="records-wrapper">
        <div class="records-group" v-if="upcomingRecords.length">
          <h3 class="group-title">예정된 봉사</h3>
          <article class="record-card" v-for="record in upcomingRecords" :key="`${record.id}-upcoming`">
            <div class="record-meta">
              <span class="record-date">{{ formatDate(record.scheduleDate) }}</span>
              <span class="status-badge outline">{{ statusLabelMap[record.statusKey] }}</span>
            </div>
            <h4 class="record-title">{{ record.name }}</h4>
            <p class="record-role">{{ record.role }}</p>
            <div class="record-info">
              <span>소요 {{ record.time }}</span>
              <span>{{ record.memo }}</span>
            </div>
            <div class="card-actions">
              <button class="row-btn approve" @click="setRecordStatus(record, 'approved')">출석 확인</button>
              <button class="row-btn subtle" @click="openRecordMemo(record)">메모 보기</button>
            </div>
          </article>
        </div>

        <div class="records-group" v-if="completedRecords.length">
          <h3 class="group-title">지난 봉사</h3>
          <article class="record-card subdued" v-for="record in completedRecords" :key="`${record.id}-completed`">
            <div class="record-meta">
              <span class="record-date">{{ formatDate(record.scheduleDate) }}</span>
              <span class="status-badge approved">{{ statusLabelMap[record.statusKey] }}</span>
            </div>
            <h4 class="record-title">{{ record.name }}</h4>
            <p class="record-role">{{ record.role }}</p>
            <div class="record-info">
              <span>참여 시간 {{ record.time }}</span>
              <span>{{ record.memo }}</span>
            </div>
          </article>
        </div>

        <div v-if="!upcomingRecords.length && !completedRecords.length" class="empty-records">
          <p>표시할 봉사 기록이 없습니다.</p>
          <span>필터를 조정하거나 새로운 봉사 일정을 등록해 보세요.</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import db from '@/assets/data/db.json'

const router = useRouter()

const mypageData = db?.shelterHead?.mypage ?? {}
const volunteerList = db?.volunteer?.[0]?.list ?? []

const statusLabelMap = {
  pending: '승인대기',
  approved: '승인완료',
  rejected: '반려'
}

const reverseStatusMap = {
  승인대기: 'pending',
  승인완료: 'approved',
  반려: 'rejected'
}

const applicantExtraSeed = [
  { contact: '010-6243-0978', memo: '주말 오전 참여 가능', note: '반려견 돌봄 2년 경험' },
  { contact: '010-7812-4430', memo: '평일 저녁 가능', note: '사진 촬영 및 홍보 지원 가능' },
  { contact: '010-9321-5512', memo: '차량 이동 지원 가능', note: '자원봉사 30시간 이상 이수' },
  { contact: '010-4421-8820', memo: '의료 보조 관심', note: '수의학 전공 3학년' }
]

const applicants = ref(
  (mypageData.applicants ?? []).map((applicant, index) => {
    const volunteer = volunteerList[index % volunteerList.length] ?? {}
    const extra = applicantExtraSeed[index % applicantExtraSeed.length] ?? {}
    let statusKey = reverseStatusMap[applicant.status] ?? applicant.statusClass ?? 'pending'

    if (index === 1) statusKey = 'approved'
    if (index === 2) statusKey = 'rejected'

    const appliedAt = volunteer.startDate ?? '2025-10-10'
    const time = volunteer.time ?? '3시간'

    return {
      id: applicant.id,
      name: applicant.name,
      volunteerTitle: volunteer.title ?? '보호소 봉사 활동',
      appliedAt,
      time,
      statusKey,
      status: statusLabelMap[statusKey],
      statusClass: statusKey,
      contact: extra.contact,
      memo: extra.memo,
      note: extra.note
    }
  })
)

const recordExtraSeed = [
  { role: '보호견 산책 리더', memo: '리드 줄 사용 및 산책 경로 안내', time: '3시간' },
  { role: '급식 · 물품 정리', memo: '사료 리필 및 창고 정돈', time: '2시간 30분' },
  { role: '포토 기록팀', memo: '입양 홍보 사진 촬영', time: '4시간' }
]

const volunteerRecords = ref(
  (mypageData.volunteerRecords ?? []).map((record, index) => {
    const volunteer = volunteerList[(index + 1) % volunteerList.length] ?? {}
    const extra = recordExtraSeed[index % recordExtraSeed.length] ?? {}
    const statusKey = reverseStatusMap[record.status] ?? record.statusClass ?? 'approved'

    const timeLabel = volunteer.time ?? extra.time ?? '3시간'
    const scheduleDate = volunteer.startDate ?? record.date

    return {
      id: record.id,
      name: record.name,
      scheduleDate,
      role: extra.role ?? volunteer.title ?? '봉사 활동',
      memo: extra.memo ?? volunteer.detailAddress ?? '',
      time: timeLabel,
      hoursValue: parseHours(timeLabel),
      statusKey,
      status: statusLabelMap[statusKey]
    }
  })
)

const applicantKeyword = ref('')
const applicantSort = ref('latest')
const applicantStatusFilter = ref('all')

const applicantStatusOptions = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '승인대기' },
  { key: 'approved', label: '승인완료' },
  { key: 'rejected', label: '반려' }
]

const filteredApplicants = computed(() => {
  const keyword = applicantKeyword.value.trim().toLowerCase()
  const statusFilter = applicantStatusFilter.value
  const sort = applicantSort.value

  let list = applicants.value.slice()

  if (statusFilter !== 'all') {
    list = list.filter(applicant => applicant.statusKey === statusFilter)
  }

  if (keyword) {
    list = list.filter(applicant => {
      const haystack = `${applicant.name} ${applicant.volunteerTitle} ${applicant.memo}`.toLowerCase()
      return haystack.includes(keyword)
    })
  }

  list.sort((a, b) => {
    const aDate = new Date(a.appliedAt)
    const bDate = new Date(b.appliedAt)
    return sort === 'latest' ? bDate - aDate : aDate - bDate
  })

  return list
})

const selectedApplicant = ref(null)

watch(
  filteredApplicants,
  list => {
    if (!list.length) {
      selectedApplicant.value = null
      return
    }
    if (!selectedApplicant.value || !list.some(item => item.id === selectedApplicant.value.id)) {
      selectedApplicant.value = list[0]
    }
  },
  { immediate: true }
)

const recordKeyword = ref('')
const recordStatusFilter = ref('all')

const filteredRecords = computed(() => {
  const keyword = recordKeyword.value.trim().toLowerCase()
  const statusFilter = recordStatusFilter.value

  let list = volunteerRecords.value.slice().sort((a, b) => new Date(b.scheduleDate) - new Date(a.scheduleDate))

  if (statusFilter !== 'all') {
    list = list.filter(record => record.statusKey === statusFilter)
  }

  if (keyword) {
    list = list.filter(record => {
      const haystack = `${record.name} ${record.role} ${record.memo}`.toLowerCase()
      return haystack.includes(keyword)
    })
  }

  return list
})

const upcomingRecords = computed(() => filteredRecords.value.filter(record => isUpcoming(record.scheduleDate)))
const completedRecords = computed(() => filteredRecords.value.filter(record => !isUpcoming(record.scheduleDate)))

const pendingCount = computed(() => applicants.value.filter(applicant => applicant.statusKey === 'pending').length)
const approvedCount = computed(() => applicants.value.filter(applicant => applicant.statusKey === 'approved').length)
const rejectedCount = computed(() => applicants.value.filter(applicant => applicant.statusKey === 'rejected').length)
const upcomingCount = computed(() => upcomingRecords.value.length)
const totalHours = computed(() => volunteerRecords.value.reduce((sum, record) => sum + record.hoursValue, 0))

const summaryCards = computed(() => [
  {
    icon: '⏳',
    label: '승인 대기',
    value: `${pendingCount.value}건`,
    hint: '신속히 승인 여부를 결정해 주세요.',
    intent: 'pending'
  },
  {
    icon: '✅',
    label: '승인 완료',
    value: `${approvedCount.value}건`,
    hint: rejectedCount.value ? `반려 ${rejectedCount.value}건` : '안정적으로 관리되고 있어요.',
    intent: 'approved'
  },
  {
    icon: '📅',
    label: '예정된 봉사',
    value: `${upcomingCount.value}건`,
    hint: '봉사자에게 사전 안내를 전달하세요.',
    intent: 'upcoming'
  },
  {
    icon: '⏱️',
    label: '누적 봉사 시간',
    value: formatHours(totalHours.value),
    hint: '누적 기록은 월간 보고에 활용하세요.',
    intent: 'hours'
  }
])

function getInitial(name) {
  return name?.charAt(0) ?? '?'
}

function selectApplicant(applicant) {
  selectedApplicant.value = applicant
}

function setApplicantStatus(applicant, nextStatusKey) {
  applicant.statusKey = nextStatusKey
  applicant.status = statusLabelMap[nextStatusKey]
  applicant.statusClass = nextStatusKey
  if (selectedApplicant.value?.id === applicant.id) {
    selectedApplicant.value = { ...applicant }
  }
}

function setRecordStatus(record, nextStatusKey) {
  record.statusKey = nextStatusKey
  record.status = statusLabelMap[nextStatusKey]
}

function applicantStatusCount(statusKey) {
  return applicants.value.filter(applicant => applicant.statusKey === statusKey).length
}

function goBack() {
  router.back()
}

function goToMessages() {
  router.push('/shelter-head/messages')
}

function openRecordMemo(record) {
  console.log('봉사 메모 보기', record)
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

function isUpcoming(value) {
  if (!value) return false
  const target = new Date(value)
  if (Number.isNaN(target.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return target >= today
}

function parseHours(timeLabel) {
  if (!timeLabel) return 0
  const hourMatch = timeLabel.match(/(\d+)\s*시간/)
  const minuteMatch = timeLabel.match(/(\d+)\s*분/)
  const hours = hourMatch ? Number(hourMatch[1]) : 0
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0
  return hours + minutes / 60
}

function formatHours(value) {
  if (!value) return '0시간'
  const hours = Math.floor(value)
  const minutes = Math.round((value - hours) * 60)
  if (minutes === 0) return `${hours}시간`
  if (hours === 0) return `${minutes}분`
  return `${hours}시간 ${minutes}분`
}
</script>

<style scoped>
.applicants-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 48px;
  background: #faf8f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 700;
  color: #3d2f1f;
}

.page-subtitle {
  margin: 0;
  color: #8b7355;
  font-size: 0.98rem;
}

.back-btn {
  background: #ffffff;
  border: 1px solid #e0d4c2;
  border-radius: 12px;
  padding: 10px 18px;
  color: #6b5744;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #f5ede2;
  border-color: #d6c6b3;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(240, 183, 98, 0.2);
  box-shadow: 0 6px 20px rgba(61, 47, 31, 0.08);
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  font-size: 1.4rem;
  background: #faf0dd;
}

.stat-icon.pending {
  background: #fff4e2;
}

.stat-icon.approved {
  background: #e5f5ea;
}

.stat-icon.upcoming {
  background: #e9f2ff;
}

.stat-icon.hours {
  background: #fdebf1;
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0 0 6px;
  font-size: 0.92rem;
  color: #8b7355;
}

.stat-value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #3d2f1f;
}

.stat-hint {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.85rem;
  color: #a38d76;
}

.management-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 12px 28px rgba(61, 47, 31, 0.08);
  margin-bottom: 28px;
  border: 1px solid #f1e6d6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.card-title {
  margin: 0 0 6px;
  font-size: 1.4rem;
  font-weight: 700;
  color: #3d2f1f;
}

.card-description {
  margin: 0;
  color: #8b7355;
  font-size: 0.95rem;
}

.card-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-field {
  position: relative;
}

.search-field input {
  width: 280px;
  padding: 12px 16px 12px 40px;
  background: #f8f6f2;
  border-radius: 14px;
  border: 1px solid #e4d7c7;
  font-size: 0.95rem;
  color: #3d2f1f;
  outline: none;
  transition: border 0.3s, background 0.3s;
}

.search-field input:focus {
  border-color: #f0b762;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(240, 183, 98, 0.15);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  font-size: 0.95rem;
  color: #a38d76;
}

.control-select {
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid #e4d7c7;
  background: #f8f6f2;
  color: #3d2f1f;
  font-size: 0.95rem;
  cursor: pointer;
}

.status-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.status-chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: #f4eee4;
  color: #6b5744;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-chip .chip-count {
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  font-size: 0.8rem;
  color: #a38d76;
}

.status-chip.active {
  background: #f0b762;
  color: #ffffff;
}

.status-chip.active .chip-count {
  background: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.applicants-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.table-wrapper {
  background: #faf8f5;
  border-radius: 20px;
  border: 1px solid #efe3d2;
  overflow: hidden;
}

.applicant-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.applicant-table thead {
  background: #f3e8d9;
  color: #6b5744;
}

.applicant-table th,
.applicant-table td {
  padding: 16px 18px;
  text-align: left;
  border-bottom: 1px solid #efe3d2;
  vertical-align: top;
}

.applicant-table tbody tr {
  transition: background 0.2s;
  cursor: pointer;
}

.applicant-table tbody tr:hover {
  background: #f0ede6;
}

.applicant-table tbody tr.selected {
  background: rgba(240, 183, 98, 0.1);
}

.cell-primary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0b762 0%, #e7a150 100%);
  color: #fff;
  font-weight: 700;
}

.avatar.large {
  width: 56px;
  height: 56px;
  font-size: 1.25rem;
}

.cell-title {
  margin: 0;
  font-weight: 600;
  color: #3d2f1f;
}

.cell-sub {
  margin: 4px 0 0;
  color: #8b7355;
  font-size: 0.83rem;
}

.cell-text {
  color: #6b5744;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: none;
}

.status-badge.pending {
  background: rgba(240, 183, 98, 0.18);
  color: #c27a1d;
}

.status-badge.approved {
  background: rgba(101, 182, 129, 0.16);
  color: #2f7a4f;
}

.status-badge.rejected {
  background: rgba(235, 99, 99, 0.16);
  color: #c44141;
}

.status-badge.outline {
  background: transparent;
  border: 1px solid rgba(240, 183, 98, 0.4);
  color: #c27a1d;
}

.actions-col {
  min-width: 160px;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.row-btn {
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.row-btn.approve {
  background: linear-gradient(135deg, #6ac08d 0%, #4fa873 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(79, 168, 115, 0.2);
}

.row-btn.approve:hover {
  transform: translateY(-1px);
}

.row-btn.reject {
  background: rgba(235, 99, 99, 0.12);
  color: #c44141;
}

.row-btn.reject:hover {
  background: rgba(235, 99, 99, 0.22);
}

.row-btn.subtle {
  background: #ffffff;
  border: 1px solid #eadccd;
  color: #6b5744;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #8b7355;
}

.empty-state span {
  display: block;
  margin-top: 6px;
  font-size: 0.85rem;
  color: #b19c88;
}

.details-panel {
  background: #fffdfa;
  border: 1px solid #f1e0c9;
  border-radius: 20px;
  padding: 24px;
  position: sticky;
  top: 0;
  align-self: start;
}

.details-panel h3 {
  margin: 0 0 16px;
  font-size: 1.1rem;
  color: #3d2f1f;
}

.detail-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #f1e0c9;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(240, 183, 98, 0.16);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.detail-name {
  margin: 0 0 6px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #3d2f1f;
}

.detail-list {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.detail-list div {
  display: grid;
  gap: 4px;
}

.detail-list dt {
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  color: #aa9177;
  text-transform: uppercase;
}

.detail-list dd {
  margin: 0;
  color: #4b3928;
  font-weight: 600;
}

.detail-actions {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.detail-btn {
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.detail-btn.primary {
  background: linear-gradient(135deg, #f0b762 0%, #e7a150 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(240, 183, 98, 0.25);
}

.detail-btn.subtle {
  background: #f8f6f1;
  border: 1px solid #eadccd;
  color: #6b5744;
}

.detail-btn.danger {
  background: #fdebea;
  color: #cc4949;
}

.detail-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(61, 47, 31, 0.12);
}

.records-wrapper {
  display: grid;
  gap: 24px;
}

.records-group {
  display: grid;
  gap: 16px;
}

.group-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #3d2f1f;
}

.record-card {
  background: #fffdfa;
  border-radius: 18px;
  border: 1px solid #f3e4ce;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(61, 47, 31, 0.08);
  display: grid;
  gap: 12px;
}

.record-card.subdued {
  background: #f9f6f1;
}

.record-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #8b7355;
}

.record-date {
  font-weight: 600;
  color: #6b5744;
}

.record-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #3d2f1f;
}

.record-role {
  margin: 0;
  color: #8b7355;
}

.record-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  font-size: 0.9rem;
  color: #6b5744;
}

.card-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.empty-records {
  text-align: center;
  padding: 32px 20px;
  border-radius: 16px;
  background: #faf0dd;
  color: #8b7355;
}

.empty-records span {
  display: block;
  margin-top: 6px;
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .applicants-layout {
    grid-template-columns: 1fr;
  }

  .details-panel {
    position: relative;
  }

  .card-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-field input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .applicants-page {
    padding: 28px 16px 40px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .card-controls {
    align-items: stretch;
  }

  .status-filter {
    gap: 8px;
  }

  .applicant-table th,
  .applicant-table td {
    padding: 12px 14px;
  }
}

@media (max-width: 560px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .row-actions {
    flex-direction: column;
  }

  .record-info {
    flex-direction: column;
  }
}
</style>
