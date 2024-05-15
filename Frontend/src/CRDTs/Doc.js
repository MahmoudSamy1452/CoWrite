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
      this.doc = [new CRDT(0, 0, true, 0, false, false, 'bof'), new CRDT(0, 0, true, Number.MAX_VALUE, false, false, 'eof')]
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
    let EditorIndex = change.find((op) => op.retain !== undefined)?.retain || 0;
    const inserts = change.filter((op) => op.insert !== undefined);
    let CRDTs = [];
    change.find((op) => op.delete !== undefined) && CRDTs.push(...this.handleLocalDelete(change));
    for(let insert of inserts) {
      const attributes = insert?.attributes || {bold: false, italic: false};
      const word = insert?.insert || insert?.delete;
      console.log("word", word)
      for(let char of word) {
        const FractionalIndex = this.getFractionalIndex(EditorIndex++)
        const newCRDT = new CRDT(siteID, siteCounter++, false, FractionalIndex, attributes.bold, attributes.italic, char)
        CRDTs.push(newCRDT);
        this.doc.push(newCRDT);
        this.doc.sort(this.compare);
      }
    }
    return CRDTs;
  }

  handleLocalDelete(change) {
    const EditorIndex = change.find((op) => op.retain !== undefined && op.delete === undefined)?.retain || 0;
    let deleteCount = change.find((op) => op.delete !== undefined).delete;
    let CRDTs = [];
    while(deleteCount--) {
      const docIndex = this.convertEditorIndexToFractionalIndex(EditorIndex);
      this.doc[docIndex].tombstone = true;
      CRDTs.push(this.doc[docIndex]);
    }
    return CRDTs;
  }

  handleLocalAttribute(change) {
    let EditorIndex = 0;
    let CRDTs = [];
    for(let op of change) {
      EditorIndex += op.attributes === undefined ? op?.retain || 0 : 0;
      const attribute = op.attributes !== undefined ? op : undefined;
      if(!attribute) continue;
      let attributeCount = attribute.retain || 1;
      while(attributeCount--){
        const docIndex = this.convertEditorIndexToFractionalIndex(EditorIndex++);
        this.doc[docIndex].bold = attribute.attributes.bold === undefined ? this.doc[docIndex].bold : attribute.attributes.bold ? true : false;
        this.doc[docIndex].italic = attribute.attributes.italic === undefined ? this.doc[docIndex].italic : attribute.attributes.italic ? true : false;
        CRDTs.push(this.doc[docIndex]);
      }
    }
    console.log('attr ', CRDTs)
    return CRDTs;
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
    const docIndex = this.doc.findIndex((char) => char.siteID === newCRDT.siteID && char.siteCounter === newCRDT.siteCounter);
    const editorIndex = this.convertDocIndexToEditorIndex(docIndex);
    let delta = editorIndex ? [{ retain: editorIndex }] : [];
    delta.push({
      insert: newCRDT.char,
      attributes: {
        bold: newCRDT.bold,
        italic: newCRDT.italic,
      }
    })
    return delta;
  }

  handleRemoteDelete(newCRDT) {
    console.log(newCRDT)
    const docIndex = this.doc.findIndex((char) => char.siteID === newCRDT.siteID && char.siteCounter === newCRDT.siteCounter);
    console.log(this.doc[docIndex])
    this.doc[docIndex].tombstone = true;
    const editorIndex = this.convertDocIndexToEditorIndex(docIndex);
    let delta = editorIndex ? [{ retain: editorIndex }] : [];
    delta.push({
      delete: 1,
    })
    return delta;
  }

  handleRemoteAttribute(newCRDT) {
    const docIndex = this.doc.findIndex((char) => char.siteID === newCRDT.siteID && char.siteCounter === newCRDT.siteCounter);
    this.doc[docIndex].bold = newCRDT.bold;
    this.doc[docIndex].italic = newCRDT.italic;
    const editorIndex = this.convertDocIndexToEditorIndex(docIndex);
    let delta = editorIndex ? [{retain: editorIndex}] : [];
    delta.push(
    {
      retain: 1,
      attributes: {
        bold: newCRDT.bold,
        italic: newCRDT.italic,
      }
    })
    return delta;
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

  extractExpectedSiteCounters() {
    let lastSiteCounters = {};
    for (let char of this.doc) {
      if (char.siteID in lastSiteCounters) {
        lastSiteCounters[char.siteID] = Math.max(lastSiteCounters[char.siteID], char.siteCounter+1);
      } else {
        lastSiteCounters[char.siteID] = char.siteCounter+1;
      }
    }
    return lastSiteCounters;
  }
}

export default Doc;