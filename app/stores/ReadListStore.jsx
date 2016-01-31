import alt from '../alt';
import ReadListActions from '../actions/ReadListActions';

class ReadListStore {
  constructor() {
    this.bindActions(ReadListActions);
    this.stories = [];
    this.categories = [];
  }

  onGetStoriesSuccess(data){
    this.stories = data;
  }

  onGetStoriesFail(errorMessage){
    toastr.options.positionClass = "toast-top-center";
    toastr.error(errorMessage);
  }

  onGetCategorySuccess(data){
    this.categories = data;
  }

  onGetCategoryFail(errorMessage){
    toastr.options.positionClass = "toast-top-center";
    toastr.error(errorMessage);
  }
}

export default alt.createStore(ReadListStore);
