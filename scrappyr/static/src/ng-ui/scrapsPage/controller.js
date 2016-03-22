import ScrapsPageController from '../../core-ui/scraps-page-controller';


function scrapsPageControllerFactory(store) {
    return new ScrapsPageController(store);
}
scrapsPageControllerFactory.$inject = ['store'];
export default scrapsPageControllerFactory;
