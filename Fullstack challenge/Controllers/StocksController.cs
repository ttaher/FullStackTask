using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Fullstack.Challenge.Models;
using Fullstack.Challenge.Services;

namespace Fullstack.Challenge.Controllers
{
	[Authorize]
	public class StocksController: Controller
	{
		private readonly StocksService _stocksService;

		public StocksController(StocksService stocksService)
		{
			_stocksService = stocksService ?? throw new ArgumentNullException(nameof(stocksService));
		}

		public ActionResult Index()
		{
			return View();
		}

		public ActionResult Data()
		{
			List<Stock> stocks = _stocksService.GetStocks();

			return Json(stocks, JsonRequestBehavior.AllowGet);
		}
		public ActionResult Items()
		{
			List<Stock> stocks = _stocksService.GetStocks();

			return Json(stocks, JsonRequestBehavior.AllowGet);
		}
	}
}