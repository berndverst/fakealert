// Use this map to track images we have already analyzed
var imgMap = new Map();

function hasSearchResult(xhr, imagesrc) {
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
    imgMap.set(imagesrc, true);
    return true
  }
  else {
    imgMap.set(imagesrc, false);
    return false;
  }
}

function checkImagesInElement(element) {

  var images = element.getElementsByTagName('img');

  imgList = [];
  for(var i = 0; i < images.length; i++) {
    // Find all images (larger than 100x100 to avoid icons)
    if ((images[i].height > 99) && (images[i].width > 99)) {

      // we already searched for this image before
      if (imgMap.has(images[i].src)) {
        continue
      }

      url = ('https://images.google.com/searchbyimage?image_url=' +
            encodeURIComponent(images[i].src));

      asyncRequest = new XMLHttpRequest();
      asyncRequest.onreadystatechange = function(image, searchurl, xhr) {

        return function() {   
            if (xhr.readyState == 4) {
              found = hasSearchResult(xhr, image.src)

              if (found) {
                image.width = image.width - 20;
                image.height = image.height - 20;
                image.style.border = '10px solid red';
                image.onclick = function() {
                  window.open(searchurl, '_blank')};
              }
            }
        }
      } (images[i], url, asyncRequest);

      asyncRequest.open('GET', url, true);
      asyncRequest.send(null);                
    }
  }
}

gallery = document.getElementsByClassName("gallery")[0];
checkImagesInElement(gallery);

MutationObserver = window.MutationObserver;

var observer = new MutationObserver(function(mutations, observer){
  checkImagesInElement(gallery);
});

observer.observe(gallery, {
  subtree: true,
  attributes: false,
  childList: true
});
