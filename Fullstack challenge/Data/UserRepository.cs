using System.Collections.Generic;
using System.Linq;
using Fullstack.Challenge.Models;

namespace Fullstack.Challenge.Data
{
	public class UserRepository
	{
		private static readonly List<User> _users;

		public User GetUserByLogin(string login)
		{
			return _users.FirstOrDefault(u => u.Login == login);
		}

		public User GetUserById(int userId)
		{
			User user = _users.First(u => u.Id == userId);
			return user;
		}
		public bool UserUpdate(User _user)
		{
			try
			{
				_users.Find(x => x.Id == _user.Id).Balance = _user.Balance;
				return true;
			}
			catch (System.Exception)
			{
				return false;
				
			}
		}

		public bool ValidateUserBalance(User _user, int _totlacost)
		{
			bool result = false;
			lock (_users)
			{
				if (_user.Balance >= _totlacost)
				{
					result = true;
				}
			}
			return result;
		}
		public bool UpdateUserBalance(User _user, int _totlacost)
		{
			bool result = false;
			lock (_users)
			{
				if (ValidateUserBalance(_user, _totlacost))
				{
					_user.Balance -= _totlacost;
					result = true;
				}
			}
			return result;
		}
		static UserRepository()
		{
			_users = new List<User>
			{
				new User
				{
					Id = 1,
					Login = "user1@example.com",
					Password = "1",
					Balance = 37
				},
				new User
				{
					Id = 2,
					Login = "user2@example.com",
					Password = "1",
					Balance = 150
				},
				new User
				{
					Id = 3,
					Login = "user3@example.com",
					Password = "1",
					Balance = 50
				}
			};
		}
	}
}