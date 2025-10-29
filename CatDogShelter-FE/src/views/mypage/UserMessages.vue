<template>
  <div class="jjokji-container">
    <!-- Left Sidebar -->
    <div class="sidebar">
      <div class="profile-section">
        <div class="ascii-art">
          <pre>
    +  ⌒
  (  ^_^  ♡ )
    i-/  つつ
          </pre>
        </div>
        <h3 class="username">이지윤</h3>
        <span class="badge">1일차 쪽집게</span>
        
        <div class="profile-divider"></div>

        <button class="write-btn" @click="openComposeModal">
          <span class="icon">✏️</span> 새 쪽지 작성
        </button>
      </div>

      <div class="menu-section">
        <div 
          class="menu-item" 
          :class="{ active: currentTab === 'received' }"
          @click="currentTab = 'received'"
        >
          <span class="icon">📨</span>
          <span>받은쪽지함</span>
          <span class="count">{{ receivedMessages.length }}</span>
        </div>
        <div 
          class="menu-item"
          :class="{ active: currentTab === 'sent' }"
          @click="currentTab = 'sent'"
        >
          <span class="icon">📤</span>
          <span>보낸쪽지함</span>
          <span class="count">{{ sentMessages.length }}</span>
        </div>
        <div 
          class="menu-item"
          :class="{ active: currentTab === 'trash' }"
          @click="currentTab = 'trash'"
        >
          <span class="icon">🗑️</span>
          <span>쪽지통</span>
          <span class="count">{{ trashedMessages.length }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- 받은쪽지함 -->
      <div v-if="currentTab === 'received'" class="tab-content">
        <div class="content-header">
          <h2>받은쪽지함</h2>
          <p class="subtitle">새로운 쪽지 {{ unreadCount }}개</p>
        </div>

        <div class="toolbar">
          <div class="left-section">
            <input type="checkbox" v-model="selectAllReceived" @change="toggleSelectAll('received')" />
            <span class="select-text">받은쪽지 ({{ receivedMessages.length }})</span>
          </div>
          <div class="center-section">
            <input 
              type="text" 
              placeholder="쪽지 검색..." 
              class="search-input"
              v-model="searchQuery"
            />
          </div>
          <div class="right-section">
            <button class="action-btn" @click="openComposeModal">+ 새 쪽지</button>
          </div>
        </div>

        <div class="message-actions">
          <button class="btn-icon" @click="markSelectedAsRead">👁️ 읽음</button>
          <button class="btn-icon delete" @click="deleteSelected('received')">🗑️ 삭제</button>
        </div>

        <div class="message-list">
          <div 
            v-for="message in receivedMessages" 
            :key="message.id"
            :class="['message-item', { unread: !message.isRead, read: message.isRead }]"
            @click="openMessageDetail(message)"
          >
            <input type="checkbox" v-model="message.selected" @click.stop />
            
            <div class="avatar" :style="{ backgroundColor: message.avatarColor }">
              {{ message.sender.charAt(0) }}
            </div>
            
            <div class="message-content">
              <div class="message-header">
                <h4 class="message-title">{{ message.title }}</h4>
                <span class="message-date">{{ message.date }}</span>
              </div>
              <p class="message-preview">{{ message.preview }}</p>
            </div>

            <div class="message-actions-right">
              <button class="btn-reply" @click.stop="replyToMessage(message)">↩️</button>
              <button class="btn-more" @click.stop>⋯</button>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button class="page-btn" :disabled="currentPage === 1">‹ 이전</button>
          <button 
            v-for="page in totalPages" 
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button class="page-btn" :disabled="currentPage === totalPages">다음 ›</button>
        </div>
      </div>

      <!-- 보낸쪽지함 -->
      <div v-if="currentTab === 'sent'" class="tab-content">
        <div class="content-header">
          <h2>보낸쪽지함</h2>
          <p class="subtitle">총 {{ sentMessages.length }}개의 쪽지</p>
        </div>

        <div class="toolbar">
          <div class="left-section">
            <input type="checkbox" v-model="selectAllSent" @change="toggleSelectAll('sent')" />
            <span class="select-text">보낸쪽지 ({{ sentMessages.length }})</span>
          </div>
          <div class="center-section">
            <input 
              type="text" 
              placeholder="쪽지 검색..." 
              class="search-input"
              v-model="searchQuery"
            />
          </div>
          <div class="right-section">
            <button class="action-btn" @click="openComposeModal">+ 새 쪽지</button>
          </div>
        </div>

        <div class="message-actions">
          <button class="btn-icon delete" @click="deleteSelected('sent')">🗑️ 삭제</button>
        </div>

        <div class="message-list">
          <div 
            v-for="message in sentMessages" 
            :key="message.id"
            class="message-item"
            :class="{ 'read-by-receiver': message.isReadByReceiver }"
            @click="openSentMessageDetail(message)"
          >
            <input type="checkbox" v-model="message.selected" @click.stop />
            
            <div class="avatar" :style="{ backgroundColor: message.avatarColor }">
              {{ message.receiver.charAt(0) }}
            </div>
            
            <div class="message-content">
              <div class="message-header">
                <h4 class="message-title">{{ message.title }}</h4>
                <span class="message-date">{{ message.date }}</span>
              </div>
              <p class="message-preview">{{ message.preview }}</p>
            </div>

            <div class="message-actions-right">
              <span class="read-status" :class="{ read: message.isReadByReceiver }">
                {{ message.isReadByReceiver ? '읽음' : '안읽음' }}
              </span>
              <button class="btn-more" @click.stop>⋯</button>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button class="page-btn" :disabled="currentPage === 1">‹ 이전</button>
          <button 
            v-for="page in 2" 
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button class="page-btn" :disabled="currentPage === 2">다음 ›</button>
        </div>
      </div>

      <!-- 휴지통 -->
      <div v-if="currentTab === 'trash'" class="tab-content">
        <div class="content-header">
          <h2>쪽지통</h2>
          <p class="subtitle">삭제된 쪽지는 30일 후 자동 삭제됩니다</p>
        </div>

        <div class="toolbar">
          <div class="left-section">
            <input type="checkbox" v-model="selectAllTrash" @change="toggleSelectAll('trash')" />
            <span class="select-text">쪽지통 ({{ trashedMessages.length }})</span>
          </div>
          <div class="center-section">
            <input 
              type="text" 
              placeholder="쪽지 검색..." 
              class="search-input"
              v-model="searchQuery"
            />
          </div>
          <div class="right-section">
            <button class="action-btn" @click="openComposeModal">+ 새 쪽지</button>
          </div>
        </div>

        <div class="message-actions">
          <button class="btn-icon" @click="restoreSelected">↩️ 복구</button>
          <button class="btn-icon delete" @click="permanentlyDeleteSelected">🗑️ 영구 삭제</button>
        </div>

        <div v-if="trashedMessages.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-text">삭제된 쪽지가 없습니다</p>
          <p class="empty-subtext">쪽지통에는 삭제한 쪽지가 보관됩니다</p>
        </div>

        <div v-else class="message-list">
          <div 
            v-for="message in trashedMessages" 
            :key="message.id"
            class="message-item"
          >
            <input type="checkbox" v-model="message.selected" @click.stop />
            
            <div class="avatar" :style="{ backgroundColor: message.avatarColor }">
              {{ (message.sender || message.receiver).charAt(0) }}
            </div>
            
            <div class="message-content">
              <div class="message-header">
                <h4 class="message-title">{{ message.title }}</h4>
                <span class="message-date">{{ message.date }}</span>
              </div>
              <p class="message-preview">{{ message.preview }}</p>
            </div>

            <div class="message-actions-right">
              <span class="trash-label">{{ message.fromBox }}</span>
              <button class="btn-more" @click.stop>⋯</button>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button class="page-btn" :disabled="currentPage === 1">‹ 이전</button>
          <button class="page-btn active">1</button>
          <button class="page-btn" :disabled="trashedMessages.length === 0">다음 ›</button>
        </div>
      </div>
    </div>

    <!-- 새 쪽지 작성 모달 -->
    <Teleport to="body">
      <div v-if="showComposeModal" class="modal-overlay" @click="closeComposeModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <span class="icon">✏️</span> 새 쪽지 작성
            </h3>
            <button class="close-btn" @click="closeComposeModal">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">받는 사람</label>
              <input 
                type="text" 
                class="form-input" 
                placeholder="👤 사용자아이디 또는 이메일 입력"
                v-model="composeForm.recipient"
              />
            </div>

            <div class="form-group">
              <label class="form-label">내용</label>
              <textarea 
                class="form-textarea" 
                placeholder="메시지 내용을 입력하세요..."
                v-model="composeForm.content"
                rows="10"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeComposeModal">취소</button>
            <button class="btn-send" @click="sendMessage">
              <span>✈️</span> 보내기
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 받은쪽지 상세보기 모달 -->
    <Teleport to="body">
      <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
        <div class="modal-container detail-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <span class="icon">📧</span> 받은쪽지
            </h3>
            <button class="close-btn" @click="closeDetailModal">✕</button>
          </div>

          <div class="modal-body">
            <div class="message-detail-header">
              <div class="sender-info">
                <div class="avatar-large" :style="{ backgroundColor: selectedMessage?.avatarColor }">
                  {{ selectedMessage?.sender?.charAt(0) }}
                </div>
                <div class="sender-details">
                  <h4 class="sender-name">{{ selectedMessage?.title }}</h4>
                  <p class="sender-email">{{ selectedMessage?.senderEmail }}</p>
                </div>
              </div>
              <div class="message-time">{{ selectedMessage?.fullDate }}</div>
            </div>

            <div class="message-recipient">
              받는 사람: <span class="recipient-email">{{ selectedMessage?.recipientEmail }}</span>
            </div>

            <div class="message-detail-content">
              {{ selectedMessage?.fullContent }}
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeDetailModal">확인</button>
            <button class="btn-send" @click="replyToCurrentMessage">
              <span>↩️</span> 답장하기
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 보낸쪽지 상세보기 모달 -->
    <Teleport to="body">
      <div v-if="showSentDetailModal" class="modal-overlay" @click="closeSentDetailModal">
        <div class="modal-container detail-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <span class="icon">📤</span> 보낸쪽지
            </h3>
            <button class="close-btn" @click="closeSentDetailModal">✕</button>
          </div>

          <div class="modal-body">
            <div class="message-detail-header">
              <div class="sender-info">
                <div class="avatar-large" :style="{ backgroundColor: selectedSentMessage?.avatarColor }">
                  {{ selectedSentMessage?.receiver?.charAt(0) }}
                </div>
                <div class="sender-details">
                  <h4 class="sender-name">{{ selectedSentMessage?.title }}</h4>
                  <p class="sender-email">{{ selectedSentMessage?.receiverEmail }}</p>
                </div>
              </div>
              <div class="message-time">{{ selectedSentMessage?.fullDate }}</div>
            </div>

            <div class="message-recipient">
              받는 사람: <span class="recipient-email">{{ selectedSentMessage?.receiverEmail }}</span>
            </div>

            <div class="message-detail-content">
              {{ selectedSentMessage?.fullContent }}
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeSentDetailModal">확인</button>
            <button class="btn-send" @click="resendMessage">
              <span>📤</span> 다시 보내기
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentTab = ref('received')
const searchQuery = ref('')
const selectAllReceived = ref(false)
const selectAllSent = ref(false)
const selectAllTrash = ref(false)
const currentPage = ref(1)
const totalPages = ref(3)

const showComposeModal = ref(false)
const showDetailModal = ref(false)
const showSentDetailModal = ref(false)
const selectedMessage = ref(null)
const selectedSentMessage = ref(null)

const composeForm = ref({
  recipient: '',
  content: ''
})

const receivedMessages = ref([
  {
    id: 1,
    sender: '보소스',
    senderEmail: 'seoulovedog@gmail.com',
    recipientEmail: 'dain0404@company.com',
    title: '서울 유기견 보호소',
    preview: '봉사모임이 마감되어 다시 인원을 받게 됐고 안내드...',
    fullContent: `안녕하세요! 서울 유기견 보호소입니다.

서울 유기견 보호소 이번 유기견 견사 청소모임은 마감되었습니다.
다음 모임도 곧 있을 예정입니다.
다음에 신청해주시길 부탁드립니다!`,
    date: '오전 10:16',
    fullDate: '2025년 10월 21일 오전 10:16',
    isRead: false,
    selected: false,
    avatarColor: '#FFE4B5'
  },
  {
    id: 2,
    sender: '최예원',
    senderEmail: 'yewon.choi@email.com',
    recipientEmail: 'dain0404@company.com',
    title: '최예원',
    preview: '일하는 다른 일정들이랑 같이 본격 준비 중이니 개인적으로 관심있으면 알려...',
    fullContent: `안녕하세요!

일하는 다른 일정들이랑 같이 본격 준비 중이니 개인적으로 관심있으면 알려주세요.
함께 진행하면 좋을 것 같습니다.`,
    date: '오전 10:15',
    fullDate: '2025년 10월 21일 오전 10:15',
    isRead: true,
    selected: false,
    avatarColor: '#FFD700'
  },
  {
    id: 3,
    sender: '관리자',
    senderEmail: 'admin@system.com',
    recipientEmail: 'dain0404@company.com',
    title: '관리자',
    preview: '게시글 삭제 누적 5회가 되었습니다. 이에 따른 조치가 이루어질 수 있습니다.',
    fullContent: `게시글 삭제 누적 5회가 되었습니다. 이에 따른 조치가 이루어질 수 있습니다.

커뮤니티 가이드라인을 준수해주시기 바랍니다.`,
    date: '어제',
    fullDate: '2025년 10월 20일 오후 3:42',
    isRead: true,
    selected: false,
    avatarColor: '#D3D3D3'
  }
])

const sentMessages = ref([
  {
    id: 1,
    receiver: '김철수',
    receiverEmail: 'kimcs@email.com',
    title: '봉사활동 문의',
    preview: '안녕하세요. 다음 주 봉사활동 참여 가능한지 문의드립니다...',
    fullContent: `안녕하세요. 다음 주 봉사활동 참여 가능한지 문의드립니다.

시간이 되신다면 함께 참여하면 좋을 것 같아서 연락드립니다.
답변 부탁드립니다.

감사합니다.`,
    date: '오후 3:20',
    fullDate: '2025년 10월 20일 오후 3:20',
    isReadByReceiver: true,
    selected: false,
    avatarColor: '#B8E6B8'
  },
  {
    id: 2,
    receiver: '이영희',
    receiverEmail: 'leeyh@email.com',
    title: '회의 일정 조율',
    preview: '회의 시간을 조정하고 싶은데 괜찮으실까요?',
    fullContent: `안녕하세요.

회의 시간을 조정하고 싶은데 괜찮으실까요?
다른 일정과 겹쳐서 시간 변경이 필요할 것 같습니다.

가능하신 시간대를 알려주시면 감사하겠습니다.`,
    date: '오전 11:30',
    fullDate: '2025년 10월 20일 오전 11:30',
    isReadByReceiver: false,
    selected: false,
    avatarColor: '#FFB8D1'
  }
])

const trashedMessages = ref([])

const unreadCount = computed(() => {
  return receivedMessages.value.filter(msg => !msg.isRead).length
})

const toggleSelectAll = (type) => {
  if (type === 'received') {
    receivedMessages.value.forEach(msg => {
      msg.selected = selectAllReceived.value
    })
  } else if (type === 'sent') {
    sentMessages.value.forEach(msg => {
      msg.selected = selectAllSent.value
    })
  } else if (type === 'trash') {
    trashedMessages.value.forEach(msg => {
      msg.selected = selectAllTrash.value
    })
  }
}

const markSelectedAsRead = () => {
  const selectedMessages = receivedMessages.value.filter(msg => msg.selected)
  if (selectedMessages.length === 0) {
    alert('읽음 처리할 쪽지를 선택해주세요.')
    return
  }
  
  selectedMessages.forEach(msg => {
    msg.isRead = true
    msg.selected = false
  })
  
  selectAllReceived.value = false
  alert(`${selectedMessages.length}개의 쪽지를 읽음 처리했습니다.`)
}

const deleteSelected = (type) => {
  let messages
  if (type === 'received') {
    messages = receivedMessages.value.filter(msg => msg.selected)
    if (messages.length === 0) {
      alert('삭제할 쪽지를 선택해주세요.')
      return
    }
    
    messages.forEach(msg => {
      msg.fromBox = '받은쪽지함'
      trashedMessages.value.push({...msg})
    })
    
    receivedMessages.value = receivedMessages.value.filter(msg => !msg.selected)
    selectAllReceived.value = false
  } else if (type === 'sent') {
    messages = sentMessages.value.filter(msg => msg.selected)
    if (messages.length === 0) {
      alert('삭제할 쪽지를 선택해주세요.')
      return
    }
    
    messages.forEach(msg => {
      msg.fromBox = '보낸쪽지함'
      trashedMessages.value.push({...msg})
    })
    
    sentMessages.value = sentMessages.value.filter(msg => !msg.selected)
    selectAllSent.value = false
  }
  
  alert(`${messages.length}개의 쪽지를 삭제했습니다.`)
}

const restoreSelected = () => {
  const selectedMessages = trashedMessages.value.filter(msg => msg.selected)
  if (selectedMessages.length === 0) {
    alert('복구할 쪽지를 선택해주세요.')
    return
  }
  
  selectedMessages.forEach(msg => {
    if (msg.fromBox === '받은쪽지함') {
      receivedMessages.value.push({...msg, selected: false, fromBox: undefined})
    } else if (msg.fromBox === '보낸쪽지함') {
      sentMessages.value.push({...msg, selected: false, fromBox: undefined})
    }
  })
  
  trashedMessages.value = trashedMessages.value.filter(msg => !msg.selected)
  selectAllTrash.value = false
  
  alert(`${selectedMessages.length}개의 쪽지를 복구했습니다.`)
}

const permanentlyDeleteSelected = () => {
  const selectedMessages = trashedMessages.value.filter(msg => msg.selected)
  if (selectedMessages.length === 0) {
    alert('영구 삭제할 쪽지를 선택해주세요.')
    return
  }
  
  if (confirm(`${selectedMessages.length}개의 쪽지를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
    trashedMessages.value = trashedMessages.value.filter(msg => !msg.selected)
    selectAllTrash.value = false
    alert('선택한 쪽지가 영구 삭제되었습니다.')
  }
}

const openComposeModal = () => {
  showComposeModal.value = true
  composeForm.value = {
    recipient: '',
    content: ''
  }
}

const closeComposeModal = () => {
  showComposeModal.value = false
}

const sendMessage = () => {
  if (!composeForm.value.recipient || !composeForm.value.content) {
    alert('받는 사람과 내용을 모두 입력해주세요.')
    return
  }
  alert('쪽지가 전송되었습니다!')
  closeComposeModal()
}

const openMessageDetail = (message) => {
  selectedMessage.value = message
  showDetailModal.value = true
  // 읽음 처리
  message.isRead = true
}

const openSentMessageDetail = (message) => {
  selectedSentMessage.value = message
  showSentDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedMessage.value = null
}

const closeSentDetailModal = () => {
  showSentDetailModal.value = false
  selectedSentMessage.value = null
}

const replyToMessage = (message) => {
  composeForm.value.recipient = message.senderEmail
  openComposeModal()
}

const replyToCurrentMessage = () => {
  if (selectedMessage.value) {
    composeForm.value.recipient = selectedMessage.value.senderEmail
    closeDetailModal()
    openComposeModal()
  }
}

const resendMessage = () => {
  if (selectedSentMessage.value) {
    composeForm.value.recipient = selectedSentMessage.value.receiverEmail
    composeForm.value.content = selectedSentMessage.value.fullContent
    closeSentDetailModal()
    openComposeModal()
  }
}
</script>

<style scoped>
.jjokji-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #F5EFE7;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.profile-section {
  background: #FFFBF5;
  border-radius: 22px;
  padding: 34px 26px;
  text-align: center;
  margin-bottom: 24px;
  border: 1px solid #F1E1C9;
  box-shadow: 0 16px 30px rgba(210, 182, 132, 0.18);
}

.ascii-art {
  margin-bottom: 18px;
}

.ascii-art pre {
  font-size: 14px;
  line-height: 1.2;
  color: #333;
  margin: 0;
}

.username {
  font-size: 22px;
  font-weight: 700;
  margin: 14px 0 12px;
  color: #2F2415;
}

.badge {
  display: inline-block;
  background: #E8C88A;
  color: #3D2B15;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,0.08);
}

.profile-divider {
  width: 100%;
  height: 1px;
  background: #F1E4D1;
  margin: 24px 0 20px;
}

.write-btn {
  width: 100%;
  padding: 15px 18px;
  background: #F7F1E6;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  transition: all 0.2s;
  color: #2F2415;
  box-shadow: inset 0 -3px 0 rgba(0,0,0,0.05);
}

.write-btn:hover {
  background: #F2E6D4;
}

.write-btn .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #E7C890;
  color: #2F2415;
  font-size: 14px;
}

.menu-section {
  background: #FFFBF5;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 14px 28px rgba(210, 182, 132, 0.12);
  border: 1px solid #F1E1C9;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-bottom: 1px solid #F2E6D6;
  color: #7A6854;
  font-weight: 600;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item.active {
  background: #E7C890;
  color: #1F1409;
}

.menu-item:hover:not(.active) {
  background: #F4E6D1;
}

.menu-item .count {
  margin-left: auto;
  background: #EDE0CB;
  color: #53402B;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.menu-item.active .count {
  background: #1B130A;
  color: #fff;
  box-shadow: 0 4px 10px rgba(27, 19, 10, 0.3);
}

.menu-item .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 12px;
  background: #F2E6D4;
  color: #6C553B;
  font-size: 14px;
  flex-shrink: 0;
}

.menu-item.active .icon {
  background: #D9A85A;
  color: #1F1409;
}

/* Main Content */
.main-content {
  flex: 1;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 36px 34px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border: 1px solid #EFE5D4;
}

.content-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 5px;
  color: #2F2415;
}

.subtitle {
  color: #8D806D;
  font-size: 15px;
  margin: 0 0 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border: 1px solid #F0E5D4;
  border-radius: 14px;
  background: #FBF6EE;
  margin-bottom: 18px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #6E5A45;
}

.select-text {
  font-weight: 600;
  color: #3E2E1F;
}

.search-input {
  padding: 10px 18px;
  border: 1px solid #E8D7BC;
  border-radius: 999px;
  width: 260px;
  font-size: 15px;
  background: #FFF;
  color: #5E4A36;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
}

.search-input:focus {
  outline: none;
  border-color: #D6A358;
  background: #FFFEFB;
}

.action-btn {
  padding: 10px 18px;
  background: #D6A358;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-btn:hover {
  background: #C28C38;
  transform: translateY(-1px);
}

.message-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}

.btn-icon {
  padding: 8px 14px;
  background: #FFF8EC;
  border: 1px solid #E8D6BB;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #735738;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #F4E4C7;
}

.btn-icon.delete {
  color: #D96060;
  background: #FFF2F0;
  border-color: #F2C8C8;
}

/* Message List */
.message-list {
  margin-bottom: 20px;
  border: 1px solid #EFE5D4;
  border-radius: 16px;
  overflow: hidden;
  background: #FFFFFF;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
}

.message-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 26px;
  border-bottom: 1px solid #F1E6D6;
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
  background: white;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item:hover {
  background: #FFF3E1;
}

.message-item.unread {
  background: #FAEDD6;
  box-shadow: inset 5px 0 0 #D6A358;
}

.message-item.read {
  background: #F9F5EE;
}

.message-item.unread .message-title {
  color: #2F2415;
  font-weight: 700;
}

.message-item.unread .message-preview {
  color: #5B4B37;
  font-weight: 600;
}

.message-item.read .message-title {
  color: #72685C;
  font-weight: 600;
}

.message-item.read .message-preview {
  color: #9F9588;
}

.message-item.read .message-date {
  color: #B8B0A4;
}

.message-item.read-by-receiver {
  opacity: 0.6;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  color: #FFFFFF;
  background: linear-gradient(135deg, #D6A358 0%, #E4BC70 100%);
  box-shadow: 0 4px 10px rgba(214,163,88,0.35);
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #3A2D1D;
}

.message-date {
  font-size: 13px;
  color: #A59685;
  white-space: nowrap;
}

.message-preview {
  font-size: 14px;
  color: #7C6B58;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-actions-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.read-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  background: #F7EDDA;
  color: #B9863D;
}

.read-status.read {
  background: #E6F3E0;
  color: #579653;
}

.trash-label {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  background: #F5F0E8;
  color: #999;
}

.btn-reply, .btn-more {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  color: #B59B74;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
}

.btn-reply:hover, .btn-more:hover {
  opacity: 1;
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
  margin: 0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
  padding: 14px 18px;
  border: 1px solid #EFE5D4;
  border-radius: 14px;
  background: #FBF6EE;
}

.page-btn {
  padding: 8px 16px;
  background: #FFFFFF;
  border: 1px solid #E8D6BB;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #6E5A45;
  font-weight: 600;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: #F6E8D6;
}

.page-btn.active {
  background: #D6A358;
  color: white;
  border-color: #D6A358;
  box-shadow: 0 6px 12px rgba(214,163,88,0.35);
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background: #F3E7D3;
  border-color: #E5D4BC;
}

/* Modal Styles */
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
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #F0E6D2;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F5F0E8;
  color: #333;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E8DCC8;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #FFB84D;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E8DCC8;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #FFB84D;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #F0E6D2;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 20px;
  background: white;
  border: 1px solid #E8DCC8;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.btn-cancel:hover {
  background: #F5F0E8;
}

.btn-send {
  padding: 10px 20px;
  background: #FFB84D;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-send:hover {
  background: #FF9F1C;
}

/* Message Detail Modal */
.detail-modal .modal-body {
  padding: 0;
}

.message-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #F5F0E8;
}

.sender-info {
  display: flex;
  gap: 16px;
}

.avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  flex-shrink: 0;
}

.sender-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sender-name {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.sender-email {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.message-time {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
}

.message-recipient {
  padding: 16px 24px;
  background: #FAFAF8;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #F5F0E8;
}

.recipient-email {
  font-weight: 600;
  color: #333;
}

.message-detail-content {
  padding: 24px;
  font-size: 15px;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
  min-height: 200px;
}
</style>