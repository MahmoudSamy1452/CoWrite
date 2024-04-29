class CRDT{

	constructor(siteID, siteCounter, index, bold, italic, char){
    this.siteID = siteID
    this.siteCounter = siteCounter
    this.tombstone = false
    this.index = index
    this.bold = bold
    this.italic = italic
    this.char = char
  }

  // [{"retain":5},{"insert":"a"}]
  static changeToCRDT(siteID, siteCounter, doc, change) {
    // change = JSON.parse(change)
    const EditorIndex = change[0].retain;
    const attributes = change[1].attributes;
    delete change[1].attributes;
    const op = Object.keys(change[1])
    const char = change[1][op]
    const FractionalIndex = doc.getFractionalIndex(EditorIndex)
    switch(op) {
      case 'insert':
        return new CRDT(siteID, siteCounter, FractionalIndex, attributes.bold, attributes.italic, char)
      case 'delete':
        return new CRDT(siteID, siteCounter, FractionalIndex, attributes.bold, attributes.italic, char)
      case 'retain':
        return new CRDT(siteID, siteCounter, FractionalIndex, attributes.bold, attributes.italic, char)
    }
  }

  static CRDTToChange(CRDT){
    if(CRDT.tombstone){
      return [{"retain":CRDT.index},{"delete":CRDT.char,"attributes":{"bold":CRDT.bold,"italic":CRDT.italic}}]
    }
    return [{"retain":CRDT.index},{"insert":CRDT.char,"attributes":{"bold":CRDT.bold,"italic":CRDT.italic}}]
  }



}

export default CRDT;