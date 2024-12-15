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
            console.log('Table ' + index + ' : ' + j);
            let clone = $(table).clone();
            $('#tableFrame').append($('</br>'));
            $('#tableFrame').append($('<h2>Table ' + index + '</h2>'));
            $('#tableFrame').append(clone);
            $('#tableFrame').append($('</br>'));

        }
    });
});