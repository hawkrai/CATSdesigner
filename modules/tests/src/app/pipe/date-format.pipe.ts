import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "moment";
import {Moment} from "moment";

@Pipe({name: "dateFormat"})
export class DateFormatPipe implements PipeTransform {

    public transform(value: string | Date | Moment | number, format: string): string {
        return value ? moment(value).format(format) : "";
    }
}
