import { ModuleType } from './../models/module.model';
import { Injectable } from "@angular/core";

export interface MenuConfig {
    fragment: string;
    module: string;
    item: string;
    icon: string;
}

@Injectable({
    providedIn: 'root'
})

export class MenuService {
    private subjectsInfo = new Map([
        [ModuleType.News, { fragment: 'news', module: 'subject', item: 'news', icon: 'subject' }],
        [ModuleType.Lectures, { fragment: 'lectures', module: 'subject', item: 'lectures', icon: 'subject' }],
        [ModuleType.Practical, { fragment: 'practical', module: 'subject', item: 'practical', icon: 'subject' }],
        [ModuleType.Labs, { fragment: 'labs', module: 'subject', item: 'labs', icon: 'subject' }],
        [ModuleType.SmartTest, { fragment: 'page', module: 'testsModule', item: 'testsModule', icon: 'assessment' }],
        [ModuleType.YeManagment, { fragment: '', module: 'course', item: 'course', icon: 'school' }],
        [ModuleType.ComplexMaterial, { fragment: '', module: 'subject', item: 'complex', icon: 'topic' }],
        [ModuleType.Dsm, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.LabAttachments, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.Projects, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.Results, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.ScheduleProtection, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.StatisticsVisits, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.SubjectAttachments, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.InteractiveTutorial, { fragment: '', module: 'libBook', item: 'libBook', icon: 'library_book' }]
    ]);

    getSubjectInfo(type: ModuleType): MenuConfig {
        return this.subjectsInfo.get(type);
    }

    getAvailableFragments(): string[] {
        return Array.from(this.subjectsInfo.values()).map(i => i.fragment);
    }

    getAvailableItems(): string[] {
        return Array.from(this.subjectsInfo.values()).map(i => i.item);
    }

    getModuleTypeByItem(item: string): ModuleType {
        return Array.from(this.subjectsInfo.keys()).find(k => this.subjectsInfo.get(k).item === item);
    }

    getFirstModuleType(): ModuleType {
        return Array.from(this.subjectsInfo.keys())[0];
    }

    getModuleFromItem(item: string): string {
        return Array.from(this.subjectsInfo.values()).find(c => c.item === item).module;
    }
}