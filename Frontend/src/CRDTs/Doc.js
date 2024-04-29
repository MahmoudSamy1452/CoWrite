import CRDT from './CRDT.js';

class Doc {

  constructor(storedDoc) {
    try {
      storedDoc = JSON.parse(storedDoc)
      storedDoc = JSON.parse(storedDoc)
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
    let editorIndex = 0, docIndex = 0;
    for(docIndex = 0; docIndex < this.doc.length && editorIndex < index; docIndex++) {
      editorIndex += this.doc[docIndex].tombstone ? 0 : 1;
    }
    const prevFractionalIndex = this.doc[docIndex-1].index;
    const nextFractionalIndex = this.doc[docIndex].index;
    const fractionalIndex = prevFractionalIndex + (nextFractionalIndex - prevFractionalIndex) / 2;
    return fractionalIndex;
    
  }

  getContent() {
    let content = [];
    for(let i = 0; i < this.doc.length; i++) {
      console.log(this.doc[i].tombstone)
      if(this.doc[i].tombstone) continue;
      content.push({"insert": this.doc[i].char, "attributes": {"bold": this.doc[i].bold, "italic": this.doc[i].italic}});
    }
    console.log(content)
    return content;
  }
}

export default Doc;