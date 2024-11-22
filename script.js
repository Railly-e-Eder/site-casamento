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
        const Valor = columns[4].trim();
        const categoria = columns[5].trim();
        const imgUrl = columns[6] ? columns[6].trim() : "";

        // Verifica se o item está disponível
        // if (status.toLowerCase() === 'disponivel') {
        portfolioHTML += criarElementoPresente({
          nome: nome,
          categoria: categoria || "uncategorized",
          url: link,
          status: status,
          valor: Valor,
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
    const isReserved = presente.status.toLowerCase() === "reservado";
    return `
      <div type="button"  class="col-lg-4 col-md-4 portfolio-item filter-${
        presente.categoria
      } ${isReserved ? "disabled-card" : ""}" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <div class="portfolio-info h-100 card">
        <img src="${
          presente.imgUrl
        }" alt="${presente.nome}" class="img-fluid card-img-top">
         <div class="card-body">
        <h4>${presente.nome}</h4>
        <p>Categoria: ${presente.categoria}</p>
        ${
          presente.ondeComprar
            ? `<p>Onde Comprar: ${presente.ondeComprar}</p> `
            : ""
        }
       
        <strong class="bold">Valor: R$ ${presente.valor}</strong>
    
      </div>
      <div class="modal-footer d-flex justify-content-between align-items-center">

              <button class="btn d-flex justify-content-center align-items-center btn-primary" onclick='criarPix(${JSON.stringify(
                presente
              )})'><box-icon name='cart'></box-icon> Fazer Pix no Valor</button>
              ${
                presente.url
                  ? `<a href="${presente.url}" target="_blank" class="btn  d-flex justify-content-center align-items-center btn-secondary"><box-icon name='link-external'></box-icon> Onde Comprar</a>`
                  : ""
              }
            
      </div>
      <div class="mt-3">
      Se comprou ou vai comprar em um site externo nos envie uma confirmação <a
                target="_blank"
                href="https://api.whatsapp.com/send?phone=558796121653&text=Ol%C3%A1,%20gostaria%20de reservar%20o%20presente%20de%20casamento%20*${
                  presente.nome
                }*"
                >Reservar Presente</a>
      </div>
      </div>
      </div>
    `;
  }
});

function criarPix(presente) {
  console.log(presente);
  //nome sem acentos e apenas 10 caracteres
  const nomeSemAcentos = presente.nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  console.log(presente.valor);
  //format in number com ponto
  const valorFormat = presente.valor.replace(",", ".") || 0.0;
  console.log(valorFormat);
  const pix = new Pix(
    "12332374469",
    nomeSemAcentos,
    "Railly",
    "Floresta",
    Number(valorFormat)
  );

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
