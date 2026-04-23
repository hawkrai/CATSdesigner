export class ComplexTree {
  constructor(list: any[]) {
    this.result = list
  }
  result: TreeNode[]
}

export class TreeNode {
  constructor(
    id: number,
    description: string,
    parent: number | null,
    filepath: string | null,
    testId?: number | null
  ) {
    this.id = id
    this.description = description
    this.parent = parent
    this.filepath = filepath
    this.testId = testId || null
  }

  id: number
  description: string
  parent?: number
  filepath?: string
  testId?: number | null
}
