// Sample Markdown with Mermaid
const example = `# Tài liệu mẫu

## Văn bản thông thường

Đây là một đoạn văn bản **in đậm** và *in nghiêng*. Bạn cũng có thể thêm [liên kết](https://example.com) và tạo các danh sách.

## Biểu đồ Mermaid

Hãy thử vẽ biểu đồ luồng công việc:

\`\`\`mermaid
graph TD
    A[Bắt đầu] --> B{Điều kiện}
    B -->|Đúng| C[Quy trình A]
    B -->|Sai| D[Quy trình B]
    C --> E[Kết thúc]
    D --> E
\`\`\`

Bạn cũng có thể vẽ biểu đồ chuỗi:

\`\`\`mermaid
sequenceDiagram
    Người dùng->>Hệ thống: Gửi yêu cầu
    Hệ thống->>Database: Truy vấn dữ liệu
    Database-->>Hệ thống: Trả về kết quả
    Hệ thống-->>Người dùng: Hiển thị kết quả
\`\`\`

## Danh sách

### Danh sách không thứ tự
- Mục 1
- Mục 2
- Mục 3
  - Mục con 3.1
  - Mục con 3.2

### Danh sách có thứ tự
1. Bước thứ nhất
2. Bước thứ hai
3. Bước thứ ba

## Bảng

| STT | Tên | Tuổi |
|-----|-----|------|
| 1   | An  | 25   |
| 2   | Bình| 30   |
| 3   | Cường | 28  |

## Trích dẫn

> Đây là một đoạn trích dẫn.
> 
> Bạn có thể viết nhiều dòng.`;

// DOM Elements
const inputElement = document.getElementById("input");
const outputElement = document.getElementById("output");
const statusElement = document.getElementById("status");
const loadingScreenElement = document.getElementById("loading-screen");
const clearButton = document.getElementById("clear-btn");
const exampleButton = document.getElementById("example-btn");
const documentButton = document.getElementById("document-btn");
const saveMdButton = document.getElementById("save-md-btn");
const saveHtmlButton = document.getElementById("save-html-btn");
const printButton = document.getElementById("print-btn");
const saveLocalButton = document.getElementById("save-local-btn");
const openLocalButton = document.getElementById("open-local-btn");
const themeToggleButton = document.getElementById("theme-toggle-btn");
const themeIconLight = document.getElementById("theme-icon-light");
const themeIconDark = document.getElementById("theme-icon-dark");
const saveDialogOverlay = document.getElementById("save-dialog-overlay");
const documentListOverlay = document.getElementById("document-list-overlay");
const confirmDialogOverlay = document.getElementById("confirm-dialog-overlay");
const saveConfirmButton = document.getElementById("save-confirm-btn");
const saveCancelButton = document.getElementById("save-cancel-btn");
const documentNameInput = document.getElementById("document-name");
const documentListElement = document.getElementById("document-list");
const documentListCloseButton = document.getElementById("document-list-close-btn");
const confirmTitleElement = document.getElementById("confirm-title");
const confirmMessageElement = document.getElementById("confirm-message");
const confirmCancelButton = document.getElementById("confirm-cancel-btn");
const confirmOkButton = document.getElementById("confirm-ok-btn");
const printContentElement = document.getElementById("print-content");
const editorPanel = document.getElementById("editor-panel");
const previewPanel = document.getElementById("preview-panel");
const viewModeEditorButton = document.getElementById("view-mode-editor");
const viewModeSplitButton = document.getElementById("view-mode-split");
const viewModePreviewButton = document.getElementById("view-mode-preview");
const colorThemeButton = document.getElementById("color-theme-btn");
const colorThemeDropdown = document.getElementById("color-theme-dropdown");
const mobileMenuButton = document.getElementById("mobile-menu-btn");
const mobileDrawer = document.getElementById("mobile-drawer");
const drawerOverlay = document.getElementById("drawer-overlay");
const drawerCloseButton = document.getElementById("drawer-close-btn");
const drawerContent = document.querySelector(".drawer-content");

// All dropdowns
const dropdowns = document.querySelectorAll(".dropdown");

// Library loading state
let markedLoaded = false;
let mermaidLoaded = false;
let currentSaveAction = null;

// Current view mode
let currentViewMode = "split"; // "editor", "split", "preview"

// Current color theme
let currentColorTheme = "blue"; // "blue", "purple", "green", "red", "orange", "teal"

// Load external libraries
function loadScript(url, callback) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

// Show loading status
function showStatus(message, isSuccess = false) {
  statusElement.style.display = "block";
  statusElement.style.opacity = "1"; // Đảm bảo hiển thị rõ ràng

  if (isSuccess) {
    statusElement.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
      </div>
    `;
    statusElement.style.backgroundColor = "#e8f5e9";
  } else {
    statusElement.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${message}</span>
      </div>
    `;
    statusElement.style.backgroundColor = "#fee2e2";
  }

  if (isSuccess) {
    setTimeout(() => {
      statusElement.style.opacity = "0";
      setTimeout(() => {
        statusElement.style.display = "none";
      }, 300);
    }, 2500);
  } else {
    // Hiển thị lâu hơn đối với thông báo lỗi
    setTimeout(() => {
      statusElement.style.opacity = "0";
      setTimeout(() => {
        statusElement.style.display = "none";
      }, 300);
    }, 3500);
  }
}

// Show loading screen
function showLoadingScreen() {
  loadingScreenElement.style.display = "flex";
}

// Hide loading screen
function hideLoadingScreen() {
  loadingScreenElement.style.opacity = "0";
  loadingScreenElement.style.visibility = "hidden";
  setTimeout(() => {
    loadingScreenElement.style.display = "none";
  }, 500); // Phù hợp với thời gian transition
}

// Update library loading status
function updateLibraryStatus() {
  if (markedLoaded && mermaidLoaded) {
    // Hide loading screen
    hideLoadingScreen();

    showStatus("Tất cả thư viện đã được tải. Sẵn sàng sử dụng!", true);
    // Initialize on first load
    loadExample();
  }
}

// Load libraries
// Tìm hàm loadLibraries() và thay thế bằng đoạn này
function loadLibraries() {
  showLoadingScreen();
  showStatus("Đang kiểm tra thư viện...");

  // Đặt timeout để đảm bảo DOM và các thư viện đã được tải hoàn tất
  setTimeout(() => {
    // Kiểm tra nếu các thư viện đã được tải
    if (typeof marked !== "undefined" && typeof mermaid !== "undefined" && typeof hljs !== "undefined") {
      // Khởi tạo Mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
      });

      // Khởi tạo highlight.js
      hljs.configure({
        languages: [
          "javascript",
          "python",
          "html",
          "css",
          "java",
          "php",
          "ruby",
          "go",
          "bash",
          "json",
          "sql",
          "typescript",
        ],
      });

      // Ẩn loading screen
      hideLoadingScreen();
      showStatus("Tất cả thư viện đã được tải. Sẵn sàng sử dụng!", true);

      // Khởi tạo ví dụ
      loadExample();
    } else {
      // Hiển thị lỗi nếu không tải được thư viện
      hideLoadingScreen();
      showStatus("Không thể tải một số thư viện. Vui lòng tải lại trang.", false);
    }
  }, 1000);
}

// Toggle dropdown visibility
function toggleDropdown(dropdown) {
  // Close all other dropdowns first
  dropdowns.forEach((d) => {
    if (d !== dropdown) {
      d.classList.remove("open");
    }
  });

  // Toggle current dropdown
  dropdown.classList.toggle("open");
}

// Close all dropdowns
function closeAllDropdowns() {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("open");
  });
}

// Mở menu drawer
function openDrawer() {
  mobileDrawer.classList.add("open");
  drawerOverlay.classList.add("open");
  document.body.style.overflow = "hidden"; // Ngăn scroll khi drawer mở
}

// Đóng menu drawer
function closeDrawer() {
  mobileDrawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
  document.body.style.overflow = ""; // Khôi phục scroll
}

// Clone toolbar vào drawer
function setupMobileDrawer() {
  // Xóa nội dung cũ
  drawerContent.innerHTML = "";

  // Tạo các nút menu trong drawer
  const buttons = [
    {
      id: "clear-btn-mobile",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>',
      text: "Xóa nội dung",
      handler: clearWithConfirmation,
    },
    {
      id: "example-btn-mobile",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
      text: "Tải ví dụ",
      handler: loadExampleWithConfirmation,
    },
    {
      id: "save-local-btn-mobile",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
      text: "Lưu vào trình duyệt",
      handler: saveToLocalStorage,
    },
    {
      id: "open-local-btn-mobile",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1"></path><circle cx="12" cy="17" r="5"></circle><polyline points="12 14 12 20"></polyline><polyline points="15 17 12 20 9 17"></polyline></svg>',
      text: "Mở từ trình duyệt",
      handler: showDocumentList,
    },
    {
      id: "save-md-btn-mobile",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path><path d="M9 11l1 6 3-4 3 4 1-6"></path></svg>',
      text: "Tải xuống Markdown",
      handler: showSaveDialog,
    },
    {
      id: "save-html-btn-mobile",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
      text: "Tải xuống HTML",
      handler: saveHtmlContent,
    },
    {
      id: "print-btn-mobile",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>',
      text: "Xuất PDF (In)",
      handler: preparePrint,
    },
    {
      id: "theme-toggle-btn-mobile",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
      text: "Chuyển đổi giao diện sáng/tối",
      handler: toggleTheme,
    },
  ];

  // Thêm các nút vào drawer
  buttons.forEach((button) => {
    const menuItem = document.createElement("a");
    menuItem.href = "#";
    menuItem.id = button.id;
    menuItem.className = "drawer-menu-item";
    menuItem.innerHTML = `${button.icon} <span>${button.text}</span>`;
    menuItem.addEventListener("click", (e) => {
      e.preventDefault();
      button.handler();
      closeDrawer();
    });

    drawerContent.appendChild(menuItem);
  });

  // Thêm chọn theme màu vào drawer
  const themeSelector = document.createElement("div");
  themeSelector.className = "drawer-theme-selector";
  themeSelector.innerHTML = `
    <h4 style="margin: 1rem 0 0.5rem 0.5rem; color: var(--text-muted);">Màu sắc chủ đạo</h4>
  `;

  // Clone color options
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((option) => {
    const clonedOption = option.cloneNode(true);
    clonedOption.addEventListener("click", () => {
      const theme = clonedOption.getAttribute("data-theme");
      setColorTheme(theme);
      closeDrawer();
    });
    themeSelector.appendChild(clonedOption);
  });

  drawerContent.appendChild(themeSelector);
}

function renderMathExpressions() {
  // Xử lý các biểu thức toán học nếu KaTeX đã được tải
  if (typeof katex !== "undefined" && typeof renderMathInElement !== "undefined") {
    try {
      // Xử lý inline math đầu tiên
      renderMathInElement(outputElement, {
        delimiters: [
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });

      // Sau đó xử lý block math riêng
      document.querySelectorAll(".math-block").forEach((element) => {
        try {
          const mathText = element.innerHTML.trim();
          if (mathText.startsWith("$$") && mathText.endsWith("$$")) {
            const content = mathText.slice(2, -2).trim();
            // Reset nội dung để tránh xử lý lại
            element.innerHTML = "";
            katex.render(content, element, {
              displayMode: true,
              throwOnError: false,
              output: "html",
            });
          }
        } catch (err) {
          console.error("Lỗi khi render block math:", err, element.innerHTML);
          // Giữ nội dung gốc nếu có lỗi
          element.classList.add("math-error");
          element.setAttribute("title", "Lỗi khi render: " + err.message);
        }
      });
    } catch (error) {
      console.error("Lỗi khi render biểu thức toán học:", error);
    }
  }
}

// Process Markdown and Mermaid
function renderMarkdown() {
  const input = inputElement.value;

  // Lưu trữ các biểu thức block math để xử lý sau
  const blockMathExpressions = [];
  let processedInput = input.replace(/\$\$([\s\S]+?)\$\$/g, (match, content) => {
    const placeholder = `__BLOCK_MATH_${blockMathExpressions.length}__`;
    blockMathExpressions.push(content.trim());
    return placeholder;
  });

  // Thiết lập extensions
  if (typeof window.markedExtensions !== "undefined") {
    // Đăng ký các extensions cho marked
    marked.use({
      extensions: [
        window.markedExtensions.superscript,
        window.markedExtensions.subscript,
        window.markedExtensions.emoji,
        window.markedExtensions.highlight,
      ],
    });
  }

  // Cấu hình Marked
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    pedantic: false,
    smartLists: true,
    xhtml: true,
    highlight: function (code, lang) {
      // Nếu specified language và hljs hỗ trợ language này
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {
          console.error("Highlight.js error:", err);
        }
      }
      // Sử dụng autodetect nếu không specified language
      try {
        return hljs.highlightAuto(code).value;
      } catch (err) {
        console.error("Highlight.js autodetect error:", err);
      }
      // Trả về mặc định nếu có lỗi
      return code;
    },
  });

  // Tùy chỉnh renderer để xử lý code blocks
  const renderer = new marked.Renderer();
  const originalCodeRenderer = renderer.code;

  renderer.code = function (code, language, isEscaped) {
    // Xử lý riêng cho mermaid
    if (language === "mermaid") {
      return `
        <div class="mermaid-wrapper">
          <div class="mermaid-header">
            <span class="mermaid-title">Mermaid Diagram</span>
            <div style="display: flex; gap: 0.25rem;">
              <button class="code-copy" title="Sao chép mã nguồn" data-code="${encodeURIComponent(code)}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <button class="mermaid-download" title="Tải biểu đồ" data-diagram="${encodeURIComponent(code)}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="mermaid">${code}</div>
        </div>
      `;
    }

    // Tạo code block bình thường với language
    if (language && language !== "mermaid") {
      // Tạo code block có header
      return `
        <div class="code-block-wrapper">
          <div class="code-header">
            <span class="code-language">${language}</span>
            <button class="code-copy" title="Sao chép" data-code="${encodeURIComponent(code)}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <pre class="has-header">${originalCodeRenderer
            .call(this, code, language, isEscaped)
            .replace(/<pre>|<\/pre>/g, "")}</pre>
        </div>
      `;
    }

    // Code block không có language hoặc header
    const renderedCode = originalCodeRenderer.call(this, code, language, isEscaped);
    return `
      <div class="code-block-no-header">
        <div class="code-no-header-actions">
          <button class="code-copy" title="Sao chép" data-code="${encodeURIComponent(code)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        ${renderedCode}
      </div>
    `;
  };

  // Chuyển đổi Markdown sang HTML với renderer tùy chỉnh
  let html = marked.parse(processedInput, { renderer: renderer });

  // Xử lý footnotes theo cách thủ công
  if (typeof window.processFootnotes === "function") {
    html = window.processFootnotes(html, processedInput);
  }

  // Thay thế lại các placeholder bằng block math
  blockMathExpressions.forEach((math, index) => {
    const placeholder = `__BLOCK_MATH_${index}__`;
    const mathHtml = `<div class="math-block">$$${math}$$</div>`;
    html = html.replace(placeholder, mathHtml);
  });

  // Hiển thị HTML
  outputElement.innerHTML = html;

  // Khởi tạo mermaid
  try {
    if (typeof mermaid !== "undefined") {
      mermaid.init(undefined, document.querySelectorAll(".mermaid"));
    }
  } catch (error) {
    console.error("Lỗi xử lý mermaid:", error);
    // Hiện thông báo lỗi
    const errorDiv = document.createElement("div");
    errorDiv.style.padding = "10px";
    errorDiv.style.margin = "10px 0";
    errorDiv.style.backgroundColor = "#fee2e2";
    errorDiv.style.color = "#b91c1c";
    errorDiv.style.borderRadius = "var(--radius)";
    errorDiv.innerHTML = `<strong>Lỗi:</strong> ${error.message}`;
    outputElement.appendChild(errorDiv);
  }

  // Xử lý emoji trực tiếp nếu có joypixels
  if (typeof joypixels !== "undefined") {
    // Chuyển đổi emoji shortname còn sót lại (nếu có)
    try {
      const elements = outputElement.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote");
      elements.forEach((el) => {
        if (el.innerHTML.includes(":") && !el.closest("pre") && !el.closest("code")) {
          el.innerHTML = joypixels.shortnameToImage(el.innerHTML);
        }
      });
    } catch (e) {
      console.error("Lỗi khi xử lý emoji:", e);
    }
  }

  // Render biểu thức toán học
  renderMathExpressions();

  // Thêm chức năng sao chép cho các nút sao chép code
  document.querySelectorAll(".code-copy").forEach((button) => {
    button.addEventListener("click", function () {
      // Lấy mã code từ thuộc tính data-code
      const code = decodeURIComponent(this.getAttribute("data-code"));

      // Sao chép vào clipboard
      navigator.clipboard
        .writeText(code)
        .then(() => {
          // Thay đổi icon thành tick để chỉ ra đã sao chép thành công
          const originalHTML = this.innerHTML;
          this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
          this.style.color = "var(--success-color)";

          // Trở lại icon ban đầu sau 2 giây
          setTimeout(() => {
            this.innerHTML = originalHTML;
            this.style.color = "";
          }, 2000);
        })
        .catch((err) => {
          console.error("Không thể sao chép văn bản: ", err);
        });
    });
  });

  // Thêm chức năng tải biểu đồ Mermaid
  document.querySelectorAll(".mermaid-download").forEach((button) => {
    button.addEventListener("click", async function () {
      const diagramCode = decodeURIComponent(this.getAttribute("data-diagram"));
      const mermaidDiv = this.closest(".mermaid-wrapper").querySelector(".mermaid");

      // Hiển thị spinner trong khi xử lý
      const originalHTML = this.innerHTML;
      this.innerHTML = `<span class="download-spinner"></span>`;

      try {
        // Chờ một chút để đảm bảo Mermaid đã render xong
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Tạo canvas từ SVG để chuyển thành hình ảnh
        const svgElement = mermaidDiv.querySelector("svg");
        if (!svgElement) {
          throw new Error("Không tìm thấy SVG của biểu đồ");
        }

        // Lấy SVG dưới dạng string
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

        // Tạo URL và tải xuống
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mermaid-diagram.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Trở lại icon ban đầu
        this.innerHTML = originalHTML;
      } catch (error) {
        console.error("Lỗi khi tải biểu đồ:", error);
        this.innerHTML = originalHTML;

        // Hiển thị thông báo lỗi
        showStatus("Không thể tải biểu đồ: " + error.message, false);
      }
    });
  });
}

// Extract H1 heading from markdown
function extractH1FromMarkdown(markdown) {
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  return h1Match ? h1Match[1].trim() : "Untitled";
}

// Clear content
function clearAll() {
  inputElement.value = "";
  outputElement.innerHTML = "";
}

// Load example
function loadExample() {
  inputElement.value = example;
  renderMarkdown();
}

// Toggle dark/light theme
function toggleTheme() {
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Cập nhật theme của highlight.js (đã sửa)
  const highlightTheme = document.getElementById("highlight-theme");
  if (highlightTheme) {
    highlightTheme.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${
      newTheme === "dark" ? "github-dark" : "github"
    }.min.css`;
  }

  // Toggle theme icons
  if (newTheme === "dark") {
    themeIconLight.style.display = "none";
    themeIconDark.style.display = "block";
  } else {
    themeIconLight.style.display = "block";
    themeIconDark.style.display = "none";
  }

  // Update mermaid theme
  if (typeof mermaid !== "undefined") {
    mermaid.initialize({
      startOnLoad: false,
      theme: newTheme === "dark" ? "dark" : "default",
    });
    renderMarkdown(); // Re-render to apply theme to mermaid diagrams
  }
}

// Set color theme
function setColorTheme(theme) {
  // Remove current theme class
  document.body.classList.remove(`theme-${currentColorTheme}`);

  // Add new theme class
  document.body.classList.add(`theme-${theme}`);

  // Save to localStorage
  localStorage.setItem("colorTheme", theme);

  // Update current theme
  currentColorTheme = theme;

  // Close dropdown
  closeAllDropdowns();

  // Re-render markdown to apply new theme
  renderMarkdown();
}

// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Cập nhật theme của highlight.js (đã sửa)
    const highlightTheme = document.getElementById("highlight-theme");
    if (highlightTheme) {
      highlightTheme.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${
        savedTheme === "dark" ? "github-dark" : "github"
      }.min.css`;
    }

    if (savedTheme === "dark") {
      themeIconLight.style.display = "none";
      themeIconDark.style.display = "block";
    }
  }

  // Initialize color theme
  const savedColorTheme = localStorage.getItem("colorTheme");
  if (savedColorTheme) {
    setColorTheme(savedColorTheme);
  } else {
    setColorTheme("blue"); // Default theme
  }
}

// Change view mode
function setViewMode(mode) {
  currentViewMode = mode;

  // Update active button
  viewModeEditorButton.classList.toggle("active", mode === "editor");
  viewModeSplitButton.classList.toggle("active", mode === "split");
  viewModePreviewButton.classList.toggle("active", mode === "preview");

  // Update panels
  switch (mode) {
    case "editor":
      editorPanel.classList.remove("hidden");
      editorPanel.classList.add("full");
      previewPanel.classList.add("hidden");
      previewPanel.classList.remove("full");
      break;
    case "split":
      editorPanel.classList.remove("hidden", "full");
      previewPanel.classList.remove("hidden", "full");
      break;
    case "preview":
      editorPanel.classList.add("hidden");
      editorPanel.classList.remove("full");
      previewPanel.classList.remove("hidden");
      previewPanel.classList.add("full");
      break;
  }

  // Save preference
  localStorage.setItem("viewMode", mode);
}

// Toggle dropdown visibility
function toggleDropdown(dropdown) {
  // Close all other dropdowns first
  dropdowns.forEach((d) => {
    if (d !== dropdown) {
      d.classList.remove("open");
    }
  });

  // Toggle current dropdown
  dropdown.classList.toggle("open");
}

// Close all dropdowns
function closeAllDropdowns() {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("open");
  });
}

// Show save dialog for markdown files
function showSaveDialog() {
  const suggestedName = extractH1FromMarkdown(inputElement.value);
  documentNameInput.value = suggestedName;

  // Set save action
  currentSaveAction = "markdown";

  saveDialogOverlay.style.display = "flex";
  documentNameInput.focus();
}

// Save markdown to file
function saveMarkdownToFile() {
  const content = inputElement.value;
  const filename = documentNameInput.value.trim() || extractH1FromMarkdown(content) || "Untitled";

  // Create a blob with the content
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element to trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.md`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Hide dialog
  saveDialogOverlay.style.display = "none";

  showStatus(`Đã tải xuống "${filename}.md" thành công!`, true);
}

// Save to localStorage
function saveToLocalStorage() {
  const content = inputElement.value;

  // Check if content is empty
  if (!content.trim()) {
    showStatus("Không thể lưu tài liệu trống!", false);
    return;
  }

  const suggestedName = extractH1FromMarkdown(content);
  documentNameInput.value = suggestedName;

  // Set save action
  currentSaveAction = "localStorage";

  saveDialogOverlay.style.display = "flex";
  documentNameInput.focus();
}

// Actually save to localStorage
function saveToLocalStorageAction() {
  const content = inputElement.value;
  const filename = documentNameInput.value.trim() || extractH1FromMarkdown(content) || "Untitled";

  try {
    // Get existing documents or initialize empty array
    const storedDocs = JSON.parse(localStorage.getItem("markdown-docs") || "[]");

    // Create a new document entry
    const newDoc = {
      id: Date.now().toString(),
      name: filename,
      content: content,
      date: new Date().toISOString(),
    };

    // Add new document to array
    storedDocs.push(newDoc);

    // Save back to localStorage
    localStorage.setItem("markdown-docs", JSON.stringify(storedDocs));

    // Hide dialog
    saveDialogOverlay.style.display = "none";

    showStatus(`Đã lưu "${filename}" vào trình duyệt thành công!`, true);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    showStatus("Có lỗi khi lưu vào bộ nhớ trình duyệt!", false);
  }
}

// Execute current save action
function executeSaveAction() {
  if (currentSaveAction === "markdown") {
    saveMarkdownToFile();
  } else if (currentSaveAction === "localStorage") {
    saveToLocalStorageAction();
  }
}

// Save HTML content
function saveHtmlContent() {
  const content = outputElement.innerHTML;
  const markdownContent = inputElement.value;
  const filename = extractH1FromMarkdown(markdownContent) || "Untitled";

  // Create complete HTML document
  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0.8em;
      margin-bottom: 0.4em;
      color: #2563eb;
    }
    
    h1 {
      font-size: 1.8em;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.2em;
    }
    
    h2 {
      font-size: 1.5em;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.2em;
    }
    
    p { margin-bottom: 0.7em; }
    
    ul, ol { margin-bottom: 0.7em; padding-left: 1.5em; }
    
    li { margin-bottom: 0.3em; }
    
    code {
      background-color: #f1f5f9;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
    }
    
    pre {
      background-color: #f1f5f9;
      padding: 0.7em;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 0.7em;
    }
    
    blockquote {
      border-left: 4px solid #2563eb;
      padding-left: 0.7em;
      color: #64748b;
      margin-bottom: 0.7em;
    }
    
    img { max-width: 100%; height: auto; }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 0.7em;
    }
    
    th, td {
      border: 1px solid #e2e8f0;
      padding: 6px;
      text-align: left;
    }
    
    th { background-color: #f1f5f9; }
    
    .mermaid {
      margin: 1rem 0;
      text-align: center;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@8.14.0/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      mermaid.initialize({
        startOnLoad: true,
        theme: "default"
      });
    });
  </script>
</head>
<body>
  ${content}
</body>
</html>`;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showStatus(`Đã tải xuống "${filename}.html" thành công!`, true);
}

// Show document list
function showDocumentList() {
  try {
    // Get stored documents
    const storedDocs = JSON.parse(localStorage.getItem("markdown-docs") || "[]");

    // Clear the list
    documentListElement.innerHTML = "";

    if (storedDocs.length === 0) {
      documentListElement.innerHTML = '<div class="empty-list">Không có tài liệu nào được lưu.</div>';
      documentListOverlay.style.display = "flex";
      return;
    }

    // Sort by date, newest first
    storedDocs.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create list items
    storedDocs.forEach((doc) => {
      const date = new Date(doc.date);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const item = document.createElement("div");
      item.className = "document-item";
      item.innerHTML = `
        <div class="document-name">${doc.name}</div>
        <div class="document-date">${formattedDate}</div>
        <div class="document-actions">
          <button class="delete-btn" title="Xóa tài liệu">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;

      // Add event listeners
      item.addEventListener("click", (e) => {
        // Ignore clicks on the delete button
        if (!e.target.closest(".delete-btn")) {
          loadDocumentFromLocalStorage(doc.id);
        }
      });

      item.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation(); // Ngăn không cho sự kiện click lan lên document-item
        showConfirmDialog("Xóa tài liệu", `Bạn có chắc chắn muốn xóa tài liệu "${doc.name}"?`, () =>
          deleteDocumentFromLocalStorage(doc.id)
        );
      });

      documentListElement.appendChild(item);
    });

    // Show dialog
    documentListOverlay.style.display = "flex";
  } catch (error) {
    console.error("Error loading document list:", error);
    showStatus("Có lỗi khi tải danh sách tài liệu!", false);
  }
}

// Load document from localStorage
function loadDocumentFromLocalStorage(id) {
  try {
    const storedDocs = JSON.parse(localStorage.getItem("markdown-docs") || "[]");
    const doc = storedDocs.find((doc) => doc.id === id);

    if (doc) {
      inputElement.value = doc.content;
      renderMarkdown();
      documentListOverlay.style.display = "none";
      showStatus(`Đã tải "${doc.name}" thành công!`, true);
    }
  } catch (error) {
    console.error("Error loading document:", error);
    showStatus("Có lỗi khi tải tài liệu!", false);
  }
}

// Delete document from localStorage
function deleteDocumentFromLocalStorage(id) {
  try {
    let storedDocs = JSON.parse(localStorage.getItem("markdown-docs") || "[]");
    const docIndex = storedDocs.findIndex((doc) => doc.id === id);

    if (docIndex !== -1) {
      const docName = storedDocs[docIndex].name;
      storedDocs.splice(docIndex, 1);
      localStorage.setItem("markdown-docs", JSON.stringify(storedDocs));

      // Refresh the list
      showDocumentList();
      showStatus(`Đã xóa "${docName}" thành công!`, true);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    showStatus("Có lỗi khi xóa tài liệu!", false);
  }
}

// Show confirmation dialog
function showConfirmDialog(title, message, onConfirm) {
  confirmTitleElement.textContent = title;
  confirmMessageElement.textContent = message;

  // Store the confirm callback
  confirmOkButton.onclick = function () {
    onConfirm();
    confirmDialogOverlay.style.display = "none";
  };

  // Show dialog
  confirmDialogOverlay.style.display = "flex";
}

// Prepare content for printing
function preparePrint() {
  // Clone output content for printing
  printContentElement.innerHTML = outputElement.innerHTML;

  // Need to re-initialize mermaid diagrams in the print content
  if (mermaidLoaded && typeof mermaid !== "undefined") {
    try {
      mermaid.init(undefined, printContentElement.querySelectorAll(".mermaid"));
    } catch (error) {
      console.error("Lỗi xử lý mermaid cho bản in:", error);
    }
  }

  // Trigger print dialog
  window.print();
}

// Clear content with confirmation
function clearWithConfirmation() {
  if (inputElement.value.trim()) {
    showConfirmDialog("Xóa nội dung", "Bạn có chắc chắn muốn xóa tất cả nội dung hiện tại?", clearAll);
  } else {
    clearAll();
  }
}

// Load example with confirmation
function loadExampleWithConfirmation() {
  if (inputElement.value.trim()) {
    showConfirmDialog("Tải ví dụ", "Ví dụ sẽ thay thế nội dung hiện tại. Bạn có chắc chắn muốn tiếp tục?", loadExample);
  } else {
    loadExample();
  }
}

// Event Listeners
clearButton.addEventListener("click", clearWithConfirmation);
exampleButton.addEventListener("click", loadExampleWithConfirmation);
themeToggleButton.addEventListener("click", toggleTheme);
saveMdButton.addEventListener("click", showSaveDialog);
saveHtmlButton.addEventListener("click", saveHtmlContent);
saveLocalButton.addEventListener("click", saveToLocalStorage);
openLocalButton.addEventListener("click", showDocumentList);
printButton.addEventListener("click", preparePrint);

// View mode buttons
viewModeEditorButton.addEventListener("click", () => setViewMode("editor"));
viewModeSplitButton.addEventListener("click", () => setViewMode("split"));
viewModePreviewButton.addEventListener("click", () => setViewMode("preview"));

// Handle dropdown opening/closing
document.addEventListener("click", function (e) {
  // If click is outside any dropdown
  if (!e.target.closest(".dropdown")) {
    closeAllDropdowns();
  }
});

// Document button (handle dropdown manually)
documentButton.addEventListener("click", function (e) {
  e.stopPropagation();
  const dropdown = this.closest(".dropdown");
  toggleDropdown(dropdown);
});

// Color theme button (handle dropdown manually)
colorThemeButton.addEventListener("click", function (e) {
  e.stopPropagation();
  const dropdown = this.closest(".dropdown");
  toggleDropdown(dropdown);
});

// Color theme options
document.querySelectorAll(".color-option").forEach((option) => {
  option.addEventListener("click", function () {
    const theme = this.getAttribute("data-theme");
    setColorTheme(theme);
  });
});

// Dialog event listeners
saveConfirmButton.addEventListener("click", executeSaveAction);
saveCancelButton.addEventListener("click", () => {
  saveDialogOverlay.style.display = "none";
});
documentListCloseButton.addEventListener("click", () => {
  documentListOverlay.style.display = "none";
});
confirmCancelButton.addEventListener("click", () => {
  confirmDialogOverlay.style.display = "none";
});
documentNameInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    executeSaveAction();
  } else if (e.key === "Escape") {
    saveDialogOverlay.style.display = "none";
  }
});

// Close dialogs when clicking outside
saveDialogOverlay.addEventListener("click", (e) => {
  if (e.target === saveDialogOverlay) {
    saveDialogOverlay.style.display = "none";
  }
});
documentListOverlay.addEventListener("click", (e) => {
  if (e.target === documentListOverlay) {
    documentListOverlay.style.display = "none";
  }
});
confirmDialogOverlay.addEventListener("click", (e) => {
  if (e.target === confirmDialogOverlay) {
    confirmDialogOverlay.style.display = "none";
  }
});

// Auto render on input change with debounce
let timeout = null;
inputElement.addEventListener("input", function () {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    renderMarkdown();
  }, 1000); // 1 second delay
});

mobileMenuButton.addEventListener("click", openDrawer);
drawerCloseButton.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

// Close drawer khi resize về kích thước lớn hơn
window.addEventListener("resize", function () {
  if (window.innerWidth > 640 && mobileDrawer.classList.contains("open")) {
    closeDrawer();
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  loadLibraries();
  setupMobileDrawer();

  // Set initial view mode
  const savedViewMode = localStorage.getItem("viewMode");
  if (savedViewMode) {
    setViewMode(savedViewMode);
  } else {
    setViewMode("split"); // Default to split view
  }

  // Auto-load last document from localStorage if available
  try {
    const storedDocs = JSON.parse(localStorage.getItem("markdown-docs") || "[]");
    if (storedDocs.length > 0) {
      // Sort by date, newest first
      storedDocs.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Load the most recent document
      inputElement.value = storedDocs[0].content;
      renderMarkdown();
      showStatus(`Đã tải "${storedDocs[0].name}" tự động!`, true);
    }
  } catch (error) {
    console.error("Error auto-loading document:", error);
  }

  // Đặt một timeout để tắt màn hình loading nếu thư viện không tải được sau 10 giây
  setTimeout(() => {
    if (loadingScreenElement.style.display !== "none") {
      hideLoadingScreen();
      showStatus("Có thể có vấn đề khi tải thư viện. Thử tải lại trang.", false);
    }
  }, 10000);
});
