using System;
using System.Linq;
using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules.News;

namespace LMPlatform.UI.Services.News
{
    using Application.Core.Helpers;
    using Models;
    using Modules;
    using Newtonsoft.Json;
    using System.Collections.Generic;

    [JwtAuth]
    public class NewsService : INewsService
    {
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;

        public NewsResult GetNews(string subjectId)
        {
            try
            {
	            var id = int.Parse(subjectId);
                var query = new Query<Subject>(e => e.Id == id)
                    .Include(e => e.SubjectNewses);
                var model = SubjectManagementService.GetSubject(query).SubjectNewses
	                .OrderByDescending(e => e.EditDate)
	                .Select(e => new NewsViewData(e))
	                .ToList();

                return new NewsResult
				{
					News = model,
					Message = "Новости успешно загружены",
					Code = "200"
				};
            }
            catch(Exception ex)
            {
                return new NewsResult
				{
					Message = "Произошла ошибка при получении новостей",
					Code = "500"
				};
            }
        }

	    public ResultViewData DisableNews(int subjectId)
	    {
			try
			{
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                SubjectManagementService.DisableNews(subjectId, true);

				return new ResultViewData
				{
					Message = "Новости успешно скрыты",
					Code = "200"
				};
			}
			catch
			{
				return new ResultViewData
				{
					Message = "Произошла ошибка при скрытии новостей",
					Code = "500"
				};
			}
	    }

	    public ResultViewData EnableNews(int subjectId)
	    {
			try
			{
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                SubjectManagementService.DisableNews(subjectId, false);

				return new ResultViewData
				{
					Message = "Все новости активны",
					Code = "200"
				};
			}
			catch
			{
				return new ResultViewData
				{
					Message = "Произошла ошибка при работе с новостями",
					Code = "500"
				};
			}
	    }

        public ResultViewData Save(int subjectId, int id, string title, string body, bool disabled, bool isOldDate, string pathFile, string attachments)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                var date = DateTime.Now;
                var news = SubjectManagementService.GetNews(id, subjectId);

                if (id != 0 && isOldDate || id != 0 && disabled)
                {
                    date = news.EditDate;
                }
                else if (id != 0 && !disabled)
                {
                    if (news.Disabled)
                    {
                        date = DateTime.Now;
                    }
                }
                var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(attachments).ToList();
                SubjectManagementService.SaveNews(new SubjectNews
                {
                    SubjectId = subjectId,
                    Body = body,
                    EditDate = date,
                    Title = title,
                    Disabled = disabled,
                    Attachments = pathFile,
                    Id = id
                }, attachmentsModel);
                return new ResultViewData
                {
                    Message = "Новость успешно сохранена",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при сохранении новости",
                    Code = "500"
                };
            }
        }

        public ResultViewData Delete(int id, int subjectId)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                SubjectManagementService.DeleteNews(id, subjectId);
                return new ResultViewData
                {
                    Message = "Новость успешно удалена",
                    Code = "200"
                };
            }
            catch(Exception e)
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при удалении новости" + e.Message,
                    Code = "500"
                };
            }
        }
    }
}
