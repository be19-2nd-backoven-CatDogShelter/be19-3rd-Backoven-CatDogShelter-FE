<template>
  <div class="page">
    <div class="form-box">
      <h2>입양 공고 작성</h2>

  <form @submit.prevent="submitPost" novalidate>

        <!-- 제목 -->
        <div class="form-row">
          <label>제목 *</label>
          <input v-model="form.title" required placeholder="제목을 입력하세요" />
        </div>

        <!-- 기본 정보 -->
        <h3 class="section-title">동물 기본 정보</h3>

        <div class="grid">
          <div>
            <label>종류 *</label>
            <select v-model="form.animalType" required>
              <option value="">선택하세요</option>
              <option value="DOG">개</option>
              <option value="CAT">고양이</option>
            </select>
          </div>

          <div>
            <label>품종 *</label>
            <input v-model="form.breed" required placeholder="예: 비숑" />
          </div>

          <div>
            <label>나이 *</label>
            <input v-model="form.age" type="number" required placeholder="예: 3" />
          </div>

          <div>
            <label>성별 *</label>
            <select v-model="form.gender" required>
              <option value="">선택하세요</option>
              <option value="MALE">수컷</option>
              <option value="FEMALE">암컷</option>
            </select>
          </div>

          <div>
            <label>색상</label>
            <input v-model="form.color" placeholder="검정, 회색 등" />
          </div>

          <div>
            <label>체중(kg) *</label>
            <input v-model="form.weight" type="number" step="0.1" required />
          </div>
        </div>

        <!-- 건강정보 -->
        <h3 class="section-title">건강 정보</h3>

        <div class="grid">
          <div>
            <label>예방접종 여부 *</label>
            <select v-model="form.vaccination" required>
              <option value="Y">예</option>
              <option value="N">아니오</option>
            </select>
          </div>

          <div>
            <label>중성화 여부 *</label>
            <select v-model="form.neutering" required>
              <option value="Y">예</option>
              <option value="N">아니오</option>
            </select>
          </div>

          <div>
            <label>상태 *</label>
            <select v-model="form.status" required>
              <option value="PROTECTING">보호중</option>
              <option value="ADOPTED">입양완료</option>
            </select>
          </div>
        </div>

        <!-- 지역 정보 -->
        <h3 class="section-title">지역 정보</h3>
        
        <div class="grid">
          <div>
            <label>시/도 *</label>
            <select v-model="form.sidoId" @change="loadSigungu" required>
              <option value="">선택하세요</option>
              <option v-for="sido in sidoList" :key="sido.sidoId" :value="sido.sidoId">
                {{ sido.sidoName }}
              </option>
            </select>
          </div>

          <div>
            <label>시/군/구 *</label>
            <select v-model="form.sigunguId" required :disabled="!form.sidoId">
              <option value="">{{ form.sidoId ? '선택하세요' : '시/도를 먼저 선택하세요' }}</option>
              <option v-for="sigungu in sigunguList" :key="sigungu.sigunguId" :value="sigungu.sigunguId">
                {{ sigungu.sigunguName }}
              </option>
            </select>
          </div>
        </div>

        <!-- 상세 내용 -->
        <div class="form-row">
          <label>내용 *</label>
          <textarea v-model="form.content" required placeholder="아이에 대한 설명을 적어주세요"></textarea>
        </div>

        <!-- 연락처 -->
        <div class="form-row">
          <label>연락처 *</label>
          <input v-model="form.userPhone" required placeholder="010-0000-0000" />
        </div>

        <!-- 파일 업로드 -->
        <div class="form-row">
          <label>사진 업로드 (최대 5장)</label>
          <input 
            type="file" 
            @change="handleFileUpload"
            multiple 
            accept="image/*"
            ref="fileInput"
          />

          <!-- 이미지 미리보기 -->
          <div class="preview-container" v-if="previews.length > 0">
            <div 
              v-for="(preview, idx) in previews" 
              :key="idx" 
              class="preview-image"
            >
              <img :src="preview" />
              <button type="button" class="remove-btn" @click="removeImage(idx)">×</button>
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? '등록 중...' : '입양 게시글 등록' }}
        </button>
      </form>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>

    <!-- 성공 모달 -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">✓</div>
          <h3>입양 게시글 등록 완료</h3>
          <p>게시글이 성공적으로 등록되었습니다!</p>
              <div style="display:flex; gap:8px; flex-direction:column">
                <button class="modal-btn" @click="() => { if (createdPostIdRef.value) { router.push(`/adoption/${createdPostIdRef.value}`) } else { previewPost() } }">게시글 미리보기</button>
                <button class="modal-btn" @click="goToList">입양 게시판으로 이동</button>
              </div>
              <div v-if="lastResponseInfo" style="margin-top:12px; font-size:12px; color:#666;">
                <div><strong>서버 응답 상태:</strong> {{ lastResponseInfo.status }}</div>
                <div v-if="lastResponseInfo.text"><strong>응답 본문:</strong> <pre style="white-space:pre-wrap">{{ lastResponseInfo.text }}</pre></div>
              </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const form = reactive({
  title: "",
  animalType: "",
  breed: "",
  age: "",
  gender: "",
  color: "",
  weight: "",
  vaccination: "Y",
  neutering: "Y",
  status: "PROTECTING",
  content: "",
  userPhone: "",
  sidoId: "",
  sigunguId: "",
  userId: 1,
  headId: null
})

const files = ref([])
const previews = ref([])
const isSubmitting = ref(false)
const errorMessage = ref("")
const showSuccessModal = ref(false)
const tempKeyRef = ref(null)
const createdPostIdRef = ref(null)
const lastResponseInfo = ref(null)
const fileInput = ref(null)
function previewPost() {
  if (tempKeyRef.value) {
    router.push({ path: `/adoption/temp`, query: { tempKey: tempKeyRef.value } })
  } else {
    // fallback to list
    router.push('/adoption')
  }
}

// ✅ 하드코딩된 지역 데이터 (API가 없을 경우)
const sidoList = ref([
  { sidoId: 1, sidoCode: '11', sidoName: '서울특별시' },
  { sidoId: 2, sidoCode: '26', sidoName: '부산광역시' },
  { sidoId: 3, sidoCode: '27', sidoName: '대구광역시' },
  { sidoId: 4, sidoCode: '28', sidoName: '인천광역시' },
  { sidoId: 5, sidoCode: '29', sidoName: '광주광역시' },
  { sidoId: 6, sidoCode: '30', sidoName: '대전광역시' },
  { sidoId: 7, sidoCode: '31', sidoName: '울산광역시' },
  { sidoId: 8, sidoCode: '41', sidoName: '경기도' },
  { sidoId: 9, sidoCode: '42', sidoName: '강원도' },
  { sidoId: 10, sidoCode: '43', sidoName: '충청북도' }
])

const sigunguData = {
  1: [ // 서울
    { sigunguId: 1, sigunguCode: '11110', sigunguName: '종로구' },
    { sigunguId: 2, sigunguCode: '11140', sigunguName: '중구' },
    { sigunguId: 3, sigunguCode: '11170', sigunguName: '용산구' },
    { sigunguId: 4, sigunguCode: '11200', sigunguName: '성동구' },
    { sigunguId: 5, sigunguCode: '11215', sigunguName: '광진구' },
    { sigunguId: 6, sigunguCode: '11230', sigunguName: '동대문구' },
    { sigunguId: 7, sigunguCode: '11260', sigunguName: '중랑구' },
    { sigunguId: 8, sigunguCode: '11290', sigunguName: '성북구' },
    { sigunguId: 9, sigunguCode: '11305', sigunguName: '강북구' },
    { sigunguId: 10, sigunguCode: '11320', sigunguName: '도봉구' }
  ],
  2: [ // 부산
    { sigunguId: 11, sigunguCode: '26110', sigunguName: '중구' },
    { sigunguId: 12, sigunguCode: '26140', sigunguName: '서구' },
    { sigunguId: 13, sigunguCode: '26170', sigunguName: '동구' },
    { sigunguId: 14, sigunguCode: '26200', sigunguName: '영도구' },
    { sigunguId: 15, sigunguCode: '26230', sigunguName: '부산진구' }
  ],
  3: [ // 대구
    { sigunguId: 16, sigunguCode: '27110', sigunguName: '중구' },
    { sigunguId: 17, sigunguCode: '27140', sigunguName: '동구' },
    { sigunguId: 18, sigunguCode: '27170', sigunguName: '서구' }
  ],
  4: [ // 인천
    { sigunguId: 19, sigunguCode: '28110', sigunguName: '중구' },
    { sigunguId: 20, sigunguCode: '28140', sigunguName: '동구' },
    { sigunguId: 21, sigunguCode: '28170', sigunguName: '남구' }
  ],
  5: [ // 광주
    { sigunguId: 22, sigunguCode: '29110', sigunguName: '동구' }
  ],
  6: [ // 대전
    { sigunguId: 23, sigunguCode: '30110', sigunguName: '동구' }
  ],
  7: [ // 울산
    { sigunguId: 24, sigunguCode: '31110', sigunguName: '중구' }
  ],
  8: [ // 경기
    { sigunguId: 25, sigunguCode: '41110', sigunguName: '수원시' },
    { sigunguId: 26, sigunguCode: '41111', sigunguName: '수원시 장안구' },
    { sigunguId: 27, sigunguCode: '41113', sigunguName: '수원시 권선구' }
  ],
  9: [ // 강원
    { sigunguId: 28, sigunguCode: '42110', sigunguName: '춘천시' }
  ],
  10: [ // 충청북도
    { sigunguId: 29, sigunguCode: '43110', sigunguName: '청주시' }
  ]
}

const sigunguList = ref([])

// ✅ API 방식 (백엔드에 API가 있을 경우)
async function loadSidoFromAPI() {
  try {
    const res = await fetch('http://localhost:8000/user-service/api/region/sido')
    if (!res.ok) throw new Error('API 호출 실패')
    const data = await res.json()
    sidoList.value = data
  } catch (error) {
    console.warn('API 사용 불가, 하드코딩 데이터 사용:', error)
    // 하드코딩 데이터는 이미 설정되어 있음
  }
}

// 시/군/구 목록 불러오기
function loadSigungu() {
  if (!form.sidoId) {
    sigunguList.value = []
    form.sigunguId = ""
    return
  }

  // ✅ 하드코딩된 데이터에서 가져오기
  sigunguList.value = sigunguData[form.sidoId] || []
  form.sigunguId = "" // 시/도 변경 시 시/군/구 초기화
  
  // ✅ API가 있다면 아래 코드 사용
  /*
  try {
    const res = await fetch(`http://localhost:8000/user-service/api/region/sigungu/${form.sidoId}`)
    if (!res.ok) throw new Error('시/군/구 목록 불러오기 실패')
    const data = await res.json()
    sigunguList.value = data
    form.sigunguId = ""
  } catch (error) {
    console.error('시/군/구 목록 오류:', error)
    // 하드코딩 데이터 사용
    sigunguList.value = sigunguData[form.sidoId] || []
  }
  */
}

onMounted(() => {
  // API 시도 (실패하면 하드코딩 데이터 사용)
  // loadSidoFromAPI()
})

function handleFileUpload(e) {
  const selectedFiles = Array.from(e.target.files).slice(0, 5)
  files.value = selectedFiles

  previews.value = []
  selectedFiles.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(index) {
  previews.value.splice(index, 1)
  files.value.splice(index, 1)
  
  if (files.value.length === 0 && fileInput.value) {
    fileInput.value.value = ''
  }
}

async function submitPost() {
  console.log('submitPost called')
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  errorMessage.value = ""

  try {
    const formData = new FormData()
    
    const postData = {
      title: form.title,
      animalType: form.animalType,
      breed: form.breed,
      age: parseInt(form.age),
      gender: form.gender,
      color: form.color || "",
      weight: parseFloat(form.weight),
      vaccination: form.vaccination,
      neutering: form.neutering,
      status: form.status,
      content: form.content,
      userPhone: form.userPhone,
      sigunguId: parseInt(form.sigunguId),
      userId: form.userId,
      headId: form.headId
    }
    
    formData.append('newPost', new Blob([JSON.stringify(postData)], {
      type: 'application/json'
    }))
    
    if (files.value.length > 0) {
      files.value.forEach((file) => {
        formData.append('files', file)
      })
    }

    console.log('전송할 데이터:', postData)
    console.log('전송할 파일 수:', files.value.length)
    
    const res = await fetch('http://localhost:8000/post-service/adoption-post/regist', {
      method: 'POST',
      body: formData
    })

    // capture response details for debugging
    const status = res.status
    const headers = {}
    res.headers.forEach((v,k) => headers[k]=v)
    let text = ''
    try { text = await res.text() } catch(e){ text = '' }

    // attempt JSON parse
    let parsed = null
    try { parsed = text ? JSON.parse(text) : null } catch(e){ parsed = null }
    lastResponseInfo.value = { status, headers, text, parsed }

    if (!res.ok) {
      // show response body in UI for debugging
      const errorText = text || `HTTP ${status}`
      throw new Error(`등록 실패 (${status}): ${errorText}`)
    }

    console.log('등록 성공!', lastResponseInfo.value)

    // if server returned a created id, store it
    if (parsed && (parsed.id || parsed.postId || parsed.data?.id)) {
      createdPostIdRef.value = parsed.id || parsed.postId || parsed.data.id
    }

    // Create temporary blob URLs for immediate display in the detail page
    const blobUrls = files.value.map(f => URL.createObjectURL(f))
    const tempKey = `tempPostFiles_${Date.now()}`
    try {
      sessionStorage.setItem(tempKey, JSON.stringify(blobUrls))
      tempKeyRef.value = tempKey
    } catch (e) {
      console.warn('sessionStorage set failed:', e)
    }

    // Show success modal and let the user navigate (preview or list)
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('등록 오류:', error)
    errorMessage.value = `등록 실패: ${error.message}`
  } finally {
    isSubmitting.value = false
  }
}

function closeModal() {
  showSuccessModal.value = false
  goToList()
}

function goToList() {
  showSuccessModal.value = false
  router.push("/adoption")
}
</script>

<style scoped>
.page {
  background: #f0ebe5;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
}

.form-box {
  background: #fff;
  max-width: 760px;
  width: 100%;
  border-radius: 14px;
  padding: 32px;
}

h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.section-title {
  margin: 28px 0 12px;
  font-size: 17px;
  font-weight: bold;
  color: #b8860b;
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 48% 48%;
}

.grid > div {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
}

.form-row {
  margin: 14px 0;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

input, select, textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  font-family: inherit;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #b8860b;
}

textarea { 
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  margin-top: 24px;
  width: 100%;
  padding: 14px;
  background: #e6cf9c;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #d4bc85;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #ccc;
}

.preview-container {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preview-image {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(0,0,0,0.8);
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  font-size: 14px;
  white-space: pre-line;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-icon {
  width: 70px;
  height: 70px;
  background: #d4edda;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #28a745;
  margin: 0 auto 20px;
  font-weight: bold;
}

.modal-content h3 {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.modal-content p {
  margin: 0 0 30px 0;
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}

.modal-btn {
  width: 100%;
  padding: 14px;
  background: #e6cf9c;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-btn:hover {
  background: #d4bc85;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .page {
    padding: 20px 12px;
  }
  
  .form-box {
    padding: 20px;
  }
  
  .modal-content {
    padding: 30px 24px;
  }
}
</style>