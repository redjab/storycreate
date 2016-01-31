import alt from '../alt';
import YourStoriesActions from '../actions/YourStoriesActions';

class YourStoriesStore {
  constructor() {
    this.bindActions(YourStoriesActions);
    this.stories = [];
  }

  onGetStoriesSuccess(data){
    this.stories = data;
  }

  onGetStoriesFail(data){
    toastr.options.positionClass = "toast-top-center";
    toastr.error(data);
  }
}

export default alt.createStore(YourStoriesStore);
