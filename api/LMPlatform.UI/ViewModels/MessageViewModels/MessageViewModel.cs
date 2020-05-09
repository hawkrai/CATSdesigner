using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using Application.Core;
using Application.Infrastructure.MessageManagement;
using Application.Infrastructure.UserManagement;
using LMPlatform.Models;

namespace LMPlatform.UI.ViewModels.MessageViewModels
{
    public class MessageViewModel
    {
        private readonly LazyDependency<IMessageManagementService> _messageManagementService =
            new LazyDependency<IMessageManagementService>();

        private readonly LazyDependency<IUsersManagementService> _userManagementService =
            new LazyDependency<IUsersManagementService>();

        public MessageViewModel()
        {
        }

        public MessageViewModel(bool toadmin = false)
        {
            this.ToAdmin = toadmin;
        }

        public IMessageManagementService MessageManagementService => this._messageManagementService.Value;

        public IUsersManagementService UserManagementService => this._userManagementService.Value;

        [HiddenInput(DisplayValue = false)]
        public int FromId { get; set; }

        [Required(ErrorMessage = "Необходимо указать получателя")]
        [Display(Name = "Кому")]
        public List<int> Recipients { get; set; }

        [Display(Name = "Сообщение")]
        [Required(ErrorMessage = "Введите текст сообщения")]
        [DataType(DataType.MultilineText)]
        public string MessageText { get; set; }

        [Display(Name = "Тема")]
        [Required(ErrorMessage = "Введите тему сообщения")]
        [DataType(DataType.Text)]
        [MaxLength(50, ErrorMessage = "Длина поля Тема не должна превышать 50 символов")]
        public string Subject { get; set; }

        public List<UserMessages> UserMessages { get; set; }

        public List<Attachment> Attachment { get; set; }

        [Display(Name = "Администратору")]
        public bool ToAdmin { get; set; }

        public IList<SelectListItem> GetRecipientsSelectList()
        {
            var recip = this.MessageManagementService.GetRecipients(this.FromId);

            return recip.Select(r => new SelectListItem
            {
                Text = r.FullName,
                Value = r.Id.ToString(CultureInfo.InvariantCulture)
            }).ToList();
        }

        public void SaveMessage()
        {
            var msg = new Message(this.MessageText, this.Subject);

            if (this.Attachment != null && this.Attachment.Any())
            {
                msg.AttachmentsPath = Guid.NewGuid();
                this.Attachment.ForEach(a => a.PathName = msg.AttachmentsPath.ToString());
                msg.Attachments = this.Attachment;
            }

            this.MessageManagementService.SaveMessage(msg);

            if (this.ToAdmin)
            {
                var admin = this.UserManagementService.GetAdmin();
                var userMsg = new UserMessages(admin.Id, this.FromId, msg.Id);
                this.MessageManagementService.SaveUserMessages(userMsg);
            }
            else
            {
                foreach (var recipient in this.Recipients)
                {
                    var userMsg = new UserMessages(recipient, this.FromId, msg.Id);
                    this.MessageManagementService.SaveUserMessages(userMsg);
                }
            }
        }
    }
}