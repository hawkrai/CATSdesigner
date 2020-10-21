import { getSubject } from './../../../../../modules/subjects/src/app/store/selectors/subject.selector';
import { Module, ModuleType } from './../models/module.model';
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
}