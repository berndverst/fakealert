function hasSearchResult(xhr) {
    var data;
    if (!xhr.responseType || xhr.responseType === "text") {
        data = xhr.responseText;
    } else if (xhr.responseType === "document") {
        data = xhr.responseXML;
    } else {
        data = xhr.response;
    }

    // TODO: parse Google Search result page here and analyze results
    //
    // doc = document.implementation.createHTMLDocument("imagessearch");
    // doc.documentElement.innerHTML = data;

    if (data.includes("Pages that include matching images")) {
        return true
    }
    else {
        return false;
    }
}


// Find all images (larger than 100x100 to avoid icons)
        
var images = document.getElementsByTagName('img'); 
imgList = [];
for(var i = 0; i < images.length; i++) {
    if ((images[i].height > 99) && (images[i].width > 99)
            && images[i].src.startsWith('https://images.')) {

        url = ('https://images.google.com/searchbyimage?image_url=' +
              encodeURIComponent(images[i].src));

        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(image, searchurl) {

            return function() {   
                if (xhr.readyState == 4) {
                    found = hasSearchResult(xhr)

                    if (found) {
                        image.width = image.width - 20;
                        image.height = image.height - 20;
                        image.style.border = '10px solid red';
                        image.onclick = function() {
                            window.open(searchurl, '_blank')};
                    }
                }
            }
        } (images[i], url);

        xhr.open('GET', url, true);
        xhr.send(null);                
    }
}