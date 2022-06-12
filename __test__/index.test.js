/* eslint-disable no-undef */
import buildSearchEngine from '../index.js';

test('terms', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const docs = [doc1];
  const searchEngine = buildSearchEngine(docs);
  expect(searchEngine.search('pint')).toEqual(['doc1']);
  expect(searchEngine.search('pint!')).toEqual(['doc1']);
});

test('relevance', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];

  const searchEngine = buildSearchEngine(docs);
  expect(searchEngine.search('shoot')).toEqual(['doc2', 'doc1']);
});

/*test('fuzzy search', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];

  const searchEngine = buildSearchEngine(docs);
  expect(searchEngine.search('shoot at me')).toEqual(['doc2', 'doc1']);
});*/
