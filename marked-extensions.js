// Tạo file mới marked-extensions.js

/**
 * Mở rộng các tính năng cho Marked.js
 * - Superscript: x^2^
 * - Subscript: H~2~O
 * - Footnotes: [^1] và [^1]: Nội dung chú thích
 * - Emoji: :smile:
 */

// Extension cho Superscript
function superscriptExtension() {
  return {
    name: "superscript",
    level: "inline",
    start(src) {
      return src.indexOf("^");
    },
    tokenizer(src) {
      const rule = /^\^([^\s^]+)\^/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: "superscript",
          raw: match[0],
          text: match[1],
        };
      }
      return false;
    },
    renderer(token) {
      return `<sup>${token.text}</sup>`;
    },
  };
}

// Extension cho Subscript
function subscriptExtension() {
  return {
    name: "subscript",
    level: "inline",
    start(src) {
      return src.indexOf("~");
    },
    tokenizer(src) {
      const rule = /^~([^\s~]+)~/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: "subscript",
          raw: match[0],
          text: match[1],
        };
      }
      return false;
    },
    renderer(token) {
      return `<sub>${token.text}</sub>`;
    },
  };
}

// Extension cho Emoji
function emojiExtension() {
  return {
    name: "emoji",
    level: "inline",
    start(src) {
      return src.indexOf(":");
    },
    tokenizer(src) {
      const rule = /^:([a-z0-9_\-+]+):/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: "emoji",
          raw: match[0],
          emoji: match[1],
        };
      }
      return false;
    },
    renderer(token) {
      if (typeof joypixels !== "undefined") {
        // Sử dụng joypixels để chuyển đổi shortname thành emoji HTML
        return joypixels.shortnameToImage(`:${token.emoji}:`);
      }
      return token.raw; // Trả về raw nếu không có joypixels
    },
  };
}

// Extension cho Highlight text (==text==)
function highlightExtension() {
  return {
    name: "highlight",
    level: "inline",
    start(src) {
      return src.indexOf("==");
    },
    tokenizer(src) {
      const rule = /^==([^=]+)==/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: "highlight",
          raw: match[0],
          text: match[1].trim(),
        };
      }
      return false;
    },
    renderer(token) {
      return `<mark>${token.text}</mark>`;
    },
  };
}

// Extension cho Block Math ($$...$$)
function blockMathExtension() {
  return {
    name: "blockMath",
    level: "block",
    start(src) {
      return src.indexOf("$$");
    },
    tokenizer(src) {
      const rule = /^\$\$([\s\S]+?)\$\$/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: "blockMath",
          raw: match[0],
          math: match[1].trim(),
        };
      }
      return false;
    },
    renderer(token) {
      return `<div class="math-block">${token.raw}</div>`;
    },
  };
}

// Khởi tạo và đăng ký các extensions
window.markedExtensions = {
  superscript: superscriptExtension(),
  subscript: subscriptExtension(),
  emoji: emojiExtension(),
  highlight: highlightExtension(),
  blockMath: blockMathExtension(),
};

// Xử lý footnotes theo cách thủ công (không dùng extension)
window.processFootnotes = function (html, markdown) {
  // Tìm tất cả các footnote references
  const refRegex = /\[\^(\w+)\]/g;
  const refs = new Map();
  let match;

  // Thu thập tất cả references
  while ((match = refRegex.exec(markdown)) !== null) {
    const id = match[1];
    if (!refs.has(id)) {
      refs.set(id, true);
    }
  }

  // Tìm các footnote definitions
  const defRegex = /\[\^(\w+)\]:\s+([\s\S]*?)(?=\n\s*\[\^|\n\n|$)/gm;
  const defs = new Map();

  while ((match = defRegex.exec(markdown)) !== null) {
    const id = match[1];
    let content = match[2].trim();

    // Xử lý định dạng trong nội dung footnote
    // Chuyển đổi markdown trong content thành HTML
    content = marked.parse(content);
    // Loại bỏ thẻ p bọc ngoài nếu có
    content = content.replace(/^<p>([\s\S]*)<\/p>$/g, "$1");

    defs.set(id, content);
  }

  // Thay thế references trong HTML
  let processedHtml = html;
  refs.forEach((_, id) => {
    const reference = `[^${id}]`;
    const replacement = `<a href="#footnote-${id}" id="footnote-ref-${id}" class="footnote-ref">[${id}]</a>`;
    processedHtml = processedHtml.replace(new RegExp(escapeRegExp(reference), "g"), replacement);
  });

  // Thêm footnotes section nếu có definitions
  if (defs.size > 0) {
    let footnotesHtml = '<section class="footnotes">\n<ol>\n';

    defs.forEach((content, id) => {
      footnotesHtml += `<li id="footnote-${id}">${content} <a href="#footnote-ref-${id}" class="footnote-backref">↩</a></li>\n`;
    });

    footnotesHtml += "</ol>\n</section>";

    // Thêm vào cuối HTML
    processedHtml += footnotesHtml;
  }

  return processedHtml;
};

// Helper function để escape các ký tự đặc biệt trong regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
