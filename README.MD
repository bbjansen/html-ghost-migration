# HTMl to Ghost Migration Script
> A simple migration script to move static HTML articles to Ghost. This script is specifically tailored to the static firm24.com blog but can be easily configured for any other website.

## To-Do
- Error on mobiledoc formating when posting to Ghost
- Excerpt won't store.

## Usage
1. Define the article slugs in `config/articles.json` without including the base URL of the blog.
2. Define the author names used on the static blog and couple a Ghost account to it by email in `config/authors.json`.
3. Set the scraping atributes in `config/dom.js` to match the html website.
4. Adjust the locale publishing date in `config/locale.js`.

### Environment
```
SITE_URL=https://firm24.com
BLOG_URL=https://firm24.com/blog
GHOST_URL=http://localhost:2368
GHOST_KEY=

```
