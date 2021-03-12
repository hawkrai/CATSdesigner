export class DocumentTree {
  constructor(public Id: Number, public Name: string, public IsLocked: Boolean, public Children?: DocumentTree[]) {
  }

  hasChild(): boolean {
    return this.Children.length > 0;
  }
}
export interface IDocumentTree {
  Id: Number;
  Name: string;
  IsLocked: Boolean;
  Children?: IDocumentTree[];
}
