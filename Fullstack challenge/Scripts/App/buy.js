var buyModule = (function () {

	function init() {
		var totlacost = 0
		$(".btn-minus").on("click", function () {

			var ele = $(this)
			var itemid = ele.attr("itemid")
			var quantity = parseInt($("#quantity_" + itemid).val())
			var newquantity = quantity - 1
			var min = parseInt($("#quantity_" + itemid).attr("min"))
			if (newquantity <= min) {
				$("#quantity_" + itemid).val(min)
			} else {
				$("#quantity_" + itemid).val(newquantity)
			}
			var res = updatetotalalcost()
		})
		$(".btn-plus").on("click", function () {
			var ele = $(this)
			var itemid = ele.attr("itemid")
			var quantity = parseInt($("#quantity_" + itemid).val())
			var max = parseInt($("#quantity_" + itemid).attr("max"))
			var newquantity = quantity + 1
			if (newquantity > max) {
				alert("You Exceed the Quantity")
				$("#quantity_" + itemid).val(max)
			} else {
				$("#quantity_" + itemid).val(newquantity)
				if (!updatetotalalcost()) {
					alert("You Do Not Have Enough Balance")
					$("#quantity_" + itemid).val(quantity)
					updatetotalalcost()
				}
			}

		})
		$(".itemcount").on("keydown",function (event) {
			var min = parseInt($(this).attr("min"))
			var max = parseInt($(this).attr("max"))
			var val = parseInt($(this).val())
			var key = event.charCode || event.keyCode || 0
			var valid = ((
				key == 8 ||
				key == 9 ||
				key == 46 ||
				key == 110 ||
				(key >= 37 && key <= 40) ||
				(key >= 48 && key <= 57) ||
				(key >= 96 && key <= 105)) && (val >= min && val <= max))
			if (!valid) {
				event.preventDefault()
			}
			if (!updatetotalalcost()) {
				$("#quantity_" + itemid).val(0)
			}
		})
		function updatetotalalcost() {
			var res = true
			totlacost = 0
			var userbalance = $("#totalcost").attr("userbalance")
			$(".itemcount").each(function () {
				var itemid = $(this).attr('itemid')
				var count = $('#quantity_' + itemid).val()
				var price = $('#quantity_' + itemid).attr("price")
				var itemcost = count * price
				if ((totlacost + itemcost) <= parseInt(userbalance)) {
					totlacost += (count * price)
				} else {
					res = false
					return res
				}
			})
			$("#totalcost").html(totlacost)
			return res
		}
		function close() {
			parent.$.facebox.close()
		}
		$(".newclose,.cancel").on("click", function () {
			close()
		})
		$(".buy").on("click", function () {
			var itemIds = new Array()
			var items = []
			$(".itemcount").each(function () {
				var itemid = $(this).attr('itemid')
				var count = $('#quantity_' + itemid).val()
				if (parseInt(count) > 0) {
					var item = { id: itemid, quantity: count }
					items.push(item)
				}
			})
			debugger
			if (items.length == 0) {
				alert("No Items to buy")
			} else {

				var _url = '@Url.Action("Buy", "Buy")'
				$.ajax({
					url: _url,
					method: 'post',
					data: {
						items: items,
						totlacost: totlacost
					}
				}).done(function (result) {
					debugger
					if (result.ResultValue == true) {
						alert(result.ResultMessage)
						location.reload()
						close()
					} else {
						alert(result.ResultMessage)
					}
				})
			}
		})
	}
	return {
		init: init
	}
})();