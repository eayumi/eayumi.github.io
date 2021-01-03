/**
 * converts an array of objects into a new file of name /filename/ and downloads the file.
 * @param {array} arr  :nested ok too.
 * @param {string} filename : must be of form 'name.json'
 */
function toJson(arr, filename) {

    var myJSON = JSON.stringify(arr);

    var blob = new Blob([myJSON], {
        type: 'text/json;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    d3.json(filename).then(function(data) {
        console.log(data);
    });

}