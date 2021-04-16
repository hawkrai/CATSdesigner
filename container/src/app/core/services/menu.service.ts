import { ModuleType } from './../models/module.model';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

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
    private sideNav: MatSidenav;

    public setSideNav(sideNav: MatSidenav): void {
        this.sideNav = sideNav;
    }

    private subjectsInfo = new Map([
        [ModuleType.News, { fragment: 'news', module: 'subject', item: 'news', icon: '../../../assets/icons/newspaper.png' }],
        [ModuleType.Lectures, { fragment: 'lectures', module: 'subject', item: 'lectures', icon: '../../../assets/icons/presentation.png' }],
        [ModuleType.Practical, { fragment: 'practical', module: 'subject', item: 'practical', icon: '../../../assets/icons/contract.png',  }],
        [ModuleType.Labs, { fragment: 'labs', module: 'subject', item: 'labs', icon: '../../../assets/icons/chemistry-lab-instrument.png' }],
        [ModuleType.SmartTest, { fragment: 'page', module: 'testsModule', item: 'testsModule', icon: '../../../assets/icons/test.png' }],
        [ModuleType.YeManagment, { fragment: '', module: 'course', item: 'course', icon: '../../../assets/icons/graduation-hat.png' }],
        [ModuleType.ComplexMaterial, { fragment: '', module: 'complex', item: 'complex', icon: '../../../assets/icons/information.png' }],
        [ModuleType.Dsm, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.LabAttachments, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.Projects, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.Results, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.ScheduleProtection, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.StatisticsVisits, { fragment: '', module: '', item: '', icon: '' }],
        [ModuleType.SubjectAttachments, { fragment: 'files', module: 'subject', item: 'files', icon: '../../../assets/icons/folder.png' }],
        [ModuleType.InteractiveTutorial, { fragment: '', module: 'libBook', item: 'libBook', icon: '../../../assets/icons/notebook.png' }]
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

    public toogleSidenav(): void {
        if (this.sideNav) {
            this.sideNav?.toggle();
        }
    }

}