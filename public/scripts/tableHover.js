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

          let jsonData = JSON.stringify(textList);
          let utf = btoa(unescape(encodeURIComponent(jsonData)));

          if (typeof utf !== 'undefinded') {
            let tablesTicker = $('#tickerLabel').text();
            const newUrl = `${window.location.origin}/tables/${tablesTicker}/${utf}`;
            // window.location.href = newUrl;
            window.open(newUrl, "_blank"); 
          }
        });

        $('#hoverButtonDownload').click(function() {
              var csv = [];
        
              var rows = $tableFocus.find('tr');
              
              rows.each(function () {
                var row = [];
                
                $(this).find('td, th').each(function () {
                  row.push($(this).text().trim()); 
                });
                
                csv.push(row.join(','));
              });
          
              var csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
          
              var link = document.createElement('a');
              link.href = URL.createObjectURL(csvFile);
              link.download = 'table.csv';
              link.click();
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