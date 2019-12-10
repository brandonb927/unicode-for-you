import { writeFile, ensureFile } from 'fs-extra';
import gulp from 'gulp';
import gutil from 'gulp-util';
import cheerio from 'cheerio';
import request from 'sync-request';

import configDev from '../config/dev';
import configProd from '../config/prod';

// If this doesn't work, run the following in the browser after inspecting element
// on the page and selecting the first <tbody> so it's assigned to $0
//
// function mapper (el) {
//   let code = $('.code a', el)
//   if (code === null) { return null }
//
//   let emoji = $('.chars', el)
//   let name = $('.name', el)
//   let name_keywords = $$('[target=annotate]', el)
//   let keywords = [].map.call(name_keywords, (element) => {
//     return element.innerText
//   })
//   return {
//     'code': code.innerText,
//     'emoji': emoji.innerText,
//     'name': name.innerText,
//     'keywords': keywords,
//   }
// }
//
// let data = [].map.call($$('tr', $0), mapper).filter((elem) => { return elem !== null })
//
// copy(JSON.stringify(data))

const buildJSON = async (buildPath, callback) => {
  let filePath = `${buildPath}/unicode.json`;
  let url = 'http://unicode.org/emoji/charts/full-emoji-list.html';

  // 'touch' the file first so it exists when writing to it
  await ensureFile(filePath);

  gutil.log(
    gutil.colors.green('Scraping unicode.org, this might take awhile...')
  );

  let response = request('GET', url);
  let responseData = response.getBody('utf8');

  let $ = cheerio.load(responseData);
  let $tableRows = $('body table:first-of-type tr');
  let data = [];

  $tableRows.map((_, el) => {
    let $tableRow = $(el);
    let $code = $tableRow.find('.code a');
    let $emoji = $tableRow.find('.chars');
    let $name = $tableRow.find('.name').first();

    // The `keywords` field uses the same .name selector, so we target with
    // attribute selectors here
    let $nameKeywords = $tableRow.find('[target=annotate]');

    let keywords = [];
    $nameKeywords.map((_, el) => {
      let $keywordAnchor = $(el);
      if ($keywordAnchor !== null) {
        keywords.push($keywordAnchor.text());
      }
    });

    data.push({
      code: $code.text(),
      emoji: $emoji.text(),
      name: $name.text(),
      keywords: keywords
    });
  });

  // Some of the data might contain blank rows so filter them out here
  let jsonData = JSON.stringify(
    data.filter(char => {
      return char.code !== '';
    })
  );

  writeFile(filePath, jsonData, 'UTF-8', callback);
};

gulp.task('unicode_scraper:dev', callback => {
  buildJSON(configDev.jekyll.dest, callback);
});

gulp.task('unicode_scraper:prod', callback => {
  buildJSON(configProd.jekyll.dest, callback);
});
