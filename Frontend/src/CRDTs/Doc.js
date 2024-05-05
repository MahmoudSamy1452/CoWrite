import CRDT from './CRDT.js';

class Doc {

  constructor(storedDoc) {
    try {
      storedDoc = JSON.parse(storedDoc)
      // storedDoc = JSON.parse(storedDoc) //to be removed
    }
    catch(e) {
      console.log(e)
      storedDoc = []
    }
    if(storedDoc.length === 0) {
      this.doc = [new CRDT(0, 0, true, 0, false, false, 'bof'), new CRDT(0, 0, true, 10000, false, false, 'eof')]
      return
    }
    this.doc = storedDoc;
  }

  convertEditorIndexToFractionalIndex(index) {
    console.log("index", index)
    let editorIndex = 0, docIndex = 1;
    // for(; docIndex < this.doc.length && editorIndex <= index; docIndex++) {
    //   editorIndex += this.doc[docIndex].tombstone ? 0 : 1;
    // }
    while (docIndex < this.doc.length && editorIndex <= index) {
      editorIndex += this.doc[docIndex].tombstone ? 0 : 1;
      docIndex++;
    }
    return docIndex - 1;
  }

  getFractionalIndex(index) {
    const docIndex = this.convertEditorIndexToFractionalIndex(index);
    console.log(docIndex)
    const prevFractionalIndex = this.doc[docIndex-1].index;
    const nextFractionalIndex = this.doc[docIndex].index;
    const fractionalIndex = prevFractionalIndex + (nextFractionalIndex - prevFractionalIndex) / 2;
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

  handleLocalInsert(change, siteID, siteCounter) {
    const EditorIndex = change.find((op) => op.retain !== undefined)?.retain || 0;
    const attributes = change.find((op) => op.attributes !== undefined)?.attributes || {bold: false, italic: false};
    const char = change.find((op) => op.insert !== undefined).insert || change.find((op) => op.delete !== undefined).delete;
    const FractionalIndex = this.getFractionalIndex(EditorIndex)
    const newCRDT = new CRDT(siteID, siteCounter, false, FractionalIndex, attributes.bold, attributes.italic, char)
    this.doc.push(newCRDT);
    this.doc.sort((a, b) => a.index - b.index);
    return newCRDT;
  }

  handleLocalDelete(change) {
    const EditorIndex = change.find((op) => op.retain !== undefined && op.delete === undefined)?.retain || 0;
    const docIndex = this.convertEditorIndexToFractionalIndex(EditorIndex);
    this.doc[docIndex].tombstone = true;
    return this.doc[docIndex];
  }

  handleLocalAttribute(change) {
    const EditorIndex = change.find((op) => op.retain !== undefined && op.attributes === undefined)?.retain || 0;
    const docIndex = this.convertEditorIndexToFractionalIndex(EditorIndex);
    const attribute = change.find((op) => op.attributes !== undefined)
    this.doc[docIndex].bold = attribute.attributes.bold === undefined ? this.doc[docIndex].bold : attribute.attributes.bold ? true : false;
    this.doc[docIndex].italic = attribute.attributes.italic === undefined ? this.doc[docIndex].italic : attribute.attributes.italic ? true : false;
    console.log("handle zeft", this.doc[docIndex])
    return this.doc[docIndex];
  }

  handleRemoteInsert(newCRDT) {
    this.doc.push(newCRDT);
    this.doc.sort((a, b) => a.index - b.index);
  }

  handleRemoteDelete(newCRDT) {
    console.log(newCRDT)
    const docIndex = this.doc.findIndex((char) => char.siteID === newCRDT.siteID && char.siteCounter === newCRDT.siteCounter);
    console.log(this.doc[docIndex])
    this.doc[docIndex].tombstone = true;
  }

  handleRemoteAttribute(newCRDT) {
    const docIndex = this.doc.findIndex((char) => char.siteID === newCRDT.siteID && char.siteCounter === newCRDT.siteCounter);
    this.doc[docIndex].bold = newCRDT.bold;
    this.doc[docIndex].italic = newCRDT.italic;
  }

  pretty() {
    for (let char of this.doc) {
        console.log(char.index, char.char, char.siteID, char.tombstone, char.siteCounter);
    }
  }

  extractLastSiteCounter(siteID) {
    let lastSiteCounter = 0;
    for (let char of this.doc) {
      if (char.siteID === siteID) {
        lastSiteCounter = Math.max(lastSiteCounter, char.siteCounter);
      }
    }
    return lastSiteCounter;
  }
}

export default Doc;