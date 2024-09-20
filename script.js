document.addEventListener('DOMContentLoaded', function() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7DYkpNCOYNxty63urHwkGtk1uqnfkTbQlcnaPE4U6GvEZslJhqkaIJlXTtvzRsBgMkjNvAmhVomNb/pub?output=csv'; // Coloque o link do CSV aqui
  const presentesDiv = document.getElementById('presentes');
  
  fetch(sheetUrl)
    .then(response => response.text())
    .then(data => {
      // Usa um parser mais robusto para lidar com campos entre aspas que podem ter vírgulas
      const rows = data.split('\n').slice(1); // Remove o cabeçalho da planilha
      let tableHTML = '<table><thead><tr><th>Nome do Presente</th><th>Onde Comprar</th><th>Link</th></tr></thead><tbody>';
      
      rows.forEach(row => {
        // Use uma expressão regular para lidar com campos que podem conter vírgulas dentro de aspas
        const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);



        tableHTML += `<tr><td>${nome}</td><td>${ondeComprar}</td><td>`;

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


