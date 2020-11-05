// Copyright (c) 2020, BB. Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

// modules
const GhostAdminAPI = require('@tryghost/admin-api');
const converter = require('@tryghost/html-to-mobiledoc');
const { extract } = require('article-parser');
const scrapeIt = require('scrape-it');
const moment = require('moment');

// config
require('dotenv').config();
const DOM = require('../config/dom');
const Articles = require('../config/articles.json');
const Authors = require('../config/authors.json');
const Locale = require('../config/locale.json');

(async () => {
    try {

        // configure Ghost
        const Ghost = new GhostAdminAPI({
            url: process.env.GHOST_URL,
            key: process.env.GHOST_KEY,
            version: "v3"
        });

        for (let id of Articles) {

            // configure url
            const url = process.env.BLOG_URL + '/' + id

            // scrape
            const extractHTML = await extract(url)

            const extractMeta = await scrapeIt(url, DOM)

            // get author email
            const author = Authors.filter(author => {
                return author.name === extractMeta.data.author
            })

            // fetch date locale and covert
            const trimmedDate = extractMeta.data.date.split(' op ')[1] 

            const localeFilter = Locale.filter(local => {                
                return trimmedDate.search(local.word) >= 0
            })

            let convertedDate
            
            if(localeFilter.length > 0) {
                convertedDate = trimmedDate.replace(localeFilter[0].word, localeFilter[0].translation)
            } else {
                convertedDate = trimmedDate
            }

            // parse properties
            const slug =  id.split('/')[1]
            const title = extractMeta.data.title
            const date = moment(new Date(convertedDate)).format()
            const excerpt = extractHTML.content.split('</p>')[0].replace(/<p>/i, '').substring(0, 297) + '...'
            const image =  process.env.SITE_URL + extractMeta.data.image
            const body = JSON.stringify(converter.toMobiledoc(extractHTML.content))
            const authors = [author[0].email]
            const tags = [slug.split('/')[0]]

            // create insert article object
            const article = {
                slug: slug,
                title: title,
                published_at: date,
                feature_image: image,
                authors: authors,
                tags: tags,
                custom_excerpt: excerpt,
                excerpt: excerpt,
                email: authors[0],
                mobiledoc: body,
                status: 'published'
            }

            // insert into ghost
            await Ghost.posts.add(article)
            console.log(article.slug + ' inserted into ghost.')
        }

    } catch (err) {
      console.trace(err);
    }
})()

// Promise interface
