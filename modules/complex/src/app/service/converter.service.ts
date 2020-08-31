import { Injectable } from '@angular/core';
import { ComplexGrid } from '../models/ComplexGrid';

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
}
