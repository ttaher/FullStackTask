using System;
using Fullstack.Challenge.Data;
using Fullstack.Challenge.Models;

namespace Fullstack.Challenge.Services
{
	public class UserCredentialsValidator
	{
		private readonly UserRepository _userRepository;

		public UserCredentialsValidator(UserRepository userRepository)
		{
			_userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
		}

		public bool ValidateUserCredentials(string login, string password, out int userId)
		{
			User user = _userRepository.GetUserByLogin(login.ToLowerInvariant());

			if (user != null)
			{
				if (user.Password.ToLowerInvariant() == password.ToLowerInvariant())
				{
					userId = user.Id;
					return true;
				}
			}

			userId = -1;
			return false;
		}
	}
}