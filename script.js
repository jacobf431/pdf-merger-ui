document.getElementById('upload-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('zip-file');
  const emailInput = document.getElementById('email');
  const statusDiv = document.getElementById('status');

  if (!fileInput.files.length || !emailInput.value) {
    statusDiv.textContent = 'Please upload a file and enter your email.';
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('email', emailInput.value);

  try {
    const response = await fetch('https://automatedairsy.com/webhook/upload-docs', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.message?.includes('started')) {
      statusDiv.textContent = 'Success! Check your email shortly.';
    } else {
      statusDiv.textContent = 'Something went wrong.';
    }
  } catch (err) {
    statusDiv.textContent = 'Upload failed. Please try again.';
    console.error(err);
  }
});
