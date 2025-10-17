// Very basic, beginner-style JS
// - Filters parts by name
// - Fakes a contact form submission message

document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('searchInput');
  var tbody = document.getElementById('partsTable').getElementsByTagName('tbody')[0];
  var rows = tbody.getElementsByTagName('tr');
  var webBtn = document.getElementById('webSearchBtn');
  var vendorButtons = document.getElementsByClassName('vendor-btn');

  if (input) {
    input.addEventListener('input', function () {
      var q = input.value.toLowerCase();
      for (var i = 0; i < rows.length; i++) {
        var nameCell = rows[i].getElementsByTagName('td')[0];
        var name = nameCell ? nameCell.textContent.toLowerCase() : '';
        rows[i].style.display = name.indexOf(q) !== -1 ? '' : 'none';
      }
    });
  }

  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) {
        status.textContent = 'Thanks! This form does not actually send.';
      }
      form.reset();
      setTimeout(function () {
        if (status) status.textContent = '';
      }, 3000);
    });
  }

  // Clicking a row fills the search box with that part's name
  for (var r = 0; r < rows.length; r++) {
    rows[r].addEventListener('click', function () {
      var nameCell = this.getElementsByTagName('td')[0];
      if (nameCell && input) {
        input.value = nameCell.textContent;
        var event = new Event('input');
        input.dispatchEvent(event);
      }
    });
  }

  // Web search button opens DuckDuckGo with the typed query
  if (webBtn) {
    webBtn.addEventListener('click', function () {
      var q = (input && input.value) ? input.value.trim() : '';
      if (!q) {
        alert('Type a part name first.');
        return;
      }
      var url = 'https://duckduckgo.com/?q=' + encodeURIComponent(q + ' parts');
      window.open(url, '_blank');
    });
  }

  // Vendor buttons: open specific vendor searches
  function openVendor(vendor, query) {
    var q = (query || '').trim();
    if (!q) {
      alert('Type a part name first.');
      return;
    }
    var url = '';
    if (vendor === 'amazon') {
      url = 'https://www.amazon.com/s?k=' + encodeURIComponent(q);
    } else if (vendor === 'ebay') {
      url = 'https://www.ebay.com/sch/i.html?_nkw=' + encodeURIComponent(q);
    } else if (vendor === 'rockauto') {
      // RockAuto does not have a simple query format for everything; fall back to a site search via DuckDuckGo
      url = 'https://duckduckgo.com/?q=' + encodeURIComponent('site:rockauto.com ' + q);
    } else if (vendor === 'gshop') {
      url = 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(q);
    } else {
      url = 'https://duckduckgo.com/?q=' + encodeURIComponent(q + ' parts');
    }
    window.open(url, '_blank');
  }

  for (var vb = 0; vb < vendorButtons.length; vb++) {
    vendorButtons[vb].addEventListener('click', function () {
      var vendor = this.getAttribute('data-vendor');
      var q = input ? input.value : '';
      openVendor(vendor, q);
    });
  }
});
