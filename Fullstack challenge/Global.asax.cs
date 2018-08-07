using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Fullstack_challenge;
using Ninject;
using Ninject.Web.Common.WebHost;

namespace Fullstack.Challenge
{
	public class MvcApplication : NinjectHttpApplication
	{
		protected override void OnApplicationStarted()
		{
			base.OnApplicationStarted();

			AreaRegistration.RegisterAllAreas();
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
		}

		protected override IKernel CreateKernel()
		{
			StandardKernel kernel = new StandardKernel();
			return kernel;
		}
	}
}
