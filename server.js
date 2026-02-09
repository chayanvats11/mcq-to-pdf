const express = require("express");
const { chromium } = require("playwright");
const { generateHTML } = require("./templates/pdfTemplate");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.post("/generate-pdf", async (req, res) => {
  const { mcqText } = req.body;

  if (!mcqText || mcqText.trim() === "") {
    return res.status(400).send("Empty input");
  }

  try {
    const browser = await chromium.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    const html = generateHTML(mcqText);
    await page.setContent(html, { waitUntil: "networkidle" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm"
      }
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=mcqs.pdf"
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF GENERATION ERROR 👇");
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});