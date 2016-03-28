class Constants {
    constructor(){
        this.MAX_CHAR_TITLE = 17;
        this.MAX_CHAR_PASSAGE = 125;
        this.MAX_CHAR_CHOICE = 17;

        this.DEFAULT_TITLE = "Untitled";
        this.DEFAULT_PASSAGE = "Double click here to start writing and add choices. To branch your story, add a choice to this passage, and drag from the choice to a new passage."
        this.PASSAGE_HEIGHT = 150;
        this.PASSAGE_WIDTH = 130;

        this.PASSAGE_FIRST_POSITION_X = 80;
        this.PASSAGE_FIRST_POSITION_Y = 80;
        this.PASSAGE_TRANSLATE_X = 150;

        this.CHOICE_HEIGHT = 30;
        this.CHOICE_WIDTH = this.PASSAGE_WIDTH;
        this.DEFAULT_CHOICE = "";

        this.DEFAULT_STORY_NAME = "Untitled";
        this.DEFAULT_AUTHOR = "Anonymous";

        this.DEFAULT_GRAPH_EXT = "_graph";
        this.DEFAULT_STORY_EXT = "_story";
        this.DEFAULT_ATTR_EXT = "_attribute";
        this.DEFAULT_CHOICE_EXT = "_choice";


        this.DEFAULT_GRAPH = this.DEFAULT_STORY_NAME + this.DEFAULT_GRAPH_EXT;
        this.DEFAULT_STORY_DATA = this.DEFAULT_STORY_NAME + this.DEFAULT_STORY_EXT;
        this.DEFAULT_ATTR_DATA = this.DEFAULT_STORY_NAME + this.DEFAULT_ATTR_EXT;
        this.DEFAULT_CHOICE_DATA = this.DEFAULT_STORY_NAME + this.DEFAULT_CHOICE_EXT;
        this.DEFAULT_LINK_TO = {conditions: [], events: []};
        this.DEFAULT_STORY = {
                    "metadata":
                    {
                        "id": 1,
                        "title": this.DEFAULT_STORY_NAME,
                        "author": this.DEFAULT_AUTHOR,
                        "created": Date.now(),
                        "updated": Date.now(),
                        "options":
                        {
                            "allowSave": true,
                            "publish": true
                        }
                    },
                    "content":
                    {
                        "attributes":[],
                        "passages":[]
                    }
                };
        this.DEFAULT_READ_PROGRESS_EXT = "_read";
        this.DEFAULT_READ_ATTR_EXT = "_readAttrs";
        this.DEFAULT_READ_CHECKPOINT_EXT = "_checkpoints";
    }
}

export default new Constants();