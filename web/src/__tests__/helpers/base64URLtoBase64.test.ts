import { base64URLtoBase64 } from '../../helpers/base64URLtoBase64'

describe('base64URLtoBase64', () => {
	it('should return the Base64 portion of a base64Url string', () => {
		const input = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
		const expectedOutput = 'iVBORw0KGgoAAAANSUhEUgAAAAUA';
		
		const result = base64URLtoBase64(input);
		
		expect(result).toBe(expectedOutput);
	});
	
	it('should return undefined if no base64 data is present', () => {
		const input = 'invalid input';
		const result = base64URLtoBase64(input);
		
		expect(result).toBe(undefined);
	});
	
	it('should handle a string with no comma', () => {
		const input = 'noCommaBase64String';
		const result = base64URLtoBase64(input);
		
		expect(result).toBe(undefined);
	});
});
