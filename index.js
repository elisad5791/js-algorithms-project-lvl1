import _ from 'lodash';

const getTerm = (word) => {
  const matches = word.match(/\w+/g);
  if (matches) {
    return matches[0].toLowerCase();
  }
  return '';
};
const getTokens = (txt) => txt.split(' ').map((item) => getTerm(item)).filter((item) => item);
const getTokensForDocs = (docs) => docs.map(({ id, text }) => ({ id, tokens: getTokens(text) }));
const counter = (arr, term) => arr.reduce((acc, item) => (item === term ? acc + 1 : acc), 0);

const getAllTokensArray = (tokensForDocs) => {
  const allTokens = tokensForDocs.reduce((acc, { tokens }) => acc.concat(tokens), []);
  const uniqueTokens = _.uniq(allTokens);
  return uniqueTokens;
};

const getDocsForTokens = (allTokensArray, tokensForDocs) => {
  const index = allTokensArray.reduce((acc, token) => {
    const docsList = tokensForDocs.reduce((accInner, { id, tokens }) => {
      if (tokens.includes(token)) {
        return [...accInner, id];
      }
      return accInner;
    }, []);
    return { ...acc, [token]: docsList };
  }, {});
  return index;
};

const getIdf = (index1, docsCount) => {
  const entries = Object.entries(index1);
  const idf = entries.reduce((acc, [key, value]) => {
    const coef = _.round(Math.log(1 + docsCount / value.length), 3);
    return { ...acc, [key]: coef };
  }, {});
  return idf;
};

const getTf = (indexDocs, tokensForDocs) => {
  const entries = Object.entries(indexDocs);
  const index = entries.reduce((acc1, [token, value]) => {
    const tf = value.reduce((acc2, docId) => {
      const { tokens } = tokensForDocs.find((item) => item.id === docId);
      const count = counter(tokens, token);
      const coef = _.round(count / tokens.length, 3);
      return { ...acc2, [docId]: coef };
    }, {});
    return { ...acc1, [token]: tf };
  }, {});
  return index;
};

const getIndex = (tf, idf) => {
  const entries = Object.entries(tf);
  const index = entries.reduce((acc1, [token, tfObj]) => {
    const tfEntries = Object.entries(tfObj);
    const tfIdf = tfEntries.reduce((acc2, [docId, tfValue]) => {
      const tfIdfValue = _.round(tfValue * idf[token], 3);
      return { ...acc2, [docId]: tfIdfValue };
    }, {});
    return { ...acc1, [token]: tfIdf };
  }, {});
  return index;
};

const getDocsRels = (indexForStr) => {
  const values = Object.values(indexForStr);
  const docsRels = values.reduce((acc, obj) => {
    const entries = Object.entries(obj);
    const newAcc = entries.reduce((acc2, [docId, coef]) => {
      const prev = acc2[docId] ?? 0;
      const current = _.round(prev + coef, 3);
      return { ...acc2, [docId]: current };
    }, acc);
    return newAcc;
  }, {});
  return docsRels;
};

const getSortedList = (docsRels) => {
  const entries = Object.entries(docsRels);
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
  const sortedList = sortedEntries.map(([docId]) => docId);
  return sortedList;
};

const buildSearchEngine = (docs) => {
  const tokensForDocs = getTokensForDocs(docs);
  const allTokensArray = getAllTokensArray(tokensForDocs);
  const indexDocs = getDocsForTokens(allTokensArray, tokensForDocs);
  const docsCount = docs.length;
  const idf = getIdf(indexDocs, docsCount);
  const tf = getTf(indexDocs, tokensForDocs);
  const index = getIndex(tf, idf);
  return {
    index,
    search(str) {
      const tokensForStr = getTokens(str);
      const indexForStr = _.pick(this.index, tokensForStr);
      const docsRels = getDocsRels(indexForStr);
      const result = getSortedList(docsRels);
      return result;
    },
  };
};

export default buildSearchEngine;
