using Fullstack.Challenge.Data;
using Fullstack.Challenge.Services;
using NUnit.Framework;

namespace Fullstack_challenge_tests
{
	[TestFixture]
	public class UserCredentialsValidatorTests
	{
		private UserCredentialsValidator _validator;

		[SetUp]
		public void SetUp()
		{
			_validator = new UserCredentialsValidator(new UserRepository());
		}

		[Test]
		public void ReturnsTrueAndUserIdIfPasswordAndLoginAreCorrect()
		{
			bool result = _validator.ValidateUserCredentials("user1@example.com", "1", out int userId);

			Assert.That(result, Is.True);
			Assert.That(userId, Is.EqualTo(1));
		}

		[Test]
		public void ReturnsFalseIfLoginIsIncorrect()
		{
			bool result = _validator.ValidateUserCredentials("unknown@example.com", "1", out int _);

			Assert.That(result, Is.False);
		}

		[Test]
		public void ReturnsFalseIfPasswordIsIncorrect()
		{
			bool result = _validator.ValidateUserCredentials("user1@example.com", "wrong", out int _);

			Assert.That(result, Is.False);
		}
	}
}
