using System.Collections.Generic;
using Fullstack.Challenge.Models;

namespace Fullstack.Challenge.Data
{
	public class ItemRepository
	{
		private static readonly List<Item> _items;
		static ItemRepository()
		{
			_items = new List<Item>
			{
				new Item
				{
					Id = 1,
					Name = "Bronze sword: low quality, low price",
					Price = 8,
					Quantity = 10,
					img="bronze_sword.png",
					min =0
				},
				new Item
				{
					Id = 2,
					Name = "Wooden shield",
					Price = 15,
					Quantity = 5,
					img="wooden_shield.png",
					min =0
				},
				new Item
				{
					Id = 3,
					Name = "Battle axe",
					Price = 12,
					Quantity = 2,
					img="battle_axe.png",
					min =0
				},
				new Item
				{
					Id = 4,
					Name = "Longsword, carefully crafted to slay your enemies",
					Price = 31,
					Quantity = 1,
					img ="longsword.png",
					min =0
				},
			};
		}
		public List<Item> GetAlItems()
		{
			return _items;
		}
		public bool UpdateItems(Item item)
		{
			bool flag = false;
			lock (_items)
			{
				try
				{
					var items = _items.Find(x => x.Id == item.Id && x.Quantity >= item.Quantity);
					if (item != null)
					{
						_items.Find(x => x.Id == item.Id && x.Quantity >= item.Quantity).Quantity -= item.Quantity;
						flag = true;
					}
				}
				catch (System.Exception)
				{
					flag = true;
				}
			}
			return flag;
		}
	
		public Result ValidateStockItems(List<Item> Basketitems)
		{
			Result result = new Result();
			lock (_items)
			{
				result.ResultValue = true;
				result.ResultMessage = "";
				foreach (var item in Basketitems)
				{
					var valid = _items.Find(x => x.Id >= item.Id);
					if (valid != null)
					{
						if (valid.Quantity < item.Quantity)
						{
							result.ResultValue = false;
							result.ResultMessage = "Max Quantity of " + item.Name + " is :" + valid.Quantity;
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
		public Result UpdateStock(List<Item> Basketitems, int _totlacost)
		{
			Result result = new Result();
			result.ResultValue = false;

			lock (_items)
			{
				result = ValidateStockItems(Basketitems);
				if (result.ResultValue)
				{
					foreach (var item in Basketitems)
					{
						UpdateItems(item);
					}
				}
			}
			return result;
		}
	}
}