using System;
using System.Collections.Generic;
using Fullstack.Challenge.Data;
using Fullstack.Challenge.Models;

namespace Fullstack.Challenge.Services
{
	public class CurrentUserService
	{
		private readonly UserRepository _userRepository;
		private readonly AuthenticationService _authenticationService;
		private readonly StocksService _stocksService;
		public CurrentUserService(
			UserRepository userRepository,
			AuthenticationService authenticationService, StocksService stocksService)
		{
			_stocksService = stocksService ?? throw new ArgumentNullException(nameof(stocksService));
			_userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
			_authenticationService = authenticationService ?? throw new ArgumentNullException(nameof(authenticationService));
		}

		public int GetBalance()
		{
			int userId = _authenticationService.GetCurrentUserId();
			User user = _userRepository.GetUserById(userId);
			return user.Balance;
		}
		public User GetUser()
		{
			int userId = _authenticationService.GetCurrentUserId();
			User user = _userRepository.GetUserById(userId);
			return user;
		}

		public string GetUserName()
		{
			int userId = _authenticationService.GetCurrentUserId();
			User user = _userRepository.GetUserById(userId);
			return user.Login;
		}
		public int GetUserId()
		{
			int userId = _authenticationService.GetCurrentUserId();
			return userId;
		}
		public bool UpdateUser(User _user)
		{
			return _userRepository.UserUpdate(_user);
		}
		public Result Buy(List<Item> items, int _totlacost)
		{
			Result res = new Result();
			res.ResultValue = false;
			res.ResultMessage = "";
			try
			{
				User _user = GetUser();
				if (!_userRepository.UpdateUserBalance(_user, _totlacost))
				{
					res.ResultValue = false;
					res.ResultMessage = "You Do Not Have Enough Balance";
					return res;
				}
				else
				{
					res = _stocksService.ValidateBasket(items);
					if (res.ResultValue)
					{
						_stocksService.UpdateList(items,_totlacost);
						bool updated = UpdateUser(_user);
						if (updated)
						{
							res.ResultValue = false;
							res.ResultMessage = "Process Succeeded";
						}
					}
					else
					{
						return res;
					}
				}
			}
			catch (Exception ex)
			{
				res.ResultValue = false;
				res.ResultMessage = ex.Message;
			}
			return res;
		}
	}
}