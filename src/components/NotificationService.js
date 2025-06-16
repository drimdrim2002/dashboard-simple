// NotificationService.js - 다양한 알림 방식을 제공하는 서비스

class NotificationService {
  constructor() {
    this.notificationType = 'snackbar'; // 기본값: 'modal', 'banner', 'snackbar'
  }

  // 알림 방식 변경
  setNotificationType(type) {
    this.notificationType = type;
  }

  // 메인 알림 메서드
  showMessage(message, type = 'info') {
    switch (this.notificationType) {
      case 'modal':
        this.showModalMessage(message, type);
        break;
      case 'banner':
        this.showBannerMessage(message, type);
        break;
      case 'snackbar':
      default:
        this.showSnackbarMessage(message, type);
        break;
    }
  }

  // Modal 다이얼로그 방식
  showModalMessage(message, type) {
    // 기존 모달 제거
    const existingModal = document.querySelector(".notification-modal-backdrop");
    if (existingModal) {
      existingModal.remove();
    }

    // 모달 배경
    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "notification-modal-backdrop";
    
    // 모달 컨테이너
    const modal = document.createElement("div");
    modal.className = "notification-modal";
    modal.innerHTML = `
      <div class="notification-modal-content">
        <div class="notification-modal-header">
          <span class="notification-icon">${this.getIcon(type)}</span>
          <h6 class="notification-title">${this.getTitle(type)}</h6>
          <button class="notification-close" onclick="this.closest('.notification-modal-backdrop').remove()">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="notification-modal-body">
          <p class="notification-message">${message}</p>
        </div>
        <div class="notification-modal-footer">
          <button class="btn btn-sm btn-primary" onclick="this.closest('.notification-modal-backdrop').remove()">
            확인
          </button>
        </div>
      </div>
    `;

    modalBackdrop.appendChild(modal);
    this.addModalStyles();
    document.body.appendChild(modalBackdrop);

    // 배경 클릭시 닫기
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.remove();
      }
    });

    // ESC 키로 닫기
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modalBackdrop.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // 3초 후 자동 제거
    setTimeout(() => {
      if (modalBackdrop.parentNode) {
        modalBackdrop.style.opacity = '0';
        setTimeout(() => {
          modalBackdrop.remove();
          document.removeEventListener('keydown', escHandler);
        }, 300);
      }
    }, 3000);
  }

  // 상단 배너 방식
  showBannerMessage(message, type) {
    // 기존 배너 제거
    const existingBanner = document.querySelector(".notification-banner");
    if (existingBanner) {
      existingBanner.remove();
    }

    // 배너 요소 생성
    const banner = document.createElement("div");
    banner.className = "notification-banner";
    banner.innerHTML = `
      <div class="notification-banner-content">
        <div class="notification-banner-left">
          <span class="notification-icon">${this.getIcon(type)}</span>
          <span class="notification-message">${message}</span>
        </div>
        <button class="notification-banner-close" onclick="this.parentElement.parentElement.remove()">
          <i class="bi bi-x"></i>
        </button>
      </div>
    `;

    this.addBannerStyles(type);
    document.body.insertBefore(banner, document.body.firstChild);

    // 3초 후 자동 제거
    setTimeout(() => {
      if (banner.parentNode) {
        banner.style.transform = 'translateY(-100%)';
        setTimeout(() => banner.remove(), 300);
      }
    }, 3000);
  }

  // Snackbar 방식 (하단에서 올라오는)
  showSnackbarMessage(message, type) {
    // 기존 스낵바 제거
    const existingSnackbar = document.querySelector(".notification-snackbar");
    if (existingSnackbar) {
      existingSnackbar.remove();
    }

    // 스낵바 요소 생성
    const snackbar = document.createElement("div");
    snackbar.className = "notification-snackbar";
    snackbar.innerHTML = `
      <div class="notification-snackbar-content">
        <span class="notification-icon">${this.getIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-snackbar-close" onclick="this.parentElement.parentElement.remove()">
          <i class="bi bi-x"></i>
        </button>
      </div>
    `;

    this.addSnackbarStyles(type);
    document.body.appendChild(snackbar);

    // 3초 후 자동 제거
    setTimeout(() => {
      if (snackbar.parentNode) {
        snackbar.style.transform = 'translateY(100%)';
        setTimeout(() => snackbar.remove(), 300);
      }
    }, 3000);
  }

  // 헬퍼 메서드들
  getIcon(type) {
    const icons = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    };
    return icons[type] || "ℹ️";
  }

  getTitle(type) {
    const titles = {
      info: "정보",
      success: "성공",
      warning: "경고",
      error: "오류",
    };
    return titles[type] || "알림";
  }

  getColors(type) {
    const colorMap = {
      info: {
        bg: '#d1ecf1',
        text: '#0c5460',
        border: '#bee5eb'
      },
      success: {
        bg: '#d4edda',
        text: '#155724',
        border: '#c3e6cb'
      },
      warning: {
        bg: '#fff3cd',
        text: '#856404',
        border: '#ffeaa7'
      },
      error: {
        bg: '#f8d7da',
        text: '#721c24',
        border: '#f5c6cb'
      }
    };
    return colorMap[type] || colorMap.info;
  }

  // 스타일 추가 메서드들
  addModalStyles() {
    if (document.querySelector("#modal-notification-styles")) return;
    
    const style = document.createElement("style");
    style.id = "modal-notification-styles";
    style.textContent = `
      .notification-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
      }
      
      .notification-modal {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        min-width: 400px;
        max-width: 500px;
        animation: modalSlideIn 0.3s ease-out;
      }
      
      .notification-modal-content {
        padding: 0;
      }
      
      .notification-modal-header {
        display: flex;
        align-items: center;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #dee2e6;
        background-color: #f8f9fa;
        border-radius: 12px 12px 0 0;
      }
      
      .notification-modal-header .notification-icon {
        font-size: 1.2rem;
        margin-right: 0.5rem;
      }
      
      .notification-title {
        flex: 1;
        margin: 0;
        font-weight: 600;
        font-size: 1.1rem;
      }
      
      .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
      }
      
      .notification-close:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
      
      .notification-modal-body {
        padding: 1.25rem;
      }
      
      .notification-modal-body .notification-message {
        margin: 0;
        line-height: 1.5;
      }
      
      .notification-modal-footer {
        padding: 1rem 1.25rem;
        border-top: 1px solid #dee2e6;
        text-align: right;
        background-color: #f8f9fa;
        border-radius: 0 0 12px 12px;
      }
      
      .notification-modal-footer .btn {
        padding: 0.375rem 0.75rem;
        border: 1px solid transparent;
        border-radius: 0.375rem;
        background: none;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
        font-size: 0.875rem;
      }
      
      .notification-modal-footer .btn-primary {
        background-color: #0d6efd;
        border-color: #0d6efd;
        color: white;
      }
      
      .notification-modal-footer .btn-primary:hover {
        background-color: #0b5ed7;
        border-color: #0a58ca;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes modalSlideIn {
        from { transform: scale(0.7); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  addBannerStyles(type) {
    if (document.querySelector("#banner-notification-styles")) return;
    
    const colors = this.getColors(type);
    const style = document.createElement("style");
    style.id = "banner-notification-styles";
    style.textContent = `
      .notification-banner {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: ${colors.bg};
        color: ${colors.text};
        border-bottom: 1px solid ${colors.border};
        z-index: 10000;
        transform: translateY(-100%);
        animation: bannerSlideDown 0.3s ease-out forwards;
      }
      
      .notification-banner-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .notification-banner-left {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .notification-banner .notification-icon {
        font-size: 1.1rem;
      }
      
      .notification-banner .notification-message {
        font-weight: 500;
      }
      
      .notification-banner-close {
        background: none;
        border: none;
        color: ${colors.text};
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        font-size: 1.1rem;
      }
      
      .notification-banner-close:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
      
      @keyframes bannerSlideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  addSnackbarStyles(type) {
    if (document.querySelector("#snackbar-notification-styles")) return;
    
    const colors = this.getColors(type);
    const style = document.createElement("style");
    style.id = "snackbar-notification-styles";
    style.textContent = `
      .notification-snackbar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translate(-50%, 100%);
        background: ${colors.bg};
        color: ${colors.text};
        border: 1px solid ${colors.border};
        border-radius: 8px;
        padding: 0.75rem 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        animation: snackbarSlideUp 0.3s ease-out forwards;
      }
      
      .notification-snackbar-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .notification-snackbar .notification-icon {
        font-size: 1.1rem;
      }
      
      .notification-snackbar .notification-message {
        flex: 1;
        font-weight: 500;
      }
      
      .notification-snackbar-close {
        background: none;
        border: none;
        color: ${colors.text};
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        font-size: 1.1rem;
        margin-left: 0.5rem;
      }
      
      .notification-snackbar-close:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
      
      @keyframes snackbarSlideUp {
        from { transform: translate(-50%, 100%); }
        to { transform: translate(-50%, 0); }
      }
    `;
    document.head.appendChild(style);
  }
}

// 전역 인스턴스 생성
const notificationService = new NotificationService();

export default notificationService; 