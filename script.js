const fileInput = document.getElementById('file');
const status = document.getElementById('status');
const progressBarFill = document.getElementById('progressBarFill');
const downloadLink = document.getElementById('downloadLink');
const fileInfo = document.getElementById('fileInfo');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const readableSize = (file.size / 1024).toFixed(1);
    fileInfo.innerText = `Selected: ${file.name} (${readableSize} KB)`;
  }
});

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const file = fileInput.files[0];

  if (!file || !email) {
    status.innerText = "❌ Both file and email are required.";
    return;
  }

  const allowedTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed'];
  if (!allowedTypes.includes(file.type)) {
    status.innerText = "❌ Only PDF or ZIP files are allowed.";
    return;
  }

  const formData = new FormData();
  formData.append('email', email);
  formData.append('file', file);

  // Reset UI
  progressBarFill.style.width = '0%';
  progressBarFill.innerText = '0%';
  status.innerText = 'Uploading...';
  downloadLink.style.display = 'none';

  try {
    let percent = 0;
    const fakeProgress = setInterval(() => {
      if (percent < 90) {
        percent += 10;
        progressBarFill.style.width = percent + '%';
        progressBarFill.innerText = percent + '%';
      } else {
        clearInterval(fakeProgress);
      }
    }, 200);

    const response = await fetch('https://automatedairsy.com/webhook/upload-docs', {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    progressBarFill.style.width = '100%';
    progressBarFill.innerText = '100%';

    if (response.ok) {
      status.innerText = "✅ Upload successful. Processing complete.";
      if (responseText.includes("http")) {
        downloadLink.href = responseText.trim();
        downloadLink.innerText = "Download Merged PDF";
        downloadLink.style.display = "inline-block";
      }
    } else {
      status.innerText = "❌ Merge failed: " + responseText;
    }
  } catch (err) {
    progressBarFill.style.width = '0%';
    progressBarFill.innerText = '0%';
    status.innerText = "❌ Error: " + err.message;
  }
});
