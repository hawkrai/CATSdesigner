import { Injectable } from '@angular/core';
import { ComplexGrid } from '../models/ComplexGrid';
import { ComplexTree, TreeNode } from '../models/ComplexTree';

@Injectable({
  providedIn: 'root'
})

export class ConverterService {
  constructor() {
  }
  private conceptConverter(concept: any) {
    const complexGrid = new ComplexGrid();
    complexGrid.id = concept.Id;
    complexGrid.name = concept.ShortName;
    complexGrid.fullname = concept.Name;

    return complexGrid;
  }

  public complexGridConverter(concepts: any[]) {
    return concepts.map(con => this.conceptConverter(con));
  }

  public mapConverter(concept: any) {
    var tree = new ComplexTree([]);
    tree.result.push(new TreeNode(concept.ConceptId, concept.ConceptName, null));
    this.childMapConverter(concept.Children, tree, concept.ConceptId);

    return tree;
  }

  private childMapConverter(childConcepts: any[], tree: ComplexTree, parentId: number) {
    if (!childConcepts || childConcepts.length === 0) {
      return;
    }
    for (let concept of childConcepts) {
      tree.result.push(new TreeNode(concept.ConceptId, concept.ConceptName, parentId));
      this.childMapConverter(concept.Children, tree, concept.ConceptId);
    }
  }
}
