export class ComplexTree {
  constructor(list: any[]) {
    this.result = list;
  }
  result: TreeNode[];
}

export class TreeNode {

  constructor(id: number, description: string, parent: number | null, filepath: string | null) {
    this.id = id;
    this.description = description;
    this.parent = parent;
    this.filepath = filepath;
  }

  id: number;
  description: string;
  parent?: number;
  filepath?: string;
}
