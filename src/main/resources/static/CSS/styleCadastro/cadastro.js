let currentStep = 0;

// Seleciona todas as etapas
const steps = document.querySelectorAll(".form-step");

// Botões
const nextButtons = document.querySelectorAll(".btn-next");
const backButtons = document.querySelectorAll(".btn-back");

// Passos da barra de progresso
const progressSteps = [
  document.getElementById("step1"),
  document.getElementById("step2"),
  document.getElementById("step3")
];
const progressLines = [
  document.getElementById("line1"),
  document.getElementById("line2")
];

function updateStepVisibility() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  progressSteps.forEach((p, i) => {
    p.classList.toggle("active", i <= currentStep);
  });

  progressLines.forEach((l, i) => {
    l.classList.toggle("active", i < currentStep);
  });
}

// Avançar
nextButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStepVisibility();
    }
  });
});

// Voltar
backButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateStepVisibility();
    }
  });
});

// Inicia corretamente
updateStepVisibility();