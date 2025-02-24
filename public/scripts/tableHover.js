function downloadTableAsCSV(tableElement, filename = 'table_data.csv') {
  const headers = [];
  const headerRow = tableElement.querySelector('tr:nth-child(2)');
  headerRow.querySelectorAll('td').forEach(td => {
      const span = td.querySelector('span');
      if (span && td.colSpan === 3) {
          headers.push(span.textContent.trim());
      }
  });
  const rows = [];
  const dataRows = tableElement.querySelectorAll('tr:not(:nth-child(1)):not(:nth-child(2))');
  dataRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      let rowData = [];
      let description = '';
      let values = [];
      cells.forEach((cell, index) => {
          const span = cell.querySelector('span');
          const text = span ? span.textContent.trim() : '';
          if (cell.colSpan === 3 && text) {
              description = text;
          }
          else if (cell.style.textAlign === 'right' && text) {
              const numericText = text.replace(/[^0-9.-]/g, '');
              if (numericText) {
                  values.push(numericText);
              }
          }
      });
      if (description && values.length > 0) {
          rows.push([description, ...values]);
      }
  });
  let csvContent = headers.join(',') + '\n';
  rows.forEach(row => {
      csvContent += row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',') + '\n';
  });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

$(document).ready(function() {
  var hideTimeout; 
  function getFirstColumnCells(table) {
      var firstColumnCells = [];
      if (table.length === 0) {
          console.error('Invalid table element');
          return firstColumnCells;
      }
      table.find('tr').each(function() {
          var firstColumnCell = $(this).find('td:first');  
          if (firstColumnCell.length) {
              firstColumnCells.push(firstColumnCell);
          }
      });
      return firstColumnCells;
  }
  let tableFocus = undefined;
  $('table').mouseenter(function() {
      var tableOffset = $(this).offset();
      var tableHeight = $(this).outerHeight();
      var tableWidth = $(this).outerWidth();
      $tableFocus = $(this);
      $('#hoverButtons').css({
          top: tableOffset.top - $('#hoverButtons').outerHeight() - 10,
          left: tableOffset.left + (tableWidth / 2) - ($('#hoverButtons').outerWidth() / 2)
      }).show();
      console.log('showing');
      $('#hoverButtonSimilar').click(function() {
          var textList = [];
          let firstCol = getFirstColumnCells($tableFocus);
          firstCol.forEach(function(cell) {
              if (cell.text() !== "") {
                  textList.push(cell.text());                
              }
          });
          let jsonData = JSON.stringify(textList).replace(/[^\x00-\x7F]/g, "");
          let utf = btoa(unescape(encodeURIComponent(jsonData)));
          if (typeof utf !== 'undefinded') {
              let tablesTicker = $('#tickerLabel').text();
              const newUrl = `${window.location.origin}/tables/${tablesTicker}/${utf}`;
              window.open(newUrl, "_blank"); 
          }
      });
      $('#hoverButtonDownload').click(function() {
          var csv = [];
          var $table = $tableFocus;
          var rows = $table.find('tr');
          downloadTableAsCSV($tableFocus[0], 'table.csv');
      });
      clearTimeout(hideTimeout);
  });
  $('table').mouseleave(function() {
      hideTimeout = setTimeout(function() {
          $('#hoverButtons').hide();
          $('#hoverButtonSimilar').off('click');
          $('#hoverButtonDownload').off('click');
      }, 5000);
  });
  $('#viewFrame').scroll(function() {
      $('#hoverButtons').hide();
      $('#hoverButtonSimilar').off('click');
      $('#hoverButtonDownload').off('click');
      clearTimeout(hideTimeout);
  });
});