const setModelName = (modelName) => {
  return async (req, res, next) => {
    req.modelName = modelName;
    next();
  };
};

export default setModelName;
