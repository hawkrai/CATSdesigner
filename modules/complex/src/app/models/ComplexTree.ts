export class ComplexTree {
  constructor(list: any[]) {
    this.result = list;
  }
  result: TreeNode[];
}

export class TreeNode {

  constructor(id: number, description: string, parent: number | null) {
    this.id = id;
    this.description = description;
    this.parent = parent;
  }

  id: number;
  description: string;
  parent?: number;
}
