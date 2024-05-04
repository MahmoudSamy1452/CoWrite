import CRDT from './CRDT.js';

class Doc {

  constructor(storedDoc) {
    try {
      storedDoc = JSON.parse(storedDoc)
      storedDoc = JSON.parse(storedDoc) //to be removed
    }
    catch(e) {
      console.log(e)
      storedDoc = []
    }
    if(storedDoc.length === 0) {
      this.doc = [new CRDT(0, 0, 0, false, false, 'bof'), new CRDT(0, 0, 10000, false, false, 'eof')]
      return
    }
    this.doc = storedDoc;
  }

  getFractionalIndex(index) {
    let editorIndex = 0, docIndex = 1;
    for(; docIndex < this.doc.length && editorIndex < index; docIndex++) {
      editorIndex += this.doc[docIndex].tombstone ? 0 : 1;
    }
    console.log(docIndex)
    const prevFractionalIndex = this.doc[docIndex-1].index;
    const nextFractionalIndex = this.doc[docIndex].index;
    const fractionalIndex = prevFractionalIndex + (nextFractionalIndex - prevFractionalIndex) / 2;
    return fractionalIndex;
  }

  getContent() {
    let content = [];
    for(let i = 1; i < this.doc.length - 1; i++) {
      console.log(this.doc[i].tombstone)
      if(this.doc[i].tombstone) continue;
      content.push({"insert": this.doc[i].char, "attributes": {"bold": this.doc[i].bold, "italic": this.doc[i].italic}});
    }
    console.log(content)
    return content;
  }

  handleLocalInsert(change, siteID, siteCounter) {
    const EditorIndex = change.find((op) => op.retain !== undefined)?.retain || 0;
    const attributes = change.find((op) => op.attributes !== undefined)?.attributes || {bold: false, italic: false};
    const char = change.find((op) => op.insert !== undefined).insert || change.find((op) => op.delete !== undefined).delete;
    const FractionalIndex = this.getFractionalIndex(EditorIndex)
    const newCRDT = new CRDT(siteID, siteCounter, FractionalIndex, attributes.bold, attributes.italic, char)
    this.doc.push(newCRDT);
    this.doc.sort((a, b) => a.index - b.index);
  }

  pretty() {
    for (let char of this.doc) {
        console.log(char.index, char.char, char.siteID, char.tombstone);
    }
  }
}

export default Doc;