async function generatePDF() {
  const mcqText = document.getElementById("mcqInput").value;

  if (!mcqText.trim()) {
    alert("Please paste MCQs first");
    return;
  }

  const response = await fetch("/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mcqText })
  });

  if (!response.ok) {
  const err = await response.json();
  alert("PDF Error: " + err.error);
  return;
}

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "mcqs.pdf";
  a.click();

  window.URL.revokeObjectURL(url);
}