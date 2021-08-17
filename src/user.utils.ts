import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub();

export type PubsubNotifcation = {
  body: any;
  topicName: string;
};
export const pubsubNotifcation = async (input: PubsubNotifcation) => {
  const { body, topicName } = input;
  const dataValue = typeof body === 'string' ? body : JSON.stringify(body);
  const dataBuffer = Buffer.from(dataValue);
  const id = await pubSubClient.topic(topicName).publish(dataBuffer);
  console.log(`${id} published.`);
  return id;
};
