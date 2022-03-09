import { Pipe, PipeTransform } from "@angular/core";
import { Group } from "../models/group.model";

@Pipe({
    name: 'groupSort'
})
export class GroupSortPipe implements PipeTransform {
    transform(groups: Group[]): Group[] {
        const sortedGroups = groups.sort((a, b) => b.CountUnconfirmedStudents - a.CountUnconfirmedStudents || a.GroupName.localeCompare(b.GroupName));

        const groupsWithUncofirmedStudents = sortedGroups.filter(x => !!x.CountUnconfirmedStudents);
        if (groupsWithUncofirmedStudents.length) {
            groupsWithUncofirmedStudents[groupsWithUncofirmedStudents.length - 1].lastGroupWithUnconfirmedStudents = true
        }
        return sortedGroups;
    }

}