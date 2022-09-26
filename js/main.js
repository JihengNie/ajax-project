var $mobileSearch = document.querySelector('.mobile-search-hidden');
var $windowSearch = document.querySelector('.window-search-hidden');
var windowCurrentSize = window.innerWidth;
var $listOfCardTexts = document.querySelectorAll('.truncate');
// Use Queryselector for a column-half element and populate the data from my API

window.addEventListener('resize', searchBarDisplay);

// Used for showing the correct search bar based on window size change
function searchBarDisplay(event) {
  if (window.innerWidth > 768) {
    $mobileSearch.className = 'hidden';
    $windowSearch.className = 'column-one-third search-bar-background window-search-hidden';
  } else {
    $windowSearch.className = 'hidden';
    $mobileSearch.className = 'column-one-third search-bar-background window-search-hidden';
  }
}

// Used for showing the correct search bar based on current window size
if (windowCurrentSize > 768) {
  $mobileSearch.className = 'hidden';
  $windowSearch.className = 'column-one-third search-bar-background window-search-hidden';
} else {
  $windowSearch.className = 'hidden';
  $mobileSearch.className = 'column-one-third search-bar-background window-search-hidden';
}

// Used for truncating texts
function truncateTexts() {
  var threeLines = 200;
  for (var i = 0; i < $listOfCardTexts.length; i++) {
    if ($listOfCardTexts[i].textContent.length >= threeLines) {
      $listOfCardTexts[i].textContent = $listOfCardTexts[i].textContent.slice(0, threeLines) + '...';
    }
  }
}
truncateTexts();

// Used to avoid CORS error
function getYugiohData(cardName) {
  var targetUrl = encodeURIComponent('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + cardName);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // console.log(xhr.response);
  });
  xhr.send();
}

getYugiohData('Blue-Eyes White Dragon');
