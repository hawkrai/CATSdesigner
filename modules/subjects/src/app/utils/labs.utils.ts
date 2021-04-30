import { UserLabFile } from "../models/user-lab-file.model";

export const sendUserLabFileSuccess = (userLabFiles: UserLabFile[], userLabFile: UserLabFile): UserLabFile[] => {
    userLabFiles = userLabFiles ? userLabFiles : [];
    const index = userLabFiles.findIndex(x => x.Id === userLabFile.Id);

    if (index >= 0) {
        return userLabFiles.slice(0, index).concat(userLabFile, userLabFiles.slice(index + 1));
    }
    return [...userLabFiles, userLabFile];
}