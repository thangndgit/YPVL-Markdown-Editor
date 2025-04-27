---
title: Comprehensive Markdown Editor Test
author: Grok
date: 2025-04-27
tags: [markdown, testing, editor]
---

# Comprehensive Markdown Editor Test

## Overview

This document tests a wide range of Markdown features, including basic syntax, extended GFM features, and advanced rendering capabilities. Use this to ensure your editor supports all possible Markdown content.

---

## Text Formatting

- **Bold**, _italic_, ~~strikethrough~~, and **_bold italic_**
- Inline `code` and <kbd>keyboard shortcuts</kbd>
- Superscript: x^2^ and Subscript: H~2~O

## Lists

### Nested Unordered List

- Item A
  - Subitem A1
    - Sub-subitem A1.1
  - Subitem A2
- Item B

### Nested Ordered List

1. Step 1
   1. Substep 1.1
   2. Substep 1.2
2. Step 2

### Task List with Nesting

- [x] Task 1
  - [ ] Subtask 1.1
  - [x] Subtask 1.2
- [ ] Task 2

## Links and Images

- External link: [xAI Website](https://x.ai)
- Internal link: [Go to Code Blocks](#code-blocks)
- Image with title: ![Grok Logo](https://via.placeholder.com/150 "Grok Logo Tooltip")

## Blockquotes

> This is a blockquote with **bold** and _italic_ text.
>
> > Nested blockquote with a [link](https://x.ai).

## Code Blocks

### Inline Code

Use `console.log("Hello!")` for debugging.

### Fenced Code Block with Language

```python
# Python example with line numbers
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # Output: 120
```

### Code Block with Custom Highlight

```javascript {2,4-5}
function example() {
  console.log("This line is highlighted");
  const data = [1, 2, 3];
  data.forEach((item) => {
    console.log(item); // Highlighted range
  });
}
```

## Tables

### Basic Table

| Name    | Age | Role                            |
| ------- | --- | ------------------------------- |
| Alice   | 25  | **Developer**                   |
| Bob     | 30  | [Designer](https://example.com) |
| Charlie | 35  | Manager                         |

### Complex Table with Markdown

| Feature  | Description                             | Status |
| -------- | --------------------------------------- | ------ |
| **Bold** | Supports **bold** and _italic_ in cells | ✅     |
| Links    | [xAI](https://x.ai)                     | ✅     |
| Code     | `print("Hello")`                        | ✅     |

## Mathematical Expressions

### Inline Math

The equation $a^2 + b^2 = c^2$ is Pythagorean.

### Block Math

$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
\times
\begin{bmatrix}
5 & 6 \\
7 & 8
\end{bmatrix}
=
\begin{bmatrix}
19 & 22 \\
43 & 50
\end{bmatrix}
$$

## Definition List

Markdown
: A lightweight markup language for formatting text.

GFM
: GitHub Flavored Markdown, an extended version of Markdown.

## Footnotes

This sentence has a footnote[^note1] and another[^note2].

[^note1]: This is the first footnote.
[^note2]: This is the second footnote with **formatting**.

## Mermaid Diagrams

### Flowchart

```mermaid
graph TD;
    A[Start] --> B{Is it working?};
    B -->|Yes| C[Continue];
    B -->|No| D[Debug];
    D --> A;
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Editor
    User->>Editor: Input Markdown
    Editor-->>User: Render Preview
```

### Gantt Chart

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Development
    Markdown Editor :done, des1, 2025-01-01, 2025-03-01
    Testing        :active, des2, 2025-03-01, 30d
```

## Emoji

Fun with emojis: :smile: :rocket: :sparkles:

## Custom Containers

::: warning
This is a warning block. Ensure your editor supports custom containers!
:::

::: info
This is an info block with **formatting** and a [link](https://x.ai).
:::

## Embedded HTML

<div style="border: 1px solid #ccc; padding: 10px;">
  <h3>Custom HTML Block</h3>
  <p>This is a <em>custom</em> HTML block with <strong>Markdown</strong> inside.</p>
</div>

## Embedded Media

### YouTube Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>

### Audio

<audio controls>
  <source src="https://example.com/sample.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

## Horizontal Rule

---

## Anchor Links

### Section with Auto-Generated ID {#custom-section}

This section should have an auto-generated ID for linking, like `[Link to Section](#custom-section)`.
