import alt from '../alt';
import {assign} from 'underscore';
import ReadListSource from '../mockdata/ReadListSource';

class ReadListActions {
  constructor() {
    this.generateActions(
      'getStoriesSuccess',
      'getStoriesFail',
      'getCategorySuccess',
      'getCategoryFail'
    );
  }

  getStories() {
    return (dispatch) => {
      dispatch();
      ReadListSource.fetchFeatured()
        .then((stories) => {
          this.actions.getStoriesSuccess(stories);
        })
        .catch((errorMessage) => {
          this.actions.getStoriesFail(errorMessage);
        })
    }
  }

  getCategories() {
    return (dispatch) => {
      dispatch();
      ReadListSource.fetchCategories()
        .then((categories) => {
          this.actions.getCategorySuccess(categories);
        })
        .catch((errorMessage) => {
          this.actions.getCategoryFail(errorMessage);
        })
    }
  }
}

export default alt.createActions(ReadListActions);
