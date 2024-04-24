﻿using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core.Exceptions;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.DTO;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DiplomProjectController : ApiController
    {
        [SuppressMessage("StyleCop.CSharp.NamingRules", "SA1305:FieldNamesMustNotUseHungarianNotation", Justification = "Reviewed. Suppression is OK here.")]
        private readonly LazyDependency<IDpManagementService> _dpManagementService = new LazyDependency<IDpManagementService>();

        private IDpManagementService DpManagementService
        {
            get { return _dpManagementService.Value; }
        }

        public PagedList<DiplomProjectData> Get([ModelBinder]GetPagedListParams parms)
        {
            return DpManagementService.GetProjects(UserContext.CurrentUserId, parms);
        }

        public DiplomProjectData Get(int id)
        {
            return DpManagementService.GetProject(id);
        }

        public HttpResponseMessage Post([FromBody]DiplomProjectData project)
        {
            return SaveProject(project);
        }

        public HttpResponseMessage Put([FromBody]DiplomProjectData project)
        {
            return SaveProject(project);
        }

        public void Post(int id)
        {
            DpManagementService.DeleteProject(UserContext.CurrentUserId, id);
        }

        private HttpResponseMessage SaveProject(DiplomProjectData project)
        {
            HttpResponseMessage httpResponseMessage = new HttpResponseMessage(HttpStatusCode.BadRequest);
            try
            {
                DpManagementService.SaveProject(project);
            }
            catch (DuplicateDPThemeInGroup ex)
            {
                httpResponseMessage.Content = new StringContent(ex.Message);
                return httpResponseMessage;
            }
            catch (DuplicateDPThemeInLecturer) {
                return httpResponseMessage;
            } catch (ApplicationServiceException)
            {
                return httpResponseMessage;
            }
            project.LecturerId = UserContext.CurrentUserId;
            httpResponseMessage.StatusCode = HttpStatusCode.OK;
            return httpResponseMessage;
        }
    }
}
