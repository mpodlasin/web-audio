export function localStorageItem<I>(key: string, defaultValue: I): { value: I } {
	let value = $state({ value: defaultValue });

	$effect(() => {
		let storageValue = localStorage.getItem(key);

		if (storageValue !== null) {
			try {
				value.value = JSON.parse(storageValue);
			} catch {}
		}
	});

	$effect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value.value));
		} catch {}
	});

	return value;
}
