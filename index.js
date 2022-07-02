import buildSearchEngine from './src/main.js';

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const docs = [doc1, doc2, doc3];

const searchEngine = buildSearchEngine(docs);
const result = searchEngine.search('shoot at me');

console.log(doc1);
console.log(doc2);
console.log(doc3);
console.log(`Результаты поиска строки 'shoot at me':`, result);