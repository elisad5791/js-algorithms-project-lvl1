const buildSearchEngine = (docs) => ({
  docs,
  getTerm(word) {
    return word.match(/\w+/g)[0];
  },
  getWords(txt) {
    return txt
      .split(' ')
      .map((item) => this.getTerm(item));
  },
  search(word) {
    const termWord = this.getTerm(word);
    return this.docs
      .map((doc) => {
        const { id, text } = doc;
        const docWords = this.getWords(text);
        const count = docWords.reduce((acc, item) => (item === termWord ? acc + 1 : acc), 0);
        return { id, count };
      })
      .filter((doc) => doc.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((doc) => doc.id);
  },
});

export default buildSearchEngine;
