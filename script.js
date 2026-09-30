const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQLB6fsS_LNSEQoEc8wYodS9o_lVFMSyo6Ab4RK0ft3KuRCCQUPwU8qH4RwJmK8pMp/exec";

// Bật / tắt nhạc
const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

if (music && musicButton) {
  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicButton.textContent = "🔇 Tắt nhạc";
      } catch (error) {
        musicButton.textContent = "⚠️ Không phát được nhạc";
      }
    } else {
      music.pause();
      musicButton.textContent = "🔊 Bật nhạc";
    }
  });
}

// Gửi biểu mẫu
async function sendForm(form, statusElement, action) {
  const submitButton = form.querySelector('button[type="submit"]');

  if (!SCRIPT_URL) {
    statusElement.textContent = "Chưa kết nối hệ thống gửi yêu cầu.";
    return;
  }

  const originalText = submitButton
    ? submitButton.textContent
    : "Gửi yêu cầu";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Đang gửi...";
  }

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
    console.error("Lỗi gửi biểu mẫu:", error);
    statusElement.textContent =
      "Gửi chưa thành công. Vui lòng kiểm tra kết nối hoặc thử lại.";
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
}

// Biểu mẫu gửi bài tập
const homeworkForm = document.getElementById("orderForm");
const homeworkStatus = document.getElementById("orderStatus");

if (homeworkForm && homeworkStatus) {
  homeworkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendForm(homeworkForm, homeworkStatus, "submit_homework");
  });
}

// Biểu mẫu đặt mua KEY
const keyForm = document.getElementById("keyForm");
const keyStatus = document.getElementById("keyStatus");

if (keyForm && keyStatus) {
  keyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendForm(keyForm, keyStatus, "key_order");
  });
}
