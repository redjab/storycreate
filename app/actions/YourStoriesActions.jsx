import alt from '../alt';
import {assign} from 'underscore';
import YourStoriesSource from '../mockdata/YourStoriesSource';

class YourStoriesActions {
  constructor() {
    this.generateActions(
      'getStoriesSuccess',
      'getStoriesFail'
    );
  }

  getStories() {
    return (dispatch) => {
      dispatch();
      YourStoriesSource.fetch()
        .then((stories) => {
          this.actions.getStoriesSuccess(stories);
        })
        .catch((errorMessage) => {
          this.actions.getStoriesFail(errorMessage);
        })
    }
  }
}

export default alt.createActions(YourStoriesActions);
