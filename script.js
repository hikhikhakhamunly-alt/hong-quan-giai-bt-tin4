
const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicButton.textContent = "🔇 Tắt nhạc";
    } catch {
      musicButton.textContent = "⚠️ Chưa có file nhạc";
    }
  } else {
    music.pause();
    musicButton.textContent = "🔊 Bật nhạc";
  }
});

// Dán URL Web App Apps Script vào đây sau khi triển khai.
const SCRIPT_URL = "";

async function sendForm(form, statusElement, action) {
  if (!SCRIPT_URL) {
    statusElement.textContent =
      "Chưa kết nối Gmail. Cần thiết lập Apps Script trước.";
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Đang gửi...";

  const formData = Object.fromEntries(new FormData(form).entries());
  formData.action = action;

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error(result.message || "Không gửi được yêu cầu.");
    }

    statusElement.textContent =
      "Đã gửi yêu cầu thành công. Vui lòng chờ quản trị viên xác nhận.";
    form.reset();
  } catch (error) {
    statusElement.textContent =
      "Gửi chưa thành công. Vui lòng thử lại sau.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

const homeworkForm = document.getElementById("orderForm");
const homeworkStatus = document.getElementById("orderStatus");
const keyForm = document.getElementById("keyForm");
const keyStatus = document.getElementById("keyStatus");

homeworkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendForm(homeworkForm, homeworkStatus, "submit_homework");
});

keyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendForm(keyForm, keyStatus, "key_order");
});
