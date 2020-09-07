export class DocumentTree {
  constructor(public id: Number, public name: string, public children?: DocumentTree[]) {
  }

  hasChild(): boolean {
    return this.children.length > 0;
  }
}
export interface IDocumentTree {
  id: Number;
  name: string;
  children?: IDocumentTree[];
}
