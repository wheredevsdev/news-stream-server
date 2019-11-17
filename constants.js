const COLLECTIONS = {
	POST_REVIEW: 'postreview',
	PRE_REVIEW: 'PreReview'
};
exports.COLLECTIONS = COLLECTIONS;

const SOURCES = ['the-verge', 'wired', 'the-next-web', 'techradar', 'techcrunch', 'recode', 'engadget', 'ars-technica'];
exports.SOURCES = SOURCES;

const MAX_ARTICLES_TO_DUMP = 100;
exports.MAX_ARTICLES_TO_DUMP = MAX_ARTICLES_TO_DUMP;

const HackerNews_Top_Url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
exports.HackerNews_Top_Url = HackerNews_Top_Url;


const HackerNews_Story_Url = 'https://hacker-news.firebaseio.com/v0/item/';
exports.HackerNews_Story_Url = HackerNews_Story_Url;

const GNEWS_TOP_Url = `https://gnews.io/api/v3/topics/technology?max=20&token=${process.env.GNEWSTOKEN}`;
exports.GNEWS_TOP_Url = GNEWS_TOP_Url;