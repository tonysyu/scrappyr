import ScrapsPageController from '../../core/scraps-page-controller';


function scrapsPageControllerFactory(store) {
    return new ScrapsPageController(store);
}
scrapsPageControllerFactory.$inject = ['store'];
export default scrapsPageControllerFactory;
