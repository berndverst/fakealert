// Use this map to track images we have already analyzed
var imgMap = new Map();

// This is where Craigslist shows the big images
gallery = document.getElementsByClassName('gallery')[0];

// This is where we display image warnings messages
var warningLabel = document.createElement('div');
warningLabel.style.visibility = 'hidden';
warningLabel.style.width = '100%';
warningLabel.style.backgroundColor = 'red';
warningLabel.style.padding = '5px';
warningLabel.appendChild(document.createTextNode('Image found via '));

// Include direct link to Google Image Search
var currentSearchLink = document.createElement('a');
currentSearchLink.appendChild(document.createTextNode('Google Image Search'));
currentSearchLink.title = 'Google Image Search';
currentSearchLink.href = 'https://images.google.com';
currentSearchLink.target = '_blank';

// Display some of the websites where the image was found
var searchResults = document.createElement('ul')

warningLabel.appendChild(currentSearchLink);
warningLabel.appendChild(document.createElement('br'));
warningLabel.appendChild(searchResults);

gallery.appendChild(warningLabel);


function hasSearchResult(xhr, imagesrc) {
  var data;
  if (!xhr.responseType || xhr.responseType === 'text') {
    data = xhr.responseText;
  } else if (xhr.responseType === 'document') {
    data = xhr.responseXML;
  } else {
    data = xhr.response;
  }

  // TODO: parse Google Search result page here and display results
  //       Do this by inserting <li> elements into searchResults

  if (data.includes('Pages that include matching images')) {
    imgMap.set(imagesrc, true);
    return true
  }
  else {
    imgMap.set(imagesrc, false);
    return false;
  }
}

function checkVisibleImage() {

  var imageToCheck = null;

  // find visible image
  var images = gallery.getElementsByClassName('slide');

  for(var i = 0; i < images.length; i++) {

    if (images[i].style.transform == 'translate(0px, 0px)') {
      imageToCheck = images[i].getElementsByTagName('img')[0];
      break;
    }
  }

  url = ('https://images.google.com/searchbyimage?image_url=' +
        encodeURIComponent(imageToCheck.src));

  // we already searched for this image before
  if (imgMap.has(imageToCheck.src)) {
    if (imgMap[imageToCheck.src]) {
      currentSearchLink.href = url;
      warningLabel.style.visibility = 'visible';
    } else {
      warningLabel.style.visibility = 'hidden';
    }
    return
  }



  asyncRequest = new XMLHttpRequest();
  asyncRequest.onreadystatechange = function(image, searchurl, xhr) {

    return function() {   
        if (xhr.readyState == 4) {
          found = hasSearchResult(xhr, image.src)

          if (found) {
            currentSearchLink.href = searchurl;
            image.width = image.width - 20;
            image.height = image.height - 20;
            image.style.border = '10px solid red';
            warningLabel.style.visibility = 'visible';
          } else {
            warningLabel.style.visibility = 'hidden';
          }
        }
    }
  } (imageToCheck, url, asyncRequest);

  asyncRequest.open('GET', url, true);
  asyncRequest.send(null);                
}


checkVisibleImage(gallery);

MutationObserver = window.MutationObserver;

var observer = new MutationObserver(function(mutations, observer){
  checkVisibleImage();
});

observer.observe(gallery, {
  subtree: true,
  attributes: false,
  childList: true
});
