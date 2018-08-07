using System;
using System.Collections.Generic;
using System.Linq;
using Fullstack.Challenge.Data;
using Fullstack.Challenge.Models;

namespace Fullstack.Challenge.Services
{
	public class StocksService
	{
		private readonly ItemRepository _itemRepository;
		public StocksService(ItemRepository itemRepository)
		{
			_itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository));
		}

		public List<Stock> GetStocksAvailable()
		{
			return _itemRepository.GetAlItems().Where(x => x.Quantity > 0)
				.Select(it => new Stock
				{
					ItemName = string.Join(" ", it.Name.Split(' ').Take(2)).Replace(":", "").Replace(",", ""),
					Quantity = it.Quantity,
					Price = it.Price,
					Id = it.Id,
					img = it.img,
					min = it.min
				}).ToList();
		}

		public List<Stock> GetStocks()
		{
			return _itemRepository.GetAlItems()
				.Select(it => new Stock
				{
					ItemName = it.Name,
					Quantity = it.Quantity,
					Price = it.Price,
					Id = it.Id,
					img = it.img,
					min = it.min
				}).ToList();
		}

		public int GetTotalDeducts(string ids)
		{
			return _itemRepository.GetAlItems().Where(x => ids.Contains(x.Id.ToString())).Sum(x => x.Price);
		}
		public Result UpdateList(List<Item> _items,int _totlacost)
		{
			return _itemRepository.UpdateStock(_items,_totlacost);
		}
		public Result ValidateBasket(List<Item> _items)
		{
			Result result = new Result();
			{
				result.ResultValue = true;
				result.ResultMessage = "";
				foreach (var item in _items)
				{
					var valid = GetStocksAvailable().Find(x => x.Id >= item.Id);
					if (valid != null)
					{
						if (valid.Quantity < item.Quantity)
						{
							result.ResultValue = false;
							result.ResultMessage = "Max Quantity of " + valid.ItemName + " is :" + valid.Quantity;
							return result;
						}
					}
					else
					{
						result.ResultValue = false;
						result.ResultMessage = item.Name + " is not available in the store now ";
						return result;
					}
				}
				return result;
			}
		}
		
		public bool UpdateList(Item _item)
		{
			return _itemRepository.UpdateItems(_item);
		}
	}
}