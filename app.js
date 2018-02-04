const express = require('express');
const ejs = require('ejs'); // eslint-disable-line
const frontmatter = require('front-matter');
const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');
const dtime = require('time-formater');
const order = require('orderby-time');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'articles')));
app.use(express.static(path.join(__dirname, 'articles/img')));

var efni = [ { 'articletitle': 0, 'slug': 0, 'date': 0, 'image': 0, 'html': 0 }, // eslint-disable-line
  { 'articletitle': 0, 'slug': 0, 'date': 0, 'image': 0, 'html': 0 },           // eslint-disable-line
  { 'articletitle': 0, 'slug': 0, 'date': 0, 'image': 0, 'html': 0 },           // eslint-disable-line
  { 'articletitle': 0, 'slug': 0, 'date': 0, 'image': 0, 'html': 0 } ];          // eslint-disable-line
const md = new markdownIt(); // eslint-disable-line
const file = ['articles/lorem-ipsum.md', 'articles/deloren-ipsum.md', 'articles/corporate-ipsum.md', 'articles/batman-ipsum.md'];
var mdefni = 0; // eslint-disable-line
// Lestur á md skjölum með lykkju
for (let i = 0; i < file.length; i += 1) {
  fs.readFile(file[i], 'utf8', (err, data) => { // eslint-disable-line
    if (err) throw err;
    const content = frontmatter(data);
    efni[i].articletitle = content.attributes.title;
    efni[i].slug = content.attributes.slug;
    efni[i].date = content.attributes.date;
    efni[i].image = content.attributes.image;
    efni[i].html = md.render(data.toString('utf8'));
    if (i === (file.length - 1)) {
      efni = order('date', efni);
      efni.reverse();
      for (let j = 0; j < efni.length; j += 1) {
        efni[j].date = dtime(efni[j].date).format('DD.M.YYYY');
      }
    }
  });
}

app.get('/', (req, res) => {
  res.render('index', { title: 'Greinasafnið', efni });
});

app.get('/:variable', (req, res, next) => {
  var match = 0; // eslint-disable-line
  for (let i = 0; i < efni.length; i += 1) { // Finn hvaða efni á að birta
    if (req.params.variable === efni[i].slug) {
      res.render('articles', { title: efni[i].articletitle, html: efni[i].html });
      match = 1;
    }
  }
  if (match === 0) {
    const err = res.status(404);
    next(err);
  }
});

app.use(function errorHandler(err, req, res, next) { // eslint-disable-line
  res.render('error', { title: 'Fannst ekki', skilabod: 'Ó nei, efnið finnst ekki!' });
});

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
