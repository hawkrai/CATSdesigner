using Unity;

namespace Application.Core
{
    public interface IUnityContainerWrapper
    {
        IUnityContainer Container { get; }

        IUnityContainerWrapper Register<T, TC>() where TC : T;
    }
}