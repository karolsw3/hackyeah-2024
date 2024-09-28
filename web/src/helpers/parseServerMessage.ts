export function parseServerMessage(serverMessage: string): string {
	const startTag = '<|som|>';
	const endTag = '<|eom|>';
	
	const startIndex = serverMessage.indexOf(startTag);
	if (startIndex === -1) {
		// <|som|> not found, return an empty string
		return '';
	}
	
	const contentStartIndex = startIndex + startTag.length;
	const endIndex = serverMessage.indexOf(endTag, contentStartIndex);
	
	if (endIndex === -1) {
		// <|eom|> not found, extract till the end
		return serverMessage.substring(contentStartIndex);
	} else {
		// Extract content between <|som|> and <|eom|>
		return serverMessage.substring(contentStartIndex, endIndex);
	}
}
