using System;
using System.Web.Mvc;
using Fullstack.Challenge.Services;

namespace Fullstack.Challenge.Controllers
{
	[Authorize]
	public class HomeController : Controller
	{
		private readonly CurrentUserService _currentUserService;

		public HomeController(CurrentUserService currentUserService)
		{
			_currentUserService = currentUserService ?? throw new ArgumentNullException(nameof(currentUserService));
		}

		public ActionResult Index()
		{
			string name = _currentUserService.GetUserName();

			return View(model: name);
		}
	}
}