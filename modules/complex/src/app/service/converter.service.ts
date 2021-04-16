import { Injectable } from '@angular/core';
import { ComplexGrid } from '../models/ComplexGrid';
import { ComplexTree, TreeNode } from '../models/ComplexTree';
import { Group} from '../models/Group';
import { ConceptMonitoring } from '../models/ConceptMonitoring';
import { Adaptivity } from '../models/Adaptivity';
import { ComplexCascade } from '../models/ComplexCascade';

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
    tree.result.push(new TreeNode(concept.Id, concept.Name, null, concept.FilePath));
    this.childMapConverter(concept.children, tree, concept.Id);

    return tree;
  }

  private childMapConverter(childConcepts: any[], tree: ComplexTree, parentId: number) {
    if (!childConcepts || childConcepts.length === 0) {
      return;
    }
    for (let concept of childConcepts) {
      tree.result.push(new TreeNode(concept.Id, concept.Name, parentId, concept.FilePath));
      this.childMapConverter(concept.children, tree, concept.Id);
    }
  }

  


  private monitoringConverter(monitoring: any) {
    var monitor = new ConceptMonitoring();
    monitor.name = monitoring.Name;
    monitor.seconds = this.getStrTime(monitoring.Seconds);

    return monitor;
  }

  public monitoringsConverter(monitorings: any) {
    return monitorings.map(mon => this.monitoringConverter(mon))
  }

  getStrTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} сек`;
    }
    var min = Math.floor(seconds / 60);
    var sec = seconds % 60;
    
    return `${min} мин ${sec} сек`
  }

  public filterNonGroupItems(conceptsCascade: ComplexCascade): ComplexCascade[] {
    conceptsCascade.children = conceptsCascade.children.filter(x => x.IsGroup);
    for (var concept of conceptsCascade.children) {
      this.filterNonGroupItems(concept);
    }

    return [conceptsCascade];
  }

  private groupConverter(groupRes: any) {
    var group = new Group();
    group.Id = groupRes.GroupId;
    group.Name = groupRes.GroupName;

    return group;
  }

  public groupsConverter(groups: any) {
    return groups.map(gr => this.groupConverter(gr))
  }

  public nextThemaResConverter(themaRes: any) {
    var nextThemaRes = new Adaptivity();
    nextThemaRes.nextThemaId = themaRes.NextThemaId;
    nextThemaRes.nextMaterialPaths = themaRes.NextMaterialPath;
    nextThemaRes.needToDoPredTest = themaRes.NeedToDoPredTest;
    nextThemaRes.shouldWaitPresettedTime = themaRes.ShouldWaitBeforeTest;
    nextThemaRes.timeToWait = themaRes.TimeToWait;
    nextThemaRes.isLearningEnded = themaRes.IsLearningEnded;

    return nextThemaRes;
  }
}
