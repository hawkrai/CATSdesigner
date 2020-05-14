using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Application.Core.Extensions;
using Application.Core.UI.Controllers;
using Application.Infrastructure.ConceptManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.ViewModels.ComplexMaterialsViewModel;
using Newtonsoft.Json;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    public class ComplexMaterialController : BasicController
    {
        public IConceptManagementService ConceptManagementService =>
            this.ApplicationService<IConceptManagementService>();

        public ISubjectManagementService SubjectsManagementService =>
            this.ApplicationService<ISubjectManagementService>();

        [HttpPost]
        public ActionResult SaveRootConcept(AddOrEditRootConceptViewModel model)
        {
            model.Save();
            return null;
        }

        [HttpPost]
        public ActionResult SaveConcept(AddOrEditConceptViewModel model)
        {
            if (!model.IsGroup && !string.IsNullOrEmpty(model.FileData))
            {
                var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(model.FileData).ToList();
                model.SetAttachments(attachmentsModel);
            }

            model.Save();
            return null;
        }

        public ActionResult AddRootConcept(string subjectId)
        {
            var conceptViewModel = new AddOrEditRootConceptViewModel(WebSecurity.CurrentUserId, 0);
            if (int.TryParse(subjectId, out var currentSubjectId))
                conceptViewModel.SelectedSubjectId = currentSubjectId;
            var dynamicObj = conceptViewModel.AsExpandoObject();
            dynamicObj.Subjects = conceptViewModel.GetSubjects(conceptViewModel.Author);
            return JsonResponse(dynamicObj);
        }

        public ActionResult EditRootConcept(int id)
        {
            var conceptViewModel = new AddOrEditRootConceptViewModel(WebSecurity.CurrentUserId, id);
            var dynamicObj = conceptViewModel.AsExpandoObject();
            dynamicObj.Subjects = conceptViewModel.GetSubjects(conceptViewModel.Author);
            return JsonResponse(dynamicObj);
        }

        public ActionResult AddConcept(int parentId)
        {
            var conceptViewModel = new AddOrEditConceptViewModel(WebSecurity.CurrentUserId, 0, parentId);
            var dynamicObj = conceptViewModel.AsExpandoObject();
            dynamicObj.Subjects = conceptViewModel.GetSubjects(conceptViewModel.Author);
            return JsonResponse(dynamicObj);
        }

        public ActionResult AddFolderConcept(int parentId)
        {
            var conceptViewModel =
                new AddOrEditConceptViewModel(WebSecurity.CurrentUserId, 0, parentId)
                {
                    IsGroup = true
                };
            var dynamicObj = conceptViewModel.AsExpandoObject();
            dynamicObj.Subjects = conceptViewModel.GetSubjects(conceptViewModel.Author);
            return JsonResponse(dynamicObj);
        }

        public ActionResult EditConcept(int id, int parentId)
        {
            var conceptViewModel = new AddOrEditConceptViewModel(WebSecurity.CurrentUserId, id, parentId);
            var dynamicObj = conceptViewModel.AsExpandoObject();
            dynamicObj.Subjects = conceptViewModel.GetSubjects(conceptViewModel.Author);
            return JsonResponse(dynamicObj);
        }

        public ActionResult OpenConcept(int id)
        {
            var conceptViewModel = new AddOrEditConceptViewModel(WebSecurity.CurrentUserId, id);
            var dynamicObj = conceptViewModel.AsExpandoObject();
            dynamicObj.RelativePathForActiveAttachment = conceptViewModel.GetRelativePathForActiveAttachment();
            return JsonResponse(dynamicObj);
        }

        public ActionResult OpenViewsConcept(int id)
        {
            var watchingTimeViewModel = new WatchingTimeViewModel(id);
            return JsonResponse(watchingTimeViewModel);
        }
    }
}