const COLLECTIONS = {
	POST_REVIEW: 'postreview',
	PRE_REVIEW: 'PreReview'
};
exports.COLLECTIONS = COLLECTIONS;

const SOURCES = ['the-verge', 'wired', 'the-next-web', 'techradar', 'techcrunch', 'recode', 'engadget', 'ars-technica'];
exports.SOURCES = SOURCES;

const MAX_ARTICLES_TO_DUMP = 100;
exports.MAX_ARTICLES_TO_DUMP = MAX_ARTICLES_TO_DUMP;

const HACKERNEWS_TOP_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
exports.HACKERNEWS_TOP_URL = HACKERNEWS_TOP_URL;


const HACKERNEWS_STORY_URL = 'https://hacker-news.firebaseio.com/v0/item/';
exports.HACKERNEWS_STORY_URL = HACKERNEWS_STORY_URL;

const GNEWS_TOP_URL = `https://gnews.io/api/v3/topics/technology?max=20&token=${process.env.GNEWSTOKEN}`;
exports.GNEWS_TOP_URL = GNEWS_TOP_URL;