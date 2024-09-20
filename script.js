document.addEventListener('DOMContentLoaded', function() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7DYkpNCOYNxty63urHwkGtk1uqnfkTbQlcnaPE4U6GvEZslJhqkaIJlXTtvzRsBgMkjNvAmhVomNb/pub?output=csv'; // Coloque o link do CSV aqui
  const presentesDiv = document.getElementById('presentes');
  
  fetch(sheetUrl)
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n').slice(1); // Remove o cabeçalho da planilha
      let tableHTML = '<table><thead><tr><th>Nome do Presente</th><th>Onde Comprar</th><th>Link</th></tr></thead><tbody>';
      
      rows.forEach(row => {
        const columns = row.split(',');
        const nome = columns[0];
        const ondeComprar = columns[1];
        const link = columns[2].trim(); // Remove espaços em branco

        tableHTML += `<tr><td>${nome}</td><td>${ondeComprar || 'N/A'}</td><td>`;

        // Verifica se o link é válido e não é "undefined" ou vazio
        if (link && link !== 'undefined' && link !== '') {
          tableHTML += `<a href="${link}" target="_blank">Ver Presente</a>`;
        }

        tableHTML += `</td></tr>`;
      });
      
      tableHTML += '</tbody></table>';
      presentesDiv.innerHTML = tableHTML;
    })
    .catch(error => {
      console.error('Erro ao carregar a lista de presentes:', error);
      presentesDiv.innerHTML = '<p>Erro ao carregar a lista de presentes.</p>';
    });
});

