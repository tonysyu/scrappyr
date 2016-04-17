import * as coreUI from '../../core-ui';


function scrapsPageControllerFactory(store) {
    return new coreUI.ScrapsPageController(store);
}
scrapsPageControllerFactory.$inject = ['store'];
export default scrapsPageControllerFactory;
