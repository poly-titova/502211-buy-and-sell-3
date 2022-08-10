'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const { HttpCode, API_PREFIX } = require(`../../constants`);
const { getLogger } = require(`../lib/logger`);
const logger = getLogger({ name: `api` });
const routes = require(`../api`);
const sequelize = require(`../lib/sequelize`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const app = express();
app.use(express.json());

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (_err) {
    res.send([]);
  }
});

app.use(API_PREFIX, routes);

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established`);
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port)
      .on("error", (err) => {
        logger.error(`An error occurred: ${err.message}`);
        process.exit(1);
      })
      .on("listening", () => {
        return logger.info(`Waiting for connections on a post ${port}`);
      });
  }
};
