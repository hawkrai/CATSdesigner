import { ComponentFixture, TestBed, async, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import { SubjectNewsComponent } from './subject-news.component';
import * as newsSelectors from '../../store/selectors/news.selectors';

newsSelectors.getNews.setResult([
    {
        id: 1,
        title: 'Test1',
        body: '<p>Test1 body</p>',
        subjectId: '1',
        attachments: [],
        dateCreate: new Date().toString(),
        disabled: false,
        pathFile: 'tst'
    },
    {
        id: 2,
        title: 'Test2',
        body: '<p>Test2 body</p>',
        subjectId: '2',
        attachments: [],
        dateCreate: new Date().toString(),
        disabled: false,
        pathFile: 'tst'
    }
]);



describe('SubjectNewsComponent', () => {
    let component: SubjectNewsComponent;
    let fixture: ComponentFixture<SubjectNewsComponent>;
    const initState = { new: { }}

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SubjectNewsComponent],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubjectNewsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {

    });

    it('should create', () => {
        expect(component).toBeDefined();
    });
});
