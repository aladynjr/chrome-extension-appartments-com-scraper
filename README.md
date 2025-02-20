# Apartments.com Data Scraper

A Chrome extension that scrapes and extracts apartment data from Apartments.com listings. This tool allows users to gather information about available units, including pricing, square footage, and availability dates, for specified apartment complexes.

<img src="images/ui.png" alt="UI Example" style="width: 80%; max-width: 600px;"/>

## Features

- Scrape apartment data from specific Apartments.com listings
- Extract detailed unit information including:
  - Unit number
  - Price
  - Square footage
  - Availability date
  - Bedroom type
  - Bathroom count
  - Model name
- Accumulate data from multiple scrapes in a single session
- Download scraped data as a JSON file
- Clear accumulated data as needed

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in your Chrome toolbar to open the popup.
2. Use the "Scrape Cortland" or "Scrape Gardenview" buttons to initiate data extraction for the respective apartment complexes.
3. The status of each scrape will be displayed in the status area.
4. Scraped data will appear in the text area in JSON format.
5. Click "Download JSON" to save the accumulated data as a JSON file.
6. Use "Clear Data" to reset all scraped information and start fresh.

## Customization

This was made to specifically scrape a couple complexes for a client. To scrape data from different apartment complexes:

1. Open `popup.js` in a text editor.
2. Locate the event listeners for the scrape buttons.
3. Update the URLs and apartment names in the `scrapeApartments()` function calls.

Example:
```javascript
document.getElementById('scrapeCortland').addEventListener('click', function() {
  scrapeApartments('https://www.apartments.com/your-new-complex-url/', 'Your New Complex Name');
});
```

## Limitations

- This extension is designed to work with specific Apartments.com listing pages and may not function correctly if the website's structure changes.
- It currently only scrapes data for one-bedroom apartments (uses the selector `div[data-tab-content-id="bed1"]`).
- The extension does not handle pagination; it only scrapes data visible on the initial load of the page.

## Disclaimer

This tool is for educational purposes only. Ensure you comply with Apartments.com's terms of service and respect their robots.txt file when using this extension. Web scraping may be against the website's terms of use, so use this tool responsibly and at your own risk.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/yourusername/your-repo-name/issues) if you want to contribute.

## License

[MIT](https://choosealicense.com/licenses/mit/)