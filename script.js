// Very basic, beginner-style JS
// - Filters parts by name
// - Fakes a contact form submission message

document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('searchInput');
  var makeInput = document.getElementById('makeInput');
  var modelInput = document.getElementById('modelInput');
  var submodelInput = document.getElementById('submodelInput');
  var tbody = document.getElementById('partsTable').getElementsByTagName('tbody')[0];
  var rows = tbody.getElementsByTagName('tr');
  var webBtn = document.getElementById('webSearchBtn');
  var vendorButtons = document.getElementsByClassName('vendor-btn');

  function applyFilters() {
    var q = (input && input.value ? input.value.toLowerCase() : '');
  var mk = (makeInput && makeInput.value ? makeInput.value.toLowerCase() : '');
  var md = (modelInput && modelInput.value ? modelInput.value.toLowerCase() : '');
  var sm = (submodelInput && submodelInput.value ? submodelInput.value.toLowerCase() : '');
    for (var i = 0; i < rows.length; i++) {
      var tds = rows[i].getElementsByTagName('td');
      var name = tds[0] ? tds[0].textContent.toLowerCase() : '';
  var make = tds[1] ? tds[1].textContent.toLowerCase() : '';
  var model = tds[2] ? tds[2].textContent.toLowerCase() : '';
  var submodel = tds[3] ? tds[3].textContent.toLowerCase() : '';
      var match = true;
      if (q && name.indexOf(q) === -1) match = false;
      if (mk && make.indexOf(mk) === -1) match = false;
  if (md && model.indexOf(md) === -1) match = false;
  if (sm && submodel.indexOf(sm) === -1) match = false;
      rows[i].style.display = match ? '' : 'none';
    }
  }

  if (input) input.addEventListener('input', applyFilters);
  if (makeInput) makeInput.addEventListener('input', applyFilters);
  if (modelInput) modelInput.addEventListener('input', applyFilters);
  if (submodelInput) submodelInput.addEventListener('input', applyFilters);

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
        applyFilters();
      }
    });
  }

  // Web search button opens DuckDuckGo with the typed query
  function fullQuery() {
    var parts = [];
    if (input && input.value) parts.push(input.value);
    if (makeInput && makeInput.value) parts.push(makeInput.value);
  if (modelInput && modelInput.value) parts.push(modelInput.value);
  if (submodelInput && submodelInput.value) parts.push(submodelInput.value);
    return parts.join(' ').trim();
  }

  if (webBtn) {
    webBtn.addEventListener('click', function () {
      var q = fullQuery();
      if (!q) {
        alert('Type a part name first.');
        return;
      }
      var url = 'https://www.google.com/search?q=' + encodeURIComponent(q + ' parts');
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
      // RockAuto: use Google site search
      url = 'https://www.google.com/search?q=' + encodeURIComponent('site:rockauto.com ' + q);
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
      var q = fullQuery();
      openVendor(vendor, q);
    });
  }

  // Initial filter apply (in case inputs have preset values)
  applyFilters();
});
