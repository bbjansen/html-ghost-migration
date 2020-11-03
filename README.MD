# HTMl to Ghost Migration Script
> A simple migration script to move static HTML articles to Ghost. This script is specifically tailored to the static firm24.com blog but can be easily configured for any other website.

## To-Do
- Error on mobiledoc formating when posting to Ghost
- Excerpt won't store.

## Usage
Define the article slugs in `config/articles.json` without including the base URL of the blog. Define the author names used on the static blog and couple a Ghost account to it by email in `config/authors.json`.

### Environment
```
SITE_URL=https://firm24.com
BLOG_URL=https://firm24.com/blog
GHOST_URL=http://localhost:2368
GHOST_KEY=

```
