export function passwordMatch(value, form) {
	if (value !== form.values.password) {
			return { passwordMatch: true };
	}
}

export function containNumbers(numbers) {
	return function(value) {
		if (value.replace(/[^0-9]/g,"").length < numbers) {
			return { containNumbers: numbers };
		}
	}
}

export function hasUppercase() {
	return function(value) {
		if (value.replace(/[^A-Z]/g,"").length == 0) {
			return { hasUppercase: true };
		}
	}
}