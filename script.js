document.getElementById("uploadForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const response = await fetch("https://automatedairsy.com/webhook/upload-docs", {
    method: "POST",
    body: formData,
  });

  const status = document.getElementById("status");
  if (response.ok) {
    status.innerText = "✅ Upload successful. Check your email.";
  } else {
    status.innerText = "❌ Upload failed.";
  }
});
