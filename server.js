const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
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
    const browser = await puppeteer.launch({
    headless: true,
    args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-zygote",
    "--single-process"
    ]
    });

    const page = await browser.newPage();
    const html = generateHTML(mcqText);

    await page.setContent(html, { waitUntil: "networkidle0" });

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

  res.status(500).json({
    error: err.message || "Unknown PDF error"
  });
}
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});