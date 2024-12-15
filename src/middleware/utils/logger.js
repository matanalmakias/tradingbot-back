import chalk from "chalk";

const logger = (req, res, next) => {
  console.log(chalk.bold.bgCyanBright(req.method, req.url));
  next();
};

export { logger }; //~ module.exports = {}
export default logger; //~ module.exports = logger
