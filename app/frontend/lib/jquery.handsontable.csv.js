var handsontable2csv = {
    string: function(instance) {
        var headers = instance.getColHeader();
        
        //var csv = "sep=,\n"
        var csv = "";
        csv += headers.join(",") + "\n";
        csv = "\uFEFF" + csv;
        
        for (var i = 0; i < instance.countRows(); i++) { 
            var row = []; 
            for (var h in headers) { 
                const value = instance.getDataAtRowProp(i,instance.colToProp(h)); 
                var quoted; 
                if (value == null) { 
                    quoted = ""; 
                } else { 
                  // Double quotes if any, and quote whole string: 
                    quoted = '"'+value.toString().replace(/"/g,'""')+'"'; 
                } 
                row.push(quoted); 
            } 
            csv += row.join(",")+"\n"; 
        } 
        return csv;
    },
    
    download: function(instance, filename) {
        var csv = handsontable2csv.string(instance)

        var link = document.createElement("a");
        link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(csv));
        link.setAttribute("download", filename);

        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
    }
}
