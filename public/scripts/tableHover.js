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

      $('#hoverButton').css({
        top: tableOffset.top - $('#hoverButton').outerHeight() - 10,
        left: tableOffset.left + (tableWidth / 2) - ($('#hoverButton').outerWidth() / 2)
      }).show();


      $('#hoverButton').click(function() {
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

      clearTimeout(hideTimeout);
    });

    $('table').mouseleave(function() {
      hideTimeout = setTimeout(function() {
        $('#hoverButton').hide();
        $('#hoverButton').off('click');
      }, 5000);
    });

    $('#viewFrame').scroll(function() {
          $('#hoverButton').hide();
          $('#hoverButton').off('click');
          clearTimeout(hideTimeout);
    });
  });