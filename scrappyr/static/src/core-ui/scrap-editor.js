import _ from 'underscore';


export default class ScrapEditor {
    constructor(scrapStorage) {
        this._scrapStorage = scrapStorage;
        this._originalScrap = null;
        this.isEditing = false;
    }

    revertToOriginalScrap(scrap) {
        _.extend(scrap, this._originalScrap);
    }

    updateOriginalScrap(scrap) {
        this._originalScrap = _.clone(scrap);
    }

    onTagChanged(scrap) {
        // TODO: Pass just the ID and tag list and have the backend update
        // just the tags.
        this._scrapStorage.put(scrap);
    }

    editScrap(scrap) {
        this.isEditing = true;
    }

    saveEdits(scrap) {
        scrap.title = scrap.title.trim();
        if (scrap.title === this._originalScrap.title) {
            this.isEditing = false;
            return;
        }

        this._scrapStorage[scrap.title ? 'put' : 'remove'](scrap)
            .then(
                () => this.updateOriginalScrap(scrap),
                () => this.revertToOriginalScrap(scrap)
            )
            .finally(() => { this.isEditing = false; });
    }

    revertEdits(scrap) {
        if (_.isUndefined(scrap)) {
            return;
        }
        this.revertToOriginalScrap(scrap);
        this.isEditing = false;
    }
}
