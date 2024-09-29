import { MESSAGE_START_TAG, MESSAGE_END_TAG, DATA_START_TAG, DATA_END_TAG } from "../../../constants";
import { IMessage, MessageRole } from "../models/Conversation.model";
import { createPCCDeclarationXml } from "./createPCCDeclarationXml";

export const getMessagesWithXml = async (messages: IMessage[]): Promise<IMessage[]> => {
  const modifiedMessages: IMessage[] = [];
  for (const message of messages) {
    if (message.role === MessageRole.USER) {
      modifiedMessages.push(message);
      continue;
    }
    const messageText = message.text.slice(
      message.text.indexOf(MESSAGE_START_TAG) + MESSAGE_START_TAG.length,
      message.text.indexOf(MESSAGE_END_TAG)
    );
    const dataText = message.text.slice(
      message.text.indexOf(DATA_START_TAG) + DATA_START_TAG.length,
      message.text.indexOf(DATA_END_TAG)
    );
    let xml: string | undefined;
    if (dataText.length > 0) {
      try {
        const data = JSON.parse(dataText);
        if (data.pccDeclaration) {
          xml = await createPCCDeclarationXml(data.pccDeclaration);
        }
      } catch (error) {
        console.error('Error parsing data', error);
      }
    }
    modifiedMessages.push({
      ...message,
      text: `${MESSAGE_START_TAG}${messageText}${MESSAGE_END_TAG}${xml ? `${DATA_START_TAG}${xml}${DATA_END_TAG}` : ''}`,
    });
  }
  return modifiedMessages;
}
