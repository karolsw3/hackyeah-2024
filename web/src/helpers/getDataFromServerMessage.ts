import { DATA_START_TAG, DATA_END_TAG } from '../../../constants';

export function getDataFromServerMessage(serverMessage: string) {
	const startIndex = serverMessage.indexOf(DATA_START_TAG) + DATA_START_TAG.length;
	const endIndex = serverMessage.indexOf(DATA_END_TAG);
	if (startIndex === -1 || endIndex === -1) {
		return null;
	}
	return serverMessage.slice(startIndex, endIndex);
}
