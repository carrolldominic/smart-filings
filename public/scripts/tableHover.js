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
            // window.location.href = newUrl;
            window.open(newUrl, "_blank"); 
          }
        });

        $('#hoverButtonDownload').click(function() {
          var csv = [];
          var $table = $tableFocus; // Ensure this points to your table (e.g., $('#yourTableId') or $('.yourTableClass'))
          
          // Select all rows from the table
          var rows = $table.find('tr');
          
          rows.each(function() {
              var row = [];
              // Find all cells (td or th) in the row
              $(this).find('td, th').each(function() {
                  var text = $(this).text().trim(); // Get the text content and trim whitespace
                  
                  // Handle special cases for your table:
                  // 1. Remove commas from numbers (e.g., "36,330" -> "36330")
                  text = text.replace(/,/g, '');
                  // 2. Replace line breaks (e.g., "December 28,\n2024") with a space or other delimiter
                  text = text.replace(/\n/g, ' ');
                  // 3. Skip cells with no meaningful content (e.g., empty or just padding)
                  if (text.length > 0 && text !== '$' && text !== ' ') { // Ignore empty cells, standalone '$', or non-breaking spaces
                      row.push('"' + text + '"'); // Wrap text in quotes to handle commas or spaces within the text
                  }
              });
              // Only add non-empty rows to the CSV
              if (row.length > 0) {
                  csv.push(row.join(','));
              }
          });
          
          // Join rows with newlines to create the CSV content
          var csvContent = csv.join('\n');
          // Create a Blob for the CSV file
          var csvFile = new Blob([csvContent], { type: 'text/csv' });
          // Create a download link
          var link = document.createElement('a');
          link.href = URL.createObjectURL(csvFile);
          link.download = 'financial_data.csv'; // Customize the filename
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