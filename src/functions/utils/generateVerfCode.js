const generateVerfCode = () => {
  let randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber;
};

export default generateVerfCode;
