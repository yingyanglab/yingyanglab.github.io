# Ying Yang — Academic Homepage

A responsive academic homepage built with plain HTML, CSS, and JavaScript. Editable content is stored in `content/*.json` and configured for Pages CMS in `.pages.yml`.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## GitHub Pages

In the repository settings, open **Pages**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.

Before publishing, replace any bracketed placeholder values through Pages CMS or the JSON files in `content/`.

## Content management

Connect the repository at [Pages CMS](https://app.pagescms.org/) to edit profile, research, publication, team, opportunity, and contact content. Pages CMS saves edits directly to the JSON files in the repository; uploaded images remain under `assets/images`.
