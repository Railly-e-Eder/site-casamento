document.addEventListener("DOMContentLoaded", function () {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS7DYkpNCOYNxty63urHwkGtk1uqnfkTbQlcnaPE4U6GvEZslJhqkaIJlXTtvzRsBgMkjNvAmhVomNb/pub?output=csv"; // Coloque o link do CSV aqui
  const presentesDiv = document.getElementById("presentes");

  fetch(sheetUrl)
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split("\n").slice(1); // Remove o cabeçalho da planilha
      let portfolioHTML = "";

      rows.forEach((row) => {
        const columns = row.split(",");
        const nome = columns[0];
        const ondeComprar = columns[1];
        const link = columns[2].trim(); // Remove espaços em branco
        const status = columns[3].trim();
        const categoria = columns[4].trim();
        const imgUrl = columns[5] ? columns[5].trim() : "";

        // Verifica se o item está disponível
        // if (status.toLowerCase() === 'disponivel') {
        portfolioHTML += criarElementoPresente({
          nome: nome,
          categoria: categoria || "uncategorized",
          url: link,
          ondeComprar: ondeComprar,
          imgUrl: imgUrl || "https://via.placeholder.com/150",
        });
        // }
      });

      presentesDiv.innerHTML = portfolioHTML;

      let portfolioContainer = document.querySelector(".portfolio-container");
      if (portfolioContainer) {
        let portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: ".portfolio-item",
        });

        let portfolioFilters = document.querySelectorAll(
          "#portfolio-flters li"
        );

        portfolioFilters.forEach((filter) => {
          filter.addEventListener("click", function (e) {
            e.preventDefault();
            portfolioFilters.forEach((el) =>
              el.classList.remove("filter-active")
            );
            this.classList.add("filter-active");

            portfolioIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
          });
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar a lista de presentes:", error);
      presentesDiv.innerHTML = "<p>Erro ao carregar a lista de presentes.</p>";
    });

  var d = new Date(2025, 0, 18);

  // default example
  simplyCountdown(".simply-countdown-one", {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  });

  // window.addEventListener('load', () => {

  // });

  function criarElementoPresente(presente) {
    return `
      <div type="button" onclick="criarPix('${
        presente.nome
      }')" class="col-lg-4 col-md-4 portfolio-item filter-${presente.categoria}" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <div class="portfolio-info h-100 card">
        <img src="${
          presente.imgUrl
        }" alt="${presente.nome}" class="img-fluid card-img-top">
         <div class="card-body">
        <h4>${presente.nome}</h4>
        <p>Categoria: ${presente.categoria}</p>
        <p>Onde Comprar: ${presente.ondeComprar}</p>
        ${
          presente.url
            ? `<a href="${presente.url}" target="_blank" class="btn btn-primary">Ver Presente</a>`
            : ""
        }
     
        </div>
      </div>
      </div>
    `;
  }
});

function criarPix(nome) {
  console.log(nome);
  //nome sem acentos e apenas 10 caracteres
  const nomeSemAcentos = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Limita o nome a 15 caracteres
  const nomeLimite = nomeSemAcentos.slice(0, 18);

  const pix = new Pix("12332374469", nomeSemAcentos, "Railly", "Floresta", 0.0);

  const payload = pix.getPayload();
  document.getElementById("payload").value = payload;

  const canvas = document.getElementById("qrcode");
  QRCode.toCanvas(canvas, payload, (error) => {
    if (error) console.error(error);
    else console.log("QR Code gerado com sucesso!");
  });

  // Garantir que o modal esteja visível
  document.getElementById("modal").style.display = "block";
}

function copiarPix() {
  const payloadInput = document.getElementById("payload");
  payloadInput.select();
  payloadInput.setSelectionRange(0, 99999); // Para dispositivos móveis

  document.execCommand("copy");
  alert("Código PIX copiado para a área de transferência!");
}
