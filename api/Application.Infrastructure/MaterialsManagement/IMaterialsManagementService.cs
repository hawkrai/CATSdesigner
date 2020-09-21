﻿using System.Collections.Generic;
using Application.Core.Data;
using LMPlatform.Models;

namespace Application.Infrastructure.MaterialsManagement
{
    using System.Net;

    public interface IMaterialsManagementService
    {
        List<Folders> GetFolders(int pid, int subjectId);

        int GetPidById(int pid);

        Folders CreateFolder(int pid, int subjectid);

        void CreateRootFolder(int id_subject_module, string name);

        void DeleteFolder(int id);

        void RenameFolder(int id, string name);

        void RenameDocument(int id, string name);

        void SaveTextMaterials(int id_document, int id_folder, string name, string text, int subjectid);

        List<Materials> GetDocumentsByIdFolders(int id, int subjectId);

        Materials GetTextById(int id);

        void DeleteDocument(int ID);
    }
}
