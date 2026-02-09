function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatMCQs(text) {
  const lines = text.split("\n").filter(l => l.trim() !== "");
  let html = "";
  let insideMCQ = false;

  lines.forEach(line => {
    const trimmed = line.trim();

    // Question line (1. / 1) / 1:)
    if (/^\d+[\).:]/.test(trimmed)) {
      if (insideMCQ) {
        html += `</div>`; // close previous mcq
      }
      insideMCQ = true;
      html += `<div class="mcq">
                 <div class="question">${escapeHTML(trimmed)}</div>`;
    }
    // Option line (A. / a) / A:)
    else if (/^[A-Da-d][\).:]/.test(trimmed)) {
      html += `<div class="option">${escapeHTML(trimmed)}</div>`;
    }
    // Any other text
    else {
      html += `<div class="text">${escapeHTML(trimmed)}</div>`;
    }
  });

  if (insideMCQ) {
    html += `</div>`; // close last mcq
  }

  return html;
}

function generateHTML(mcqText) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>MCQ PDF</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
    }

    .mcq {
      margin-bottom: 18px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .question {
      font-weight: bold;
      margin-bottom: 6px;
    }

    .option {
      margin-left: 20px;
    }

    footer {
      position: fixed;
      bottom: 0;
      text-align: center;
      font-size: 10px;
      width: 100%;
      color: gray;
    }
  </style>
</head>
<body>
  ${formatMCQs(mcqText)}
  <footer>Made with ❤️ from C for A</footer>
</body>
</html>
`;
}

module.exports = { generateHTML };