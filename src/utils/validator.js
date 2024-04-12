const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(?:\+62|62|0)[2-9]\d{7,11}$/;
  return phoneRegex.test(phoneNumber);
};

const validator = { isValidPhoneNumber };

module.exports = validator;
