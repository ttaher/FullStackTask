using System.Web.Mvc;
using Fullstack.Challenge.Services;

namespace Fullstack.Challenge.Helpers
{
	public static class BalanceHelper
	{
		public static int Balance(this HtmlHelper html)
		{
			CurrentUserService currentUserService = DependencyResolver.Current.GetService<CurrentUserService>();
			return currentUserService.GetBalance();
		}
		
	}
}