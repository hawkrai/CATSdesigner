import { Pipe, PipeTransform } from "@angular/core";
import { Group } from "../models/group.model";

@Pipe({
    name: 'groupSort'
})
export class GroupSortPipe implements PipeTransform {
    transform(groups: Group[]): Group[] {
        const groupsWithUncofirmedStudents = groups.filter(x => !!x.CountUnconfirmedStudents);
        const groupsWithConfirmedStudents = groups.filter(x => !x.CountUnconfirmedStudents);
        if (groupsWithUncofirmedStudents.length) {
            groupsWithUncofirmedStudents[groupsWithUncofirmedStudents.length - 1].lastGroupWithUnconfirmedStudents = true
        }
        return groupsWithUncofirmedStudents.sort((a, b) => a.GroupName.localeCompare(b.GroupName))
        .concat(groupsWithConfirmedStudents.sort((a, b) => a.GroupName.localeCompare(b.GroupName)));
    }

}