import app from './app';
import logger from './helpers/logging';
import { connectToDB } from './index.constants';

connectToDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`App is running on port: ${PORT}`);
});
