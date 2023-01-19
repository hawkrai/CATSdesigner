using Application.Core.Data;
using System.Collections.Generic;

namespace LMPlatform.UI.ViewModels.AdministrationViewModels
{
    public class FilesPageViewModel<TModel>
    {
        public IEnumerable<TModel> Items { get; set; }

        public IPageInfo PageInfo { get; set; }

        public int TotalCount { get; set; }

        public string ServerPath { get; set; }
    }
}