import {Component, OnInit} from '@angular/core';
import {ProjectsService} from 'src/app/services/projects.service';
import {ActivatedRoute} from '@angular/router';
import {Project} from 'src/app/models/project.model';
import {Subscription} from 'rxjs';
import {CourseUserService} from '../../services/course-user.service';
import {CourseUser} from '../../models/course-user.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {

  private COUNT = 1000000;
  private PAGE = 1;

  private projects: Project[];
  private projectsSubscription: Subscription;

  private courseUser: CourseUser;
  private subjectId: string;
  private searchString = '';
  private sorting = 'Id';
  private direction = 'desc';

  constructor(private projectsService: ProjectsService,
              private courseUserService: CourseUserService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;
    this.courseUserService.getUser().subscribe(res => {
      this.courseUser = res;
      this.retrieveProjects();
    });
  }

  retrieveProjects() {
    this.projectsSubscription = this.projectsService.getProjects(
      'count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter={"subjectId":"' + this.subjectId + '","searchString":"' + this.searchString + '"}' +
      '&filter[subjectId]=' + this.subjectId +
      '&sorting[' + this.sorting + ']=' + this.direction
    )
      .subscribe(res => this.projects = res.Items);
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText;
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    this.retrieveProjects();
  }

  sort(field: string, direction: string) {
    if (!direction) {
      this.sorting = 'Id';
      this.direction = 'desc';
    } else {
      this.sorting = field;
      this.direction = direction;
    }
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    this.retrieveProjects();
  }

}
