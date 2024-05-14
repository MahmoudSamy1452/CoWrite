const { CRDT } = require('./CRDT.js');

class Doc {

  constructor(storedDoc) {
    try {
      storedDoc = JSON.parse(storedDoc)
    }
    catch(e) {
      console.log(e)
      storedDoc = []
    }
    if(storedDoc.length === 0) {
      this.doc = [new CRDT(0, 0, true, 0, false, false, 'bof'), new CRDT(0, 0, true, Number.MAX_SAFE_INTEGER, false, false, 'eof')]
      return
    }
    this.doc = storedDoc;
  }

  convertEditorIndexToFractionalIndex(index) {
    let editorIndex = 0, docIndex = 1;
    for(; docIndex < this.doc.length && editorIndex < index; docIndex++) {
      editorIndex += this.doc[docIndex].tombstone ? 0 : 1;
    }
    return docIndex;
  }

  
  convertDocIndexToEditorIndex(index) {
    console.log("index", index)
    let editorIndex = 0;
    for(let docIndex = 1; docIndex < index && docIndex < this.doc.length; docIndex++) {
      editorIndex += this.doc[docIndex].tombstone ? 0 : 1;
    }
    console.log("editorIndex", editorIndex)
    return editorIndex;
  }

  getFractionalIndex(index) {
    const docIndex = this.convertEditorIndexToFractionalIndex(index);
    const prevDocIndex = this.convertEditorIndexToFractionalIndex(index-1);
    console.log(docIndex)
    this.debug();
    const prevFractionalIndex = this.doc[prevDocIndex].index;
    const nextFractionalIndex = this.doc[docIndex].index;
    let fractionalIndex;
    const diff = nextFractionalIndex - prevFractionalIndex;
    console.log("nextFractionalIndex - prevFractionalIndex = ", diff);
    if (diff <= 10) {
      fractionalIndex = prevFractionalIndex + diff/100;
    } else if (diff <= 1000) {
      fractionalIndex = Math.round(prevFractionalIndex + diff/10);
    } else if (diff <= 5000) {
      fractionalIndex = Math.round(prevFractionalIndex + diff/100);
    } else {
      fractionalIndex = Math.round(prevFractionalIndex + diff/1000);
    }
    return fractionalIndex;
  }

  getContent() {
    let content = [];
    for(let i = 1; i < this.doc.length - 1; i++) {
      if(this.doc[i].tombstone) continue;
      content.push({"insert": this.doc[i].char, "attributes": {"bold": this.doc[i].bold, "italic": this.doc[i].italic}});
    }
    return content;
  }

  compare(a, b) {
    if(a.index != b.index) {
      return a.index - b.index;
    } else {
      return a.siteID > b.siteID ? 1 : -1;
    }
  }

  handleLocalInsert(change, siteID, siteCounter) {
    const EditorIndex = change.find((op) => op.retain !== undefined)?.retain || 0;
    const attributes = change.find((op) => op.attributes !== undefined)?.attributes || {bold: false, italic: false};
    const char = change.find((op) => op.insert !== undefined).insert || change.find((op) => op.delete !== undefined).delete;
    const FractionalIndex = this.getFractionalIndex(EditorIndex)
    const newCRDT = new CRDT(siteID, siteCounter, false, FractionalIndex, attributes.bold, attributes.italic, char)
    this.doc.push(newCRDT);
    this.doc.sort(this.compare);
    return newCRDT;
  }

  handleLocalDelete(change) {
    const EditorIndex = change.find((op) => op.retain !== undefined)?.retain || 0;
    const docIndex = this.convertEditorIndexToFractionalIndex(EditorIndex);
    this.doc[docIndex].tombstone = true;
    return this.doc[docIndex];
  }

  handleCollision(fractionalIndex) {
    const count = this.doc.filter((char) => char.index === fractionalIndex && char.tombstone === false).length;
    if (count === 1)  return;
    const docIndex = this.doc.findIndex((char) => char.index === fractionalIndex && char.tombstone === false);
    const modifiedCRDT = this.doc[docIndex];
    this.doc.splice(docIndex, 1);
    modifiedCRDT.index = this.getFractionalIndex(this.convertDocIndexToEditorIndex(docIndex));
    console.log(modifiedCRDT.index)
    this.doc.push(modifiedCRDT);
    this.doc.sort(this.compare);
  }

  handleRemoteInsert(newCRDT) {
    this.doc.push(newCRDT);
    this.doc.sort(this.compare);
    this.handleCollision(newCRDT.index);
  }

  handleRemoteDelete(newCRDT) {
    const docIndex = this.doc.findIndex((char) => char.siteID === newCRDT.siteID && char.siteCounter === newCRDT.siteCounter);
    this.doc[docIndex].tombstone = true;
  }

  handleRemoteAttribute(newCRDT) {
    const docIndex = this.doc.findIndex((char) => char.siteID === newCRDT.siteID && char.siteCounter === newCRDT.siteCounter);
    this.doc[docIndex].bold = newCRDT.bold;
    this.doc[docIndex].italic = newCRDT.italic;
  }

  debug() {
    for (let char of this.doc) {
        console.log(char.index, char.char, char.siteID, char.tombstone, char.siteCounter);
    }
  }
}

module.exports = { Doc }