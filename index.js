const sum = (arr) => arr.reduce((acc, item) => acc + item, 0);
const getTerm = (word) => word.match(/\w+/g)[0];
const getWords = (txt) => txt.split(' ').map((item) => getTerm(item));
const getCount = (word, arr) => arr.reduce((acc, wordArr) => word === wordArr ? acc + 1 : acc, 0);
const getNotZero = (arr) => arr.reduce((acc, item) => item > 0 ? acc + 1 : acc, 0);

const buildSearchEngine = (docs) => ({
  docs,
  search(str) {
    const strWords = getWords(str);
    const counters = this.docs.map((doc) => {
      const { id, text } = doc;
      const docWords = getWords(text);
      const counts = strWords
        .reduce((acc1, strWord) => {
          const count = getCount(strWord, docWords);
          acc1.push(count);
          return acc1;
        }, []);
      return { id, counts };
    });
    const filteredCounters = counters.filter((counter) => sum(counter.counts) > 0);
    filteredCounters.sort((a, b) => {
      const diff = getNotZero(b.counts) - getNotZero(a.counts);
      if (diff !== 0) {
        return diff;
      } else {
        return sum(b.counts) - sum(a.counts);
      }
    });
    const result = filteredCounters.map((doc) => doc.id);
    return result;
  },
});

export default buildSearchEngine;
