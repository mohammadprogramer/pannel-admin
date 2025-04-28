document.addEventListener('DOMContentLoaded', function() {
  // --- تعاریف توابع ---
  
  // تغییر تم
  function setupThemeToggle() {
      const themeToggle = document.getElementById('themeToggle');
      const body = document.body;
      
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === 'enabled') {
          body.classList.add('dark-mode');
          themeToggle.checked = true;
      }
      
      themeToggle.addEventListener('change', function() {
          if (this.checked) {
              body.classList.add('dark-mode');
              localStorage.setItem('darkMode', 'enabled');
          } else {
              body.classList.remove('dark-mode');
              localStorage.removeItem('darkMode');
          }
      });
  }

  // مدیریت منوی کناری
  function setupSidebar() {
      const navbarToggler = document.querySelector('.navbar-toggler');
      const sidebar = document.querySelector('.sidebar');
      const closeSidebarBtn = document.querySelector('.close-sidebar');
      
      function openSidebar() {
          sidebar.classList.add('active');
          document.body.style.overflow = 'hidden';
      }
      
      function closeSidebar() {
          sidebar.classList.remove('active');
          document.body.style.overflow = '';
      }
      
      navbarToggler.addEventListener('click', function(e) {
          e.stopPropagation();
          openSidebar();
      });
      
      closeSidebarBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          closeSidebar();
      });
      
      document.addEventListener('click', function(e) {
          if (sidebar.classList.contains('active') && 
              !sidebar.contains(e.target) && 
              !navbarToggler.contains(e.target) &&
              !closeSidebarBtn.contains(e.target)) {
              closeSidebar();
          }
      });
      
      window.addEventListener('resize', function() {
          if (window.innerWidth > 992) {
              closeSidebar();
          }
      });
  }

  // مدیریت نمایش بخش‌ها
  function setupContentSections() {
      function showSection(sectionId) {
          document.querySelectorAll('.content-section').forEach(section => {
              section.style.display = 'none';
          });
          
          const activeSection = document.getElementById(sectionId);
          if (activeSection) {
              activeSection.style.display = 'block';
          }
          
          document.querySelectorAll('.sidebar-menu a').forEach(link => {
              link.classList.remove('active');
          });
          
          const activeLink = document.querySelector(`.sidebar-menu a[href="#${sectionId}"]`);
          if (activeLink) {
              activeLink.classList.add('active');
          }
      }
      
      document.querySelectorAll('.sidebar-menu a').forEach(link => {
          link.addEventListener('click', function(e) {
              e.preventDefault();
              const sectionId = this.getAttribute('href').substring(1);
              showSection(sectionId);
              
              // بستن منو در حالت موبایل
              if (window.innerWidth <= 992) {
                  document.querySelector('.sidebar').classList.remove('active');
              }
          });
      });
      
      showSection('dashboard-section');
  }

  // مدیریت زیرمنوها
  function setupSubmenus() {
      const submenuToggles = document.querySelectorAll('.has-submenu > a');
      
      submenuToggles.forEach(toggle => {
          toggle.addEventListener('click', function(e) {
              if (window.innerWidth > 992) {
                  e.preventDefault();
                  const parent = this.parentElement;
                  parent.classList.toggle('active');
                  
                  document.querySelectorAll('.has-submenu').forEach(item => {
                      if (item !== parent) {
                          item.classList.remove('active');
                      }
                  });
              }
          });
          
          const dropdownIcon = toggle.querySelector('.dropdown-icon');
          if (dropdownIcon) {
              dropdownIcon.addEventListener('click', function(e) {
                  e.stopPropagation();
                  e.preventDefault();
                  this.parentElement.parentElement.classList.toggle('active');
              });
          }
      });
      
      document.addEventListener('click', function(e) {
          if (!e.target.closest('.has-submenu')) {
              document.querySelectorAll('.has-submenu').forEach(item => {
                  item.classList.remove('active');
              });
          }
      });
  }

  // مدیریت ویرایشگر پست
  function setupPostEditor() {
      const newPostBtn = document.getElementById('new-post-btn');
      const cancelPostBtn = document.getElementById('cancel-post');
      
      if (newPostBtn && cancelPostBtn) {
          newPostBtn.addEventListener('click', function() {
              document.getElementById('post-editor').style.display = 'block';
          });
          
          cancelPostBtn.addEventListener('click', function() {
              document.getElementById('post-editor').style.display = 'none';
          });
      }
      
      if (typeof CKEDITOR !== 'undefined') {
          CKEDITOR.replace('editor', {
              language: 'fa',
              contentsLangDirection: 'rtl',
              toolbar: [
                  { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                  { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
                  { name: 'links', items: ['Link', 'Unlink'] },
                  { name: 'insert', items: ['Image'] },
                  { name: 'tools', items: ['Maximize'] }
              ]
          });
      }
  }

  // مدیریت چارت‌ها
  function setupCharts() {
      if (!document.getElementById('visitsChart')) return;
      
      // چارت خطی - بازدیدهای روزانه
      const visitsChart = new Chart(
          document.getElementById('visitsChart').getContext('2d'), 
          {
              type: 'line',
              data: {
                  labels: ['1am', '4am', '8am', '12pm', '4pm', '8pm', '12am'],
                  datasets: [{
                      label: 'بازدیدها',
                      data: [120, 190, 300, 500, 800, 1200, 900],
                      backgroundColor: 'rgba(58, 134, 255, 0.2)',
                      borderColor: 'rgba(58, 134, 255, 1)',
                      borderWidth: 2,
                      tension: 0.3,
                      fill: true
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          rtl: true,
                          labels: {
                              font: {
                                  family: 'Vazir'
                              }
                          }
                      }
                  },
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          }
      );

      // سایر چارت‌ها به همین صورت...
      
      // فیلترهای زمانی
      document.querySelectorAll('.time-filter').forEach(btn => {
          btn.addEventListener('click', function() {
              document.querySelectorAll('.time-filter').forEach(b => b.classList.remove('active'));
              this.classList.add('active');
          });
      });
  }

  // --- راه‌اندازی تمام قابلیت‌ها ---
  setupThemeToggle();
  setupSidebar();
  setupContentSections();
  setupSubmenus();
  setupPostEditor();
  setupCharts();
});


document.querySelectorAll('.color-option').forEach(color => {
    color.addEventListener('click', function() {
        const selectedColor = this.getAttribute('data-color');
        
        // تغییر رنگ اصلی (مثال: --bs-primary)
        document.documentElement.style.setProperty(`--bs-primary`, `var(--bs-${selectedColor})`);
        
        // تغییر رنگ سایدبار (اختیاری)
        document.querySelector('.sidebar').style.backgroundColor = `var(--bs-${selectedColor}-bg-subtle)`;
        
        // نمایش پیام (اختیاری)
        alert(`تم رنگ به ${selectedColor} تغییر کرد!`);
    });
});
