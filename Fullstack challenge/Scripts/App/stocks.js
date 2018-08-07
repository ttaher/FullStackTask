var stocksModule = (function () {

	function init(element) {
		$.ajax({
			url: "/Stocks/Data"
		}).done(render);

		function render(stocks) {
			stocks.forEach(function (stock) {
				element.append(stock.ItemName + " " + stock.Quantity + "<br/>");
			});
		}
	}

	return {
		init: init
	}
})();