document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    prefixo: document.getElementById("prefixo"),
    sufixo: document.getElementById("sufixo"),
    incluirDateTime: document.getElementById("incluirDateTime"),
    trim: document.getElementById("trim"),
    forcarUpperCase: document.getElementById("forcarUpperCase"),
    idGerado: document.getElementById("idGerado"),
    copiar: document.getElementById("copiar"),
    gerarNovoId: document.getElementById("gerarNovoId"),
    clearFields: document.getElementById("clearFields"),
    popupCopiar: document.getElementById("popup_copiar"),
    popupInvalido: document.getElementById("popup_copiar_invalido"),
  };

  // Inicialização dos valores armazenados
  initializeFieldsFromLocalStorage();

  // Eventos principais
  elements.copiar.addEventListener("click", handleClickCopiar);
  elements.gerarNovoId.addEventListener("click", handleClickCriarNovoId);
  elements.clearFields.addEventListener("click", handleClickClearFields);

  // Armazenar valores no localStorage conforme usuário digita
  setupInputPersistence();

  // Funções auxiliares

  function initializeFieldsFromLocalStorage() {
    elements.prefixo.value = localStorage.getItem("prefixo") || "";
    elements.sufixo.value = localStorage.getItem("sufixo") || "";
    elements.incluirDateTime.checked = JSON.parse(
      localStorage.getItem("incluirDateTime") || "false"
    );
    elements.trim.checked = JSON.parse(localStorage.getItem("trim") || "false");
    elements.forcarUpperCase.checked = JSON.parse(
      localStorage.getItem("forcarUpperCase") || "false"
    );
    elements.idGerado.value = "";
  }

  function setupInputPersistence() {
    elements.prefixo.addEventListener("input", (e) =>
      localStorage.setItem("prefixo", e.target.value || "")
    );
    elements.sufixo.addEventListener("input", (e) =>
      localStorage.setItem("sufixo", e.target.value || "")
    );
    elements.incluirDateTime.addEventListener("input", (e) =>
      localStorage.setItem("incluirDateTime", e.target.checked)
    );
    elements.trim.addEventListener("input", (e) =>
      localStorage.setItem("trim", e.target.checked)
    );
    elements.forcarUpperCase.addEventListener("input", (e) =>
      localStorage.setItem("forcarUpperCase", e.target.checked)
    );
  }

  function handleClickCopiar(event) {
    const id = elements.idGerado.value;
    const el = event.currentTarget;

    el.classList.replace(
      "text-gray-400",
      id ? "text-green-500" : "text-red-500"
    );

    const popup = id ? elements.popupCopiar : elements.popupInvalido;
    popup.classList.replace("opacity-0", "opacity-100");

    if (id) copiarId();

    setTimeout(() => {
      el.classList.replace(
        id ? "text-green-500" : "text-red-500",
        "text-gray-400"
      );
      popup.classList.replace("opacity-100", "opacity-0");
    }, 750);
  }

  function handleClickCriarNovoId(event) {
    const el = event.currentTarget;
    el.classList.replace("text-gray-400", "text-blue-300");

    setTimeout(
      () => el.classList.replace("text-blue-300", "text-gray-400"),
      1000
    );
  }

  function handleClickClearFields(event) {
    const el = event.currentTarget;
    el.classList.replace("text-gray-400", "text-red-500");

    ["prefixo", "sufixo", "incluirDateTime", "trim", "forcarUpperCase"].forEach(
      (key) => localStorage.removeItem(key)
    );

    elements.prefixo.value = "";
    elements.sufixo.value = "";
    elements.incluirDateTime.checked = false;
    elements.trim.checked = false;
    elements.forcarUpperCase.checked = false;
    elements.idGerado.value = "";

    setTimeout(
      () => el.classList.replace("text-red-500", "text-gray-400"),
      1000
    );
  }
});

// Função para obter a data e hora atual no formato YYYYMMDDHHMMSS
function getCurrentDateNumbers() {
  const date = new Date();
  const format = (num) => num.toString().padStart(2, "0");

  return [
    date.getFullYear(),
    format(date.getMonth() + 1),
    format(date.getDate()),
    format(date.getHours()),
    format(date.getMinutes()),
    format(date.getSeconds()),
  ].join("");
}

// Função principal de geração do ID
function gerarNovoId() {
  const prefixo = document.getElementById("prefixo").value || "";
  const sufixo = document.getElementById("sufixo").value || "";
  const incluirDateTime = document.getElementById("incluirDateTime").checked;
  const trim = document.getElementById("trim").checked;
  const forcarUpperCase = document.getElementById("forcarUpperCase").checked;

  const partes = [];

  if (prefixo) partes.push(prefixo);
  if (incluirDateTime) partes.push(getCurrentDateNumbers());
  if (typeof uuid !== "undefined" && uuid.v4) partes.push(uuid.v4());
  if (sufixo) partes.push(sufixo);

  let id = partes.join("-");

  if (trim) id = id.replace(/-/g, "");
  if (forcarUpperCase) id = id.toUpperCase();

  document.getElementById("idGerado").value = id;
}

// Função para copiar o ID gerado para a área de transferência
function copiarId() {
  const idGerado = document.getElementById("idGerado");
  if (!idGerado) return;

  navigator.clipboard
    .writeText(idGerado.value)
    .then(() => console.log("ID Copiado!"))
    .catch((err) => console.error("Erro ao copiar: ", err));
}
