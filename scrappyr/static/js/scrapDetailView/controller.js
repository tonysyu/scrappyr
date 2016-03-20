import 'angular';


export class ScrapDetailViewController {
    constructor(scrapStorage) {
        this._scrapStorage = scrapStorage;
        this._originalScrap = null;
        this.isEditing = false;
    }

    revertToOriginalScrap(scrap) {
        angular.copy(this._originalScrap, scrap);
    }

    updateOriginalScrap(scrap) {
        this._originalScrap = angular.extend({}, scrap);
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
        if (angular.isUndefined(scrap)) {
            return;
        }
        this.revertToOriginalScrap(scrap);
        this.isEditing = false;
    }
}

// Angular factory for ScrapDetailViewController.
export function scrapDetailViewControllerFactory($scope, scrapStorage) {
    var ctrl = new ScrapDetailViewController(scrapStorage);
    // Watch changes in scrap *identity* and copy that as `originalScrap`.
    $scope.$watch('scrap', () => ctrl.updateOriginalScrap($scope.scrap));
    return ctrl;
}

scrapDetailViewControllerFactory.$inject = ['$scope', 'scrapStorage'];
