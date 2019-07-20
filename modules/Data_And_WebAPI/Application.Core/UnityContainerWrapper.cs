using Unity;

namespace Application.Core
{
    public class UnityContainerWrapper : IUnityContainerWrapper
    {
        public UnityContainerWrapper(IUnityContainer container)
        {
            Container = container;
        }

        public IUnityContainerWrapper Register<T, TC>() where TC : T
        {
            Container.RegisterType<T, TC>();

            return this;
        }

        public IUnityContainer Container { get; }
    }
}