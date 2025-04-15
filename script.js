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

// Library loading state
let markedLoaded = false;
let mermaidLoaded = false;
let currentSaveAction = null;

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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    statusElement.style.backgroundColor = "#e8f5e9";
  }

  if (isSuccess) {
    setTimeout(() => {
      statusElement.style.display = "none";
    }, 3000);
  }
}

// Update library loading status
function updateLibraryStatus() {
  if (markedLoaded && mermaidLoaded) {
    showStatus("Tất cả thư viện đã được tải. Sẵn sàng sử dụng!", true);
    // Initialize on first load
    loadExample();
  }
}

// Load libraries
function loadLibraries() {
  showStatus("Đang tải thư viện...");

  // Load Marked.js
  loadScript("https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js", function () {
    markedLoaded = true;
    updateLibraryStatus();
  });

  // Load Mermaid.js
  loadScript("https://cdn.jsdelivr.net/npm/mermaid@8.14.0/dist/mermaid.min.js", function () {
    mermaidLoaded = true;

    // Initialize Mermaid
    if (typeof mermaid !== "undefined") {
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
      });
    }

    updateLibraryStatus();
  });
}

// Process Markdown and Mermaid
function renderMarkdown() {
  if (!markedLoaded || !mermaidLoaded) {
    alert("Đang tải thư viện, vui lòng đợi trong giây lát...");
    return;
  }

  const input = inputElement.value;

  // Configure Marked
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Convert Markdown to HTML
  let html = marked.parse(input);

  // Display HTML
  outputElement.innerHTML = html;

  // Process Mermaid blocks
  try {
    document.querySelectorAll("code.language-mermaid").forEach((node) => {
      // Create a new mermaid div
      const div = document.createElement("div");
      div.className = "mermaid";
      div.textContent = node.textContent;

      // Replace the code tag with the mermaid div
      node.parentNode.parentNode.replaceChild(div, node.parentNode);
    });

    // Initialize mermaid
    if (typeof mermaid !== "undefined") {
      mermaid.init(undefined, document.querySelectorAll(".mermaid"));
    }
  } catch (error) {
    console.error("Lỗi xử lý mermaid:", error);
    // Show error message
    const errorDiv = document.createElement("div");
    errorDiv.style.padding = "10px";
    errorDiv.style.margin = "10px 0";
    errorDiv.style.backgroundColor = "#fee2e2";
    errorDiv.style.color = "#b91c1c";
    errorDiv.style.borderRadius = "var(--radius)";
    errorDiv.innerHTML = `<strong>Lỗi:</strong> ${error.message}`;
    outputElement.appendChild(errorDiv);
  }
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

  // Toggle theme icons
  if (newTheme === "dark") {
    themeIconLight.style.display = "none";
    themeIconDark.style.display = "block";
  } else {
    themeIconLight.style.display = "block";
    themeIconDark.style.display = "none";
  }

  // Update mermaid theme if it's loaded
  if (mermaidLoaded && typeof mermaid !== "undefined") {
    mermaid.initialize({
      startOnLoad: false,
      theme: newTheme === "dark" ? "dark" : "default",
    });
    renderMarkdown(); // Re-render to apply theme to mermaid diagrams
  }
}

// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      themeIconLight.style.display = "none";
      themeIconDark.style.display = "block";
    }
  }
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
          <button class="load-btn" title="Mở tài liệu">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </button>
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
      item.querySelector(".load-btn").addEventListener("click", () => {
        loadDocumentFromLocalStorage(doc.id);
      });

      item.querySelector(".delete-btn").addEventListener("click", () => {
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

// Thêm các biến và DOM Elements mới
const viewEditButton = document.getElementById("view-edit-btn");
const viewPreviewButton = document.getElementById("view-preview-btn");
const viewBothButton = document.getElementById("view-both-btn");
const headingColorOptions = document.querySelectorAll(".color-option");
let currentHeadingColor = localStorage.getItem("heading-color") || "#4361ee";

// Chức năng chuyển đổi chế độ xem
function setViewMode(mode) {
  const container = document.querySelector(".container");

  // Xóa tất cả class liên quan đến chế độ xem
  container.classList.remove("editor-only", "preview-only");

  // Xóa trạng thái active trên tất cả nút
  viewEditButton.classList.remove("active");
  viewPreviewButton.classList.remove("active");
  viewBothButton.classList.remove("active");

  // Thêm class phù hợp
  if (mode === "editor") {
    container.classList.add("editor-only");
    viewEditButton.classList.add("active");
  } else if (mode === "preview") {
    container.classList.add("preview-only");
    viewPreviewButton.classList.add("active");
  } else {
    // Chế độ mặc định: cả hai
    viewBothButton.classList.add("active");
  }

  // Lưu cài đặt
  localStorage.setItem("view-mode", mode);
}

// Cải thiện chức năng mở tài liệu từ danh sách
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
      item.setAttribute("data-id", doc.id); // Thêm data-id để dễ dàng xác định document
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

      // Thêm sự kiện cho toàn bộ item
      item.addEventListener("click", (e) => {
        // Không tải document khi click vào nút xóa
        if (!e.target.closest(".delete-btn")) {
          loadDocumentFromLocalStorage(doc.id);
        }
      });

      // Thêm sự kiện cho nút xóa
      const deleteBtn = item.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Ngăn sự kiện nổi bọt lên item
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

// Chức năng thay đổi màu heading
function setHeadingColor(color) {
  // Tạo CSS cho màu heading
  const headingColorStyle = document.getElementById("heading-color-style") || document.createElement("style");
  headingColorStyle.id = "heading-color-style";
  headingColorStyle.textContent = `
    #output h1, #output h2, #output h3, #output h4, #output h5, #output h6,
    #print-content h1, #print-content h2, #print-content h3, #print-content h4, #print-content h5, #print-content h6,
    .panel-header, .dialog h3 {
      color: ${color} !important;
    }
    
    #output blockquote, #print-content blockquote {
      border-left-color: ${color} !important;
    }
    
    .view-btn.active {
      border-color: ${color} !important;
      color: ${color} !important;
    }
  `;

  document.head.appendChild(headingColorStyle);

  // Cập nhật màu active
  currentHeadingColor = color;
  localStorage.setItem("heading-color", color);

  // Cập nhật giao diện
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("active");
    if (option.getAttribute("data-color") === color) {
      option.classList.add("active");
    }
  });
}

// Khởi tạo chế độ xem từ localStorage
function initViewMode() {
  const savedMode = localStorage.getItem("view-mode");
  if (savedMode) {
    setViewMode(savedMode);
  } else {
    setViewMode("both"); // Mặc định: hiển thị cả hai
  }
}

// Khởi tạo màu heading từ localStorage
function initHeadingColor() {
  const savedColor = localStorage.getItem("heading-color");
  if (savedColor) {
    setHeadingColor(savedColor);
  } else {
    setHeadingColor("#4361ee"); // Màu mặc định
  }
}

// Bổ sung chức năng khởi tạo
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initViewMode();
  initHeadingColor();
  loadLibraries();

  // Thêm sự kiện cho các nút chế độ xem
  viewEditButton.addEventListener("click", () => setViewMode("editor"));
  viewPreviewButton.addEventListener("click", () => setViewMode("preview"));
  viewBothButton.addEventListener("click", () => setViewMode("both"));

  // Thêm sự kiện cho các tùy chọn màu
  document.querySelectorAll(".color-option").forEach((option) => {
    option.addEventListener("click", () => {
      const color = option.getAttribute("data-color");
      setHeadingColor(color);
    });
  });

  // Auto-load last document từ localStorage nếu có
  try {
    const storedDocs = JSON.parse(localStorage.getItem("markdown-docs") || "[]");
    if (storedDocs.length > 0) {
      // Sắp xếp theo ngày, mới nhất trước
      storedDocs.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Tải tài liệu gần nhất
      inputElement.value = storedDocs[0].content;
      renderMarkdown();
      showStatus(`Đã tải "${storedDocs[0].name}" tự động!`, true);
    }
  } catch (error) {
    console.error("Error auto-loading document:", error);
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  loadLibraries();

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
});
