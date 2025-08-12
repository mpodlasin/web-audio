import { localStorageItem } from "../../utils/localStorage.svelte";

export class TutorialPin {
    tutorialPinnedItem = localStorageItem('tutorial_pinned', true);
	tutorialPinned = $derived(this.tutorialPinnedItem.value);

	handlePinClick = () => {
		this.tutorialPinnedItem.value = !this.tutorialPinned;
	};
}