import { Pipe, PipeTransform } from "@angular/core";
import { Group } from "../models/group.model";

@Pipe({
    name: 'groupSort'
})
export class GroupSortPipe implements PipeTransform {
    transform(groups: Group[]): Group[] {
        return groups.sort((a, b) => b.CountUnconfirmedStudents - a.CountUnconfirmedStudents || a.GroupName.localeCompare(b.GroupName));
    }

}