function getFirstColumnCells(table) {
    var firstColumnCells = [];
    
    if (table.length === 0) {
        console.error('Invalid table element');
        return firstColumnCells;
    }

    table.find('tr').each(function() {
        var firstColumnCell = $(this).find('td:first');  
        
        if (firstColumnCell.length) {
        firstColumnCells.push(firstColumnCell.text());
        }
    });

    return firstColumnCells;
}

function jaccardIndex(array1, array2) {
    var set1 = new Set(array1);
    var set2 = new Set(array2);

    // Calculate intersection
    var intersection = [...set1].filter(item => set2.has(item));

    // Calculate union
    var union = new Set([...set1, ...set2]);

    // Jaccard Index (intersection size / union size)
    var similarity = intersection.length / union.size;

    return similarity; // 0 to 1
}


$(document).ready(function() {
    let columnDataRaw = $('#columnData').data('columndata');
    let focusColumns = JSON.parse(atob(columnDataRaw));
    console.log(focusColumns);
    let similarTables = [];
    $('table').each(function(index, table) {
        let t = $(table);
        let c = getFirstColumnCells(t);
        let j = jaccardIndex(focusColumns, c);
        if (j > 0) {
            similarTables.push([$(table).clone(), j]);
            console.log('Table ' + index + ' : ' + j);
        }
    });
    similarTables.sort((a, b) => b[1] - a[1]);

    similarTables.forEach((item, index) => {
        // let clone = $(item).clone();
        $('#tableFrame').append($('</br>'));
        $('#tableFrame').append($('<h3>Table ' + (index+1) + ' (Match: ' + (item[1]*100).toFixed(2) + '%)</h3>'));
        $('#tableFrame').append(item[0]);
        $('#tableFrame').append($('</br>'));
    });

});