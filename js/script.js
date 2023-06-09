'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML)
};

const CloudClassCount = '5';


const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
  authorSizes: {
    count: 5,
    classPrefix: 'author-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
      titles: '.titles a',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  title: '.post-title',
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};



const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll(select.listOf.titles);

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll(select.all.articles);

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  console.log(articleSelector);


  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');

  console.log('clicked element', targetArticle);

};




function generateTitleLinks(customSelector = ''){

  /* [DONE] remove contents of titleList */

  const titleList = document.querySelector(select.listOf.titles);

  titleList.innerHTML = '';

  console.log( ' clicked link', titleList);

  /* [DONE] for each article */

  const articles = document.querySelectorAll(select.all.articles + customSelector);
  console.log('cstest', articles);

  let html = '';

  for(let article of articles){

    /* [DONE] get the article id */

    const articleId = article.getAttribute('id');

    /* [DONE] find the title element */
    /* [DONE] get the title from the title element */

    const articleTitle = article.querySelector(select.title).innerHTML;


    /* [DONE] create HTML of the link */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);


    console.log('link was clicked', linkHTML);


    /* insert link into html variable */
    html = html + linkHTML;

    console.log(html);

  }

  /* insert link into titleList */

  titleList.insertAdjacentHTML('afterbegin',html);


  const links = document.querySelectorAll(select.all.linksTo.titles);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){

  const params = {max : 0, min : 999999};



  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }

    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}
calculateTagsParams();


function calculateTagClass(CloudClassCount, params){

  params = {max : 0, min : 999999};

  const classNumber = Math.floor( ( (CloudClassCount - params.min) / (params.max - params.min) ) * CloudClassCount + 1 );
  console.log('class number', classNumber);

  return [opts.tagSizes.classPrefix + classNumber];

}
calculateTagClass();




function generateTags(){

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(select.all.articles);

  /* START LOOP: for every article: */

  for(let article of articles){
    console.log(article);


    /* find tags wrapper */

    const tagsWrapper = article.querySelectorAll(select.article.tags);


    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');

    console.log('articleTags', articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    console.log('split tags', articleTagsArray);

    /* START LOOP: for each tag */

    for(let tag of articleTagsArray){

      console.log('tag', tag);
      /* generate HTML of the link */

      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);

      //  const linkHTML = '<li><a href="#tag-' + tag +'">' + tag + '</a></li>';
      // console.log('linkhtml' , linkHTML);

      /* add generated code to html variable */

      html = html + linkHTML;
      console.log('html', html);

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      }else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */

    for(let tagWrapper of tagsWrapper){
      tagWrapper.insertAdjacentHTML('afterbegin', html);
      console.log('generate links of tag', tagWrapper);
    }
  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);


  /* [NEW] create variable for all links HTML code */

  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
  /* [NEW] generate code of a link and add it to allTagsHTML */

    const tagLinkHTML = '<li><a class=' + '"' + calculateTagClass(allTags[tag], tagsParams) + '"' + 'href="#tag-' +  tag + '">' + tag + '</a></li>';
    console.log('tagLinkHTML:', tagLinkHTML);

    console.log('cloud class count', CloudClassCount);

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });


  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData, 'all tags data');
}
generateTags();


function tagClickHandler(event){
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  console.log('clicked element', clickedElement);

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');
  console.log('replacedtag', tag);

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for(let activeTagLink of activeTagLinks){

    /* remove class active */

    activeTagLink.classList.remove('active');
    console.log('remove class active', activeTagLink);

  /* END LOOP: for each active tag link */
  }


  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log('tagLinks', tagLinks);

  /* START LOOP: for each found tag link */

  for(let tagLink of tagLinks){

    /* add class active */
    tagLink.classList.add('active');
    console.log('active', tagLink);
    /* END LOOP: for each found tag link */

  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
  console.log('check generateTitleLinks', generateTitleLinks);
}






function addClickListenersToTags(){
  /* find all links to tags */

  const linksToTags = document.querySelectorAll('a[href^="#tag-"]');
  console.log('loftgs', linksToTags);

  /* START LOOP: for each link */

  for(let linkToTag of linksToTags){

    /* add tagClickHandler as event listener for that link */
    linkToTag.addEventListener('click', tagClickHandler);
    console.log('click link to tag', linkToTag);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function calculateAuthorsParams(authors){

  const params = {max : 0, min : 999999};



  for(let author in authors){
    console.log(author + ' is used ' + authors[author] + ' times');
    if(authors[author] > params.max){
      params.max = authors[author];
    }

    if(authors[author] < params.min){
      params.min = authors[author];
    }
  }
  return params;
}
calculateAuthorsParams();


function calculateAuthorClass(CloudClassCount, params){

  params = {max : 0, min : 999999};

  const classNumber = Math.floor( ( (CloudClassCount - params.min) / (params.max - params.min) ) * CloudClassCount + 1 );
  console.log('class number', classNumber);

  return [opts.authorSizes.classPrefix + classNumber];

}
calculateAuthorClass();


function generateAuthors(){

  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* find all articles */

  const articles = document.querySelectorAll(select.all.articles);

  /* START LOOP: for every article: */

  for(let article of articles){
    console.log(article);
    /* find authors wrapper */

    const authorsWrapper = article.querySelectorAll(select.article.author);
    console.log('authors', authorsWrapper);

    /* make html variable with empty string */

    let html = '';

    /* get authors from data-author attribute */

    const author = article.getAttribute('data-author');

    console.log('articleAuthors', author);



    /* generate HTML of the link */

    const linkHTMLData = {id: author, title: author};
    const linkHTML = templates.authorLink(linkHTMLData);


    // const linkHTML = '<li><a href="#author-' + author +'">' + author + '</a></li>';
    // console.log('linkhtml' , linkHTML);

    /* add generated code to html variable */

    html = html + linkHTML;
    console.log('html', html);


    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors[author]) {
      /* [NEW] add tag to allAuthors object */
      allAuthors[author] = 1;
    }else {
      allAuthors[author]++;
    }

    /* insert HTML of all the links into the authors wrapper */

    for(let authorWrapper of authorsWrapper){
      authorWrapper.insertAdjacentHTML('afterbegin', html);
      console.log('generate links of author', authorWrapper);
    }

    /* [NEW] find list of authors in right column */
    const authorList = document.querySelector(select.listOf.authors);

    const authorsParams = calculateAuthorsParams(allAuthors);
    console.log('authorsParams:', authorsParams);

    /* [NEW] create variable for all links HTML code */
    let allAuthorsHTML = '';

    /* [NEW] START LOOP: for each author in allAuthors: */
    for(let author in allAuthors){
      /* [NEW] generate code of a link and add it to allAuthorsHTML */

      const authorLinkHTML = '<li><a class=' + '"' + calculateAuthorClass(allAuthors[author], authorsParams) + '"' + 'href="#author-' +  author + '">' + author + '</a></li>';
      console.log('authorLinkHTML:', authorLinkHTML);

      console.log('cloud class count', CloudClassCount);

      allAuthorsHTML += authorLinkHTML;
    }

    /*[NEW] add HTML from allTagsHTML to tagList */
    authorList.innerHTML = allAuthorsHTML;
  }
}
generateAuthors();

function authorClickHandler(event){

  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */

  const author = href.replace('#author-', '');
  console.log('replacedauthor', author);

  /* find all tag links with class active */

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log('active author links', activeAuthorLinks);

  /* START LOOP: for each active author link */

  for(let activeAuthorLink of activeAuthorLinks){

    /* remove class active */

    activeAuthorLink.classList.remove('active');
    console.log('remove class active', activeAuthorLink);

    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log('authorLinks', authorLinks);

  /* START LOOP: for each found author link */

  for(let authorLink of authorLinks){

    /* add class active */
    authorLink.classList.add('active');
    console.log('active author link', authorLink);
    /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-author="' + author + '"]');
  console.log('check generateTitleLinks author', generateTitleLinks);
}


function addClickListenersToAuthors(){

  /* find all links to authors */

  const linksToAuthors = document.querySelectorAll(select.all.linksTo.authors);
  console.log('links to authors', linksToAuthors);

  /* START LOOP: for each link */

  for(let linkToAuthor of linksToAuthors){

    /* add authorClickHandler as event listener for that link */
    linkToAuthor.addEventListener('click', authorClickHandler);
    console.log('click link to tag', linkToAuthor);
    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();




