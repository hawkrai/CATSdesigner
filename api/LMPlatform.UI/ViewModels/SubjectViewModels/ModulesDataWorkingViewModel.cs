﻿using System.Linq;
using System.Web.Mvc;
using Application.Core;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.ViewModels.SubjectModulesViewModel;

namespace LMPlatform.UI.ViewModels.SubjectViewModels
{
    public class ModulesDataWorkingViewModel
    {
        private readonly LazyDependency<ISubjectManagementService> _subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService
        {
            get
            {
                return _subjectManagementService.Value;
            }
        }

        public Module Module
        {
            get;
            set;
        }

        public int SubjectId
        {
            get;
            set;
        }

        public ModuleType ParentModule { get; set; }

        public ModulesBaseViewModel DataModel
        {
            get;
            set;
        }

        public ModulesDataWorkingViewModel(int subjectId, int moduleId, ModuleType type)
        {
            SubjectId = subjectId;
            ParentModule = type;
            var subject = SubjectManagementService.GetSubject(subjectId);
            Module = subject.SubjectModules.First(e => (int)e.Module.Id == moduleId).Module;

            switch (type)
            {
                case ModuleType.Practical:
                    {
                        switch (Module.ModuleType)
                        {
                            case ModuleType.ScheduleProtection:
                                {
                                    break;
                                }

                            case ModuleType.Results:
                                {
                                    break;
                                }

                            case ModuleType.StatisticsVisits:
                                {
                                    break;
                                }
                        }

                        break;
                    }

                case ModuleType.Labs:
                    {
                        switch (Module.ModuleType)
                        {
                            case ModuleType.ScheduleProtection:
                                {
                                    ScheduleProtectionLabsGenerate();
                                    break;
                                }

                            case ModuleType.Results:
                                {
                                    break;
                                }

                            case ModuleType.StatisticsVisits:
                                {
                                    break;
                                }
                        }

                        break;
                    }
            }
        }

        public ModulesDataWorkingViewModel(int subjectId, int moduleId)
        {
            SubjectId = subjectId;
            var subject = SubjectManagementService.GetSubject(subjectId);
            Module = subject.SubjectModules.First(e => (int)e.Module.Id == moduleId).Module;
            switch (Module.ModuleType)
            {
                case ModuleType.News:
                    {
                        NewsGenerate();
                        break;
                    }

                case ModuleType.Lectures:
                    {
                        LecturesGenerate();
                        break;
                    }

                case ModuleType.Labs:
                    {
                        LabsGenerate();
                        break;
                    }

                case ModuleType.YeManagment:
                    {
                        break;
                    }

                case ModuleType.SubjectAttachments:
                    {
                        break;
                    }

                case ModuleType.LabAttachments:
                    {
                        break;
                    }

                case ModuleType.Projects:
                    {
                        break;
                    }

                case ModuleType.SmartTest:
                    {
                        break;
                    }

                case ModuleType.Dsm:
                    {
                        break;
                    }

                case ModuleType.Practical:
                    {
                        PracticalGenerate();
                        break;
                    }
            }
        }

        private void NewsGenerate()
        {
            var dataModule = new ModulesNewsViewModel(SubjectId, Module);
            DataModel = dataModule;
        }

        private void LecturesGenerate()
        {
            var dataModule = new ModulesLecturesViewModel(SubjectId, Module);
            DataModel = dataModule;
        }

        private void LabsGenerate()
        {
            var dataModule = new ModulesLabsViewModel(SubjectId, Module);
            DataModel = dataModule;
        }

        private void PracticalGenerate()
        {
            var dataModule = new ModulesPracticalViewModel(SubjectId, Module);
            DataModel = dataModule;
        }

        private void ScheduleProtectionLabsGenerate()
        {
            var dataModule = new ModulesScheduleProtectionLabsViewModel(SubjectId, Module);
            DataModel = dataModule;
        }
    }
}