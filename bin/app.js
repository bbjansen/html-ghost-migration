// Copyright (c) 2020, BB. Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

// config
require('dotenv').config();
const DOM = require("../config/dom");
const Articles = require("../config/articles.json");
const Authors = require("../config/authors.json");

// modules
const GhostAdminAPI = require('@tryghost/admin-api');
const converter = require('@tryghost/html-to-mobiledoc');
const { extract } = require('article-parser');
const scrapeIt = require("scrape-it");


(async () => {
    try {

        // configure Ghost
        const Ghost = new GhostAdminAPI({
            url: process.env.GHOST_URL,
            key: process.env.GHOST_KEY,
            version: "v3"
        });

        for (let slug of Articles) {

            // configure url
            const url = process.env.BLOG_URL + '/' + slug

            // scrape
            const extractHTML = await extract(url)

            const extractMeta = await scrapeIt(url, DOM)

            // get author email
            const author = Authors.filter(author => {
                return author.name === extractMeta.data.author
            })

            // create object
            const article = {
                slug: slug.split('/')[1],
                title: extractMeta.data.title,
                feature_image: process.env.SITE_URL + extractMeta.data.image,
                authors: [author[0].email],
                tags: [slug.split('/')[0]],
                excerpt: extractHTML.content.split('</p>')[0].replace(/<p>/i, '').substring(0, 297) + '...',
                status: 'published',
                //html: extractHTML.content,
                mobiledoc: converter.toMobiledoc(extractHTML.content)

            }

            console.log(article)

            // insert into ghost
            await Ghost.posts.add(article)
            console.log(article.slug + ' inserted into ghost.')
        }

    } catch (err) {
      console.trace(err);
    }
})()

// Promise interface
