using System;
using System.Web.Mvc;
using Fullstack.Challenge.Services;

namespace Fullstack.Challenge.Controllers
{
	public class AuthenticationController : Controller
	{
		private readonly AuthenticationService _authenticationService;

		public AuthenticationController(AuthenticationService authenticationService)
		{
			_authenticationService = authenticationService ?? throw new ArgumentNullException(nameof(authenticationService));
		}

		[HttpGet]
		public ActionResult LogIn()
		{
			return View();
		}

		[HttpPost]
		public ActionResult LogIn(string login, string password)
		{
			if (_authenticationService.TryAuthenticate(login, password))
			{
				return RedirectToAction("Index", "Home");
			}
			else
			{
				TempData["error"] = "Login or password is not correct";
				return RedirectToAction("LogIn");
			}
		}

		public ActionResult LogOut()
		{
			_authenticationService.DeAuthenticate();
			return RedirectToAction("Index", "Home");
		}
	}
}