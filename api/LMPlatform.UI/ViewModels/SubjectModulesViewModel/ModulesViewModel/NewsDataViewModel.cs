﻿using System;
using System.ComponentModel.DataAnnotations;
using Application.Core;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;

namespace LMPlatform.UI.ViewModels.SubjectModulesViewModel.ModulesViewModel
{
    public class NewsDataViewModel
    {
        public NewsDataViewModel()
        {
        }

        public NewsDataViewModel(SubjectNews news)
        {
            Body = news.Body;
            NewsId = news.Id;
            Title = news.Title;
            SubjectId = news.SubjectId;
            DateCreate = news.EditDate.ToShortDateString();
        }

        public int NewsId
        {
            get; 
            set;
        }

        public int SubjectId
        {
            get;
            set;
        }

        public string Body
        {
            get;
            set;
        }

        public string Title
        {
            get; 
            set;
        }

        public string DateCreate
        {
            get; 
            set;
        }

        //public NewsDataViewModel(int id, int subjectId)
        //{
        //    SubjectId = subjectId;
        //    if (id != 0)
        //    {
        //        var news = SubjectManagementService.GetNews(id, subjectId);
        //        Body = news.Body;
        //        Title = news.Title;
        //        NewsId = id;
        //    }
        //}

        //public bool Delete()
        //{
        //    SubjectManagementService.DeleteNews(new SubjectNews { SubjectId = SubjectId, Id = NewsId });
        //    return true;
        //}

        //public bool Save()
        //{
        //    SubjectManagementService.SaveNews(new SubjectNews
        //    {
        //        SubjectId = SubjectId,
        //        Body = Body,
        //        Title = Title,
        //        EditDate = DateTime.Now,
        //        Id = NewsId
        //    });
        //    return true;
        //}
    }
}