using System.ComponentModel;

namespace Application.Core.UI.Enums 
{
    public enum ErrorCode 
    {
        Ok,

        [Description("Пользователь еще не подтвержден")]
        NotConfirmed,

        [Description("Данныe имя пользователя и пароль больше не действительны")]
        Deleted,

        [Description("Имя пользователя или пароль не являются корректными")]
        DoesNotExist
    }
}