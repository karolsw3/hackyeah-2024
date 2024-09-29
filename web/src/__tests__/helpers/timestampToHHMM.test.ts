import { timestampToHHMM } from '../../helpers/timestampToHHMM'

describe('timestampToHHMM', () => {
	it('should return the correct time for a given timestamp in local time', () => {
		// Create timestamps based on local time
		const localTimestamp1 = new Date(2024, 8, 29, 8, 15, 0).getTime(); // 08:15 local time
		const localTimestamp2 = new Date(2024, 8, 29, 14, 5, 0).getTime(); // 14:05 local time
		const localTimestamp3 = new Date(2024, 8, 29, 23, 59, 0).getTime(); // 23:59 local time
		
		// Call the function and verify the output
		expect(timestampToHHMM(localTimestamp1)).toBe('08:15');
		expect(timestampToHHMM(localTimestamp2)).toBe('14:05');
		expect(timestampToHHMM(localTimestamp3)).toBe('23:59');
	});
	
	it('should pad single digit hours and minutes with leading zero', () => {
		const localTimestamp = new Date(2024, 8, 29, 7, 3, 0).getTime(); // 07:03 local time
		expect(timestampToHHMM(localTimestamp)).toBe('07:03');
	});
	
	it('should handle timestamps near midnight correctly', () => {
		const localTimestamp = new Date(2024, 8, 29, 0, 0, 0).getTime(); // 00:00 local time
		expect(timestampToHHMM(localTimestamp)).toBe('00:00');
	});
});
