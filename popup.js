let cumulativeData = [];
let scrapeStatus = {
  'Cortland Village': 'Not started',
  'Gardenview Apartments': 'Not started'
};

function updateStatus() {
  const statusDiv = document.getElementById('status');
  statusDiv.innerHTML = Object.entries(scrapeStatus)
    .map(([name, status]) => `${name}: ${status}`)
    .join('<br>');
}

function updateOutput() {
  document.getElementById('output').value = JSON.stringify(cumulativeData, null, 2);
}

function scrapeApartments(url, apartmentName) {
  scrapeStatus[apartmentName] = 'In progress';
  updateStatus();

  fetch(url)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const selector = '#pricingView > div[data-tab-content-id="bed1"] > div';
      const cards = doc.querySelectorAll(selector);
      
      if (cards.length === 0) {
        cumulativeData.push({
          ScrapeDate: new Date().toISOString().split('T')[0],
          ComplexName: apartmentName,
          Error: "No cards found. The page structure might have changed."
        });
        scrapeStatus[apartmentName] = 'Completed (No data)';
        updateStatus();
        updateOutput();
        return;
      }
      
      cards.forEach((card) => {
        const titleElement = card.querySelector('div.priceGridModelWrapper.js-unitContainer.mortar-wrapper > div.row > div.column1 > div > h3 > span.modelName');
        const cardTitle = titleElement ? titleElement.textContent.trim() : 'N/A';
        
        const bedsElement = card.querySelector('div.priceGridModelWrapper.js-unitContainer.mortar-wrapper > div.row > div.column1 > div > h4 > span:nth-child(1) > span:nth-child(1)');
        const beds = bedsElement ? bedsElement.textContent.trim() : 'N/A';
        
        const bathsElement = card.querySelector('div.priceGridModelWrapper.js-unitContainer.mortar-wrapper > div.row > div.column1 > div > h4 > span:nth-child(1) > span:nth-child(2)');
        const baths = bathsElement ? bathsElement.textContent.trim() : 'N/A';
        
        const squareFeetElement = card.querySelector('div.priceGridModelWrapper.js-unitContainer.mortar-wrapper > div.row > div.column1 > div > h4 > span:nth-child(1) > span:nth-child(3)');
        const squareFeet = squareFeetElement ? squareFeetElement.textContent.trim() : 'N/A';
        
        const priceElement = card.querySelector('div.priceGridModelWrapper.js-unitContainer.mortar-wrapper > div.row > div.column1 > div > h3 > span.rentLabel');
        const priceRange = priceElement ? priceElement.textContent.trim() : 'N/A';
        
        const unitGridContainer = card.querySelector('div.unitGridContainer.mortar-wrapper');
        if (unitGridContainer) {
          const unitElements = unitGridContainer.querySelectorAll('li.unitContainer');
          
          unitElements.forEach((unit) => {
            const unitNumber = unit.querySelector('.unitColumn span[title]')?.getAttribute('title') || 'N/A';
            const unitPrice = unit.querySelector('.pricingColumn span[data-rentalkey]')?.textContent.trim() || 'N/A';
            const unitSqft = unit.querySelector('.sqftColumn span:not(.screenReaderOnly)')?.textContent.trim() || 'N/A';
            const availability = unit.querySelector('.dateAvailable')?.textContent.replace(/\s+/g, ' ').trim() || 'N/A';
            
            cumulativeData.push({
              ScrapeDate: new Date().toISOString().split('T')[0],
              ComplexName: apartmentName,
              BedroomType: beds.split(' ')[0] + "Brm",
              UnitNumber: unitNumber,
              SqFt: unitSqft,
              Price: unitPrice,
              AvailableDate: parseAvailabilityDate(availability),
              ModelName: cardTitle,
              Baths: baths,
              PriceRange: priceRange
            });
          });
        }
      });
      
      scrapeStatus[apartmentName] = 'Completed';
      updateStatus();
      updateOutput();
    })
    .catch(error => {
      cumulativeData.push({
        ScrapeDate: new Date().toISOString().split('T')[0],
        ComplexName: apartmentName,
        Error: error.message
      });
      scrapeStatus[apartmentName] = 'Error';
      updateStatus();
      updateOutput();
    });
}

function parseAvailabilityDate(availability) {
  const currentYear = new Date().getFullYear();
  const months = {
    'Jan.': '01', 'Feb.': '02', 'Mar.': '03', 'Apr.': '04', 'May': '05', 'Jun.': '06',
    'Jul.': '07', 'Aug.': '08', 'Sep.': '09', 'Oct.': '10', 'Nov.': '11', 'Dec.': '12'
  };
  
  if (availability.toLowerCase().includes('now')) {
    return new Date().toISOString().split('T')[0];
  }
  
  const parts = availability.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]];
    const day = parts[1].padStart(2, '0');
    return `${currentYear}-${month}-${day}`;
  }
  
  return availability;
}

function downloadJSON() {
  const dataStr = JSON.stringify(cumulativeData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'apartment_data.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

document.getElementById('scrapeCortland').addEventListener('click', function() {
  scrapeApartments('https://www.apartments.com/cortland-village-apartment-homes-hillsboro-or/xgl1sfm/', 'Cortland Village');
});

document.getElementById('scrapeGardenview').addEventListener('click', function() {
  scrapeApartments('https://www.apartments.com/gardenview-apartments-gainesville-fl/rhn3f53/', 'Gardenview Apartments');
});

document.getElementById('clearData').addEventListener('click', function() {
  cumulativeData = [];
  scrapeStatus = {
    'Cortland Village': 'Not started',
    'Gardenview Apartments': 'Not started'
  };
  updateStatus();
  updateOutput();
});

document.getElementById('downloadData').addEventListener('click', downloadJSON);

updateStatus();
updateOutput();