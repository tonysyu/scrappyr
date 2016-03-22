/**
 * The controller for tags page.
 */
export default class TagsPageController {
    constructor(scrapStore, tagStore) {
        this._tagStore = tagStore;
        this.scraps = scrapStore.scraps;
        this.tags = tagStore.tags;

        // Dict-like object which maps tag text to selection state.
        this.tagSelections = {};
        // Array of tag text for ng-repeat.
        this.selectedTags = [];
    }

    removeTag(tag) {
        this._tagStore.remove(tag);
    };

    updateTagSelections() {
        var name,
            tagList = [];

        for (name in this.tagSelections) {
            if (this.tagSelections.hasOwnProperty(name)) {
                if (this.tagSelections[name] === true) {
                    tagList.push(name);
                }
            }
        }
        this.selectedTags = tagList;
    };
}
