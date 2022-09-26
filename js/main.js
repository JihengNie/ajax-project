var $mobileSearch = document.querySelector('.mobile-search-hidden');
var $windowSearch = document.querySelector('.window-search-hidden');

window.addEventListener('resize', searchBarDisplay);

function searchBarDisplay(event) {
  if (window.innerWidth > 768) {
    $mobileSearch.className = 'hidden';
    $windowSearch.className = 'column-one-third search-bar-background window-search-hidden';
  } else {
    $windowSearch.className = 'hidden';
    $mobileSearch.className = 'column-one-third search-bar-background window-search-hidden';
  }
}
