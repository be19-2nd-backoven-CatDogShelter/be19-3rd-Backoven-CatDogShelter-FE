<template>
  <div class="review-insert-page">
    <div class="insert-container">
      <!-- 뒤로가기 버튼 -->
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
        뒤로가기
      </button>

      <h1 class="page-title">봉사후기 작성</h1>

      <form @submit.prevent="submitForm" class="insert-form">
        <!-- 보호소 이름 -->
        <div class="form-group">
          <label class="form-label required">보호소 이름</label>
          <input 
            type="text" 
            v-model="formData.companyName"
            class="form-input"
            placeholder="봉사한 보호소 이름을 입력하세요"
            required
          />
        </div>

        <!-- 제목 -->
        <div class="form-group">
          <label class="form-label required">제목</label>
          <input 
            type="text" 
            v-model="formData.title"
            class="form-input"
            placeholder="봉사후기 제목을 입력하세요"
            required
          />
        </div>

        <!-- 내용 -->
        <div class="form-group">
          <label class="form-label required">내용</label>
          <textarea 
            v-model="formData.content"
            class="form-textarea"
            placeholder="봉사 경험을 자세히 작성해주세요..."
            rows="15"
            required
          ></textarea>
        </div>

        <!-- 사진 업로드 -->
        <div class="form-group">
          <label class="form-label">사진 첨부</label>
          <p class="upload-description">최대 10장까지 업로드 가능합니다</p>
          
          <div class="upload-area" @click="triggerFileInput">
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileUpload"
              accept="image/*"
              multiple
              style="display: none"
            />
            <div class="upload-placeholder">
              <span class="upload-icon">📤</span>
              <p class="upload-text">클릭하여 사진 업로드</p>
            </div>
          </div>

          <!-- 업로드된 이미지 미리보기 -->
          <div v-if="uploadedImages.length > 0" class="image-preview-container">
            <div 
              v-for="(image, index) in uploadedImages" 
              :key="index"
              class="image-preview-item"
            >
              <img :src="image.url" :alt="`미리보기 ${index + 1}`" class="preview-image" />
              <button 
                type="button"
                class="remove-image-btn" 
                @click="removeImage(index)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- 버튼 그룹 -->
        <div class="button-group">
          <button type="button" class="cancel-btn" @click="goBack">
            취소
          </button>
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '등록 중...' : '작성완료' }}
          </button>
        </div>
      </form>

      <!-- 안내 박스 -->
      <div class="info-box">
        <h3 class="info-box-title">✏️ 봉사후기 작성 안내</h3>
        <ul class="info-list">
          <li>실제 봉사 경험을 바탕으로 작성해주세요.</li>
          <li>보호소 이름과 봉사 내용을 구체적으로 적어주시면 좋습니다.</li>
          <li>사진은 최대 5장까지 첨부 가능합니다.</li>
          <li>다른 봉사자들에게 도움이 되는 정보를 공유해주세요.</li>
          <li>개인정보 보호를 위해 연락처 등은 기재하지 말아주세요.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const submitting = ref(false)

const formData = ref({
  companyName: '',
  title: '',
  content: ''
})

const uploadedImages = ref([])

// 파일 입력 트리거
const triggerFileInput = () => {
  fileInput.value.click()
}

// 파일 업로드 처리
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  
  if (uploadedImages.value.length + files.length > 10) {
    alert('사진은 최대 10장까지 첨부 가능합니다.')
    return
  }
  
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImages.value.push({
        file: file,
        url: e.target.result,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  })
  
  // 파일 입력 초기화
  event.target.value = ''
}

// 이미지 제거
const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

// 폼 제출
const submitForm = async () => {
  if (submitting.value) return
  
  if (!formData.value.companyName.trim()) {
    alert('보호소 이름을 입력해주세요.')
    return
  }
  
  if (!formData.value.title.trim()) {
    alert('제목을 입력해주세요.')
    return
  }
  
  if (!formData.value.content.trim()) {
    alert('내용을 입력해주세요.')
    return
  }
  
  submitting.value = true
  
  try {
    // 모든 후기 데이터 가져오기
    const response = await fetch('http://localhost:8080/review')
    const allReviews = await response.json()
    
    // 새 ID 생성
    const newId = allReviews.length > 0 
      ? Math.max(...allReviews.map(r => r.id)) + 1 
      : 1
    
    // 요약 내용 생성 (처음 50자)
    const summary = formData.value.content.length > 50 
      ? formData.value.content.substring(0, 50) + '...'
      : formData.value.content
    
    // 새 후기 데이터
    const newReview = {
      id: newId,
      companyName: formData.value.companyName,
      title: formData.value.title,
      content: summary,
      writer: '이지윤', // 실제로는 로그인한 사용자
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      views: 0,
      detailContent: formData.value.content,
      files: uploadedImages.value.length > 0 
        ? uploadedImages.value.map((img, i) => `@/assets/volunteer/봉사후기${(i % 10) + 1}.jpeg`)
        : ['@/assets/volunteer/봉사후기1.jpeg'],
      commentList: []
    }
    
    // JSON 서버에 POST 요청
    const postResponse = await fetch('http://localhost:8080/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview)
    })
    
    if (!postResponse.ok) {
      throw new Error('등록에 실패했습니다.')
    }
    
    alert('봉사후기가 성공적으로 등록되었습니다!')
    router.push('/volunteer/review')
  } catch (error) {
    console.error('등록 실패:', error)
    alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
  } finally {
    submitting.value = false
  }
}

// 뒤로가기
const goBack = () => {
  if (formData.value.companyName || formData.value.title || formData.value.content || uploadedImages.value.length > 0) {
    if (confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
      router.back()
    }
  } else {
    router.back()
  }
}
</script>

<style scoped>
.review-insert-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF9F0 0%, #FFE8CC 100%);
  padding: 60px 20px;
}

.insert-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.back-btn {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
}

.back-btn:hover {
  background: #f8f9fa;
  border-color: #FF9A76;
  color: #FF9A76;
  transform: translateX(-5px);
}

.back-icon {
  font-size: 18px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.insert-form {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.form-label.required::after {
  content: ' *';
  color: #ff6b6b;
}

.form-input,
.form-textarea {
  width: 100%;
  max-width: 800px;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FF9A76;
}

.form-textarea {
  resize: vertical;
  min-height: 300px;
}

.upload-description {
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 800px;
}

.upload-area:hover {
  border-color: #FF9A76;
  background: #FFF9F0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 48px;
}

.upload-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.image-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
  max-width: 800px;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: rgba(255, 0, 0, 1);
  transform: scale(1.1);
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
}

.cancel-btn,
.submit-btn {
  padding: 15px 40px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.submit-btn {
  background: linear-gradient(135deg, #FF9A76 0%, #FF7B54 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 123, 84, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-box {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info-box-title {
  font-size: 20px;
  font-weight: 700;
  color: #FF7B54;
  margin: 0 0 20px 0;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  padding: 12px 0;
  padding-left: 30px;
  color: #666;
  line-height: 1.6;
  position: relative;
}

.info-list li::before {
  content: '•';
  position: absolute;
  left: 10px;
  color: #FF9A76;
  font-size: 20px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .insert-form {
    padding: 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
  
  .image-preview-container {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>