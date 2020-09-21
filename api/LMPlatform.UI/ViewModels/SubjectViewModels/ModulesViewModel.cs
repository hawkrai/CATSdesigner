﻿using LMPlatform.Models;

namespace LMPlatform.UI.ViewModels.SubjectViewModels
{
    public class ModulesViewModel
    {
        public ModulesViewModel(Module module, bool check = false)
        {
            Name = module.DisplayName;
            ModuleId = module.Id;
            Checked = check;
            Type = module.ModuleType;
        }

        public ModulesViewModel()
        {
        }

        public string Name
        {
            get;
            set;
        }

        public int ModuleId
        {
            get; 
            set;
        }

        public bool Checked
        {
            get;
            set;
        }

        public ModuleType Type
        {
            get;
            set;
        }
    }
}