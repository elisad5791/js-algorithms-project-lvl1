import _ from 'lodash';

const getTerm = (word) => word.match(/\w+/g)[0];
const getWords = (txt) => txt.split(' ').map((item) => getTerm(item));

const getIndex = (docs) => docs
  .reduce((acc, doc) => {
    const { id, text } = doc;
    const words = getWords(text);
    return words.reduce((acc2, word) => {
      if (!acc2[word]) {
        return { ... acc2, [word]: { [id]: 1 } };
      }
      const current = acc2[word][id] ?? 0;
      const count = current + 1;
      return { ...acc2, [word]: { ...acc2[word], [id]: count } };
    }, acc);
  }, {});

const buildSearchEngine = (docs) => ({
  search(str) {
    const strWords = getWords(str);
    const index = getIndex(docs);
    const currentIndex = _.pick(index, strWords);
    const currentArray = _.values(currentIndex);
    const docCounter = currentArray.reduce((acc, value) => { 
        const docCounts = _.entries(value);
        return docCounts.reduce((acc1, [id, count]) => {
          const prev = acc1[id] ?? { words: 0, counts: 0 };
          const current = { words: prev.words + 1, counts: prev.counts + count };
          return { ...acc1, [id]: current };
        }, acc)
    }, {});
    const docCounterArr = _.entries(docCounter);
    docCounterArr.sort((a, b) => {
      if (b[1].words !== a[1].words) {
        return b[1].words - a[1].words;
      }
      return b[1].counts - a[1].counts;
    });
    const result = docCounterArr.map(([key]) => key);
    return result;
  },
});

export default buildSearchEngine;
