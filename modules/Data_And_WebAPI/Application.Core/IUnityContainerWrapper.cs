using Unity;

namespace Application.Core
{
	public interface IUnityContainerWrapper
	{
		IUnityContainerWrapper Register<T, TC>() where TC : T;

		IUnityContainer Container
		{
			get;
		}
	}
}