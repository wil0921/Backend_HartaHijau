const hashData = async (data) => {
  const saltRounds = 10;
  return await bcrypt.hash(data, saltRounds);
};

module.exports = hashData;
