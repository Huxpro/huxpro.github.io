// *
// Handle the hash location of Chinese tags with space
// --------------------------------------------------------------------------------
export default function removeSpace(string) {
	return string.replace(/\s+/g, '');
}
