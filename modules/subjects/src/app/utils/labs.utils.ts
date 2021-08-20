import * as moment from 'moment';
import * as _ from 'lodash';

import { UserLabFile } from "../models/user-lab-file.model";

export const sendUserLabFileSuccess = (userLabFiles: UserLabFile[], userLabFile: UserLabFile): UserLabFile[] => {
    userLabFiles = userLabFiles ? userLabFiles : [];
    const index = userLabFiles.findIndex(x => x.Id === userLabFile.Id);

    if (index >= 0) {
        return sortFiles(userLabFiles.slice(0, index).concat(userLabFile, userLabFiles.slice(index + 1)));
    }
    return sortFiles([...userLabFiles, userLabFile]);
}

const sortFiles = (files: UserLabFile[]): UserLabFile[] => {
    const comparisonFn = (aStringDate: string, bStringDate: string) => {
        const aDate = aStringDate ? moment(aStringDate, 'DD.MM.yyyy HH:mm').toDate() : null;
        const bDate = aStringDate ? moment(bStringDate, 'DD.MM.yyyy HH:mm').toDate() : null;
        return aDate < bDate ? -1 : 1;
    }
    
    return Object.entries(_.groupBy(files, 'Order'))
    .sort(([aKey], [bKey]) => +aKey - +bKey)
    .map(([_, x]) => x.sort((a, b) => comparisonFn(a.Date, b.Date)))
    .reduce((acc, x) => acc.concat(x), []);
}