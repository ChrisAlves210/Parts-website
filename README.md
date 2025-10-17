# My Parts Store (Beginner Version)

A very simple static website built step-by-step. It intentionally looks like a beginner project: plain HTML, a single CSS file, and a tiny bit of JavaScript.

## Files
- `index.html` — the homepage with a parts table and a contact form
- `styles.css` — very basic styling
- `script.js` — a small search filter and fake form submission

## How to view
Double-click `index.html` to open it in your browser.

Or run a tiny local server (optional):

```bash
# macOS / zsh
python3 -m http.server 8000
# then visit http://localhost:8000 in your browser
```

## What to try
- Type in the search box to filter parts by name
- Fill out the contact form and click Send (it will just show a thank-you message)
- Click a part row to put its name into the search box
- Click "Search Web" to open a DuckDuckGo search in a new tab for that part
 - Use the vendor buttons (Amazon, eBay, RockAuto, Google Shopping) to open searches on those sites

## Next steps (optional)
- Add more parts rows
- Add a second page (e.g., about.html)
- Save/load parts from a JSON file (still static)
