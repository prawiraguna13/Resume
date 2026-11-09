/**
 * Main Application Logic
 * Handles WhatsApp contact binding, theme toggle, and warm spotlight follower.
 */

// =============================================================================
// KONFIGURASI NOMOR WHATSAPP (Ubah nomor di bawah ini sesuai nomor WhatsApp Anda)
// =============================================================================
const WHATSAPP_CONFIG = {
  // Format nomor: awali dengan kode negara tanpa simbol + (contoh: 6281234567890)
  phoneNumber: '6281234567890',
  defaultMessage: 'Halo Pak Kian Tangguh Prawiraguna! Saya telah melihat portofolio Anda dan tertarik untuk berdiskusi lebih lanjut.',
};

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initThemeToggle();
  initSpotlightFollower();
  initDynamicYear();
  initAvatarDetection();
});

/**
 * Otomatis mendeteksi jika user meletakkan file foto avatar.jpg / avatar.png
 */
function initAvatarDetection() {
  const avatarImg = document.querySelector('.avatar-photo');
  const fallbackGraphic = document.querySelector('.avatar-network-graphic');
  if (!avatarImg) return;

  const candidateExtensions = ['avatar.jpg', 'avatar.png', 'avatar.webp', 'foto.jpg', 'foto.png'];
  
  function tryLoad(index) {
    if (index >= candidateExtensions.length) return;
    const testImg = new Image();
    testImg.src = candidateExtensions[index];
    testImg.onload = () => {
      avatarImg.src = candidateExtensions[index];
      avatarImg.style.display = 'block';
      if (fallbackGraphic) fallbackGraphic.style.display = 'none';
    };
    testImg.onerror = () => {
      tryLoad(index + 1);
    };
  }

  tryLoad(0);
}

/**
 * Configure all WhatsApp links with phone number and prefilled URL
 */
function initWhatsAppLinks() {
  const encodedMsg = encodeURIComponent(WHATSAPP_CONFIG.defaultMessage);
  const waUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMsg}`;

  // Update all wa-link elements
  const waLinks = document.querySelectorAll('.wa-link');
  waLinks.forEach((link) => {
    link.href = waUrl;
  });

  // Display human-readable formatted phone number in contact card
  const displayElement = document.getElementById('waDisplayNumber');
  if (displayElement) {
    const raw = WHATSAPP_CONFIG.phoneNumber;
    // Format 6281234567890 -> +62 812-3456-7890
    if (raw.startsWith('62')) {
      const formatted = `+62 ${raw.slice(2, 5)}-${raw.slice(5, 9)}-${raw.slice(9)}`;
      displayElement.textContent = formatted;
    } else {
      displayElement.textContent = `+${raw}`;
    }
  }
}

/**
 * Dark / Light Mode Toggle with Persistence
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('neteng_theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('neteng_theme', newTheme);
  });
}

/**
 * Interactive Warm Spotlight Follower
 * Subtle damped tracking of cursor for cinematic warm studio lighting.
 */
function initSpotlightFollower() {
  const spotlight = document.getElementById('spotlight');
  if (!spotlight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight * 0.15;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(updateSpotlight);
    }
  });

  function updateSpotlight() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const core = isDark ? 'rgba(255, 214, 153, 0.16)' : 'rgba(255, 220, 160, 0.22)';
    const warm = isDark ? 'rgba(245, 158, 11, 0.10)' : 'rgba(245, 158, 11, 0.08)';
    const sec = isDark ? 'rgba(217, 119, 6, 0.05)' : 'rgba(251, 191, 36, 0.04)';

    spotlight.style.background = `radial-gradient(circle 750px at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, ${core} 0%, ${warm} 35%, ${sec} 65%, transparent 100%)`;

    if (Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
      requestAnimationFrame(updateSpotlight);
    } else {
      isMoving = false;
    }
  }
}

/**
 * Auto update year in footer
 */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
