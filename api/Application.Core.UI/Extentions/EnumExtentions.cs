using System.Reflection;
using System;
using System.ComponentModel;

namespace Application.Core.UI.Extentions 
{
    public static class EnumExtentions 
    {
        public static string GetDescription<T>(this T enumerationValue)
            where T : Enum
        {
            Type type = enumerationValue.GetType();

            MemberInfo[] memberInfo = type.GetMember(enumerationValue.ToString());

            if (!(memberInfo is null) && memberInfo.Length > 0)
            {
                object[] attrs = memberInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (!(attrs is null) && attrs.Length > 0)
                {
                    return ((DescriptionAttribute)attrs[0]).Description;
                }
            }
            
            return enumerationValue.ToString();
        }
    }
}