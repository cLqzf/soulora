const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const breatheButton = document.querySelector("#breathe");
if (breatheButton) {
  breatheButton.addEventListener("click", () => {
    breatheButton.textContent = breatheButton.textContent === "开始" ? "进行中" : "开始";
  });
}

const signupForm = document.querySelector("#signup-form");
const formNote = document.querySelector("#form-note");
if (signupForm && formNote) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signupForm.reset();
    formNote.textContent = "✓ 已收到，我们会在开放体验时联系你";
  });
}
