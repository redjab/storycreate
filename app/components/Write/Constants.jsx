var MAX_CHAR_TITLE = 17;
var MAX_CHAR_PASSAGE = 125;
var MAX_CHAR_CHOICE = 17;

var DEFAULT_TITLE = "Untitled";
var DEFAULT_PASSAGE = "Double click here to start writing and add choices. To branch your story, add a choice to this passage, and drag from the choice to a new passage."
var DEFAULT_PASSAGE_SHORTENED = DEFAULT_PASSAGE.substring(0, MAX_CHAR_PASSAGE) + "...";
var PASSAGE_HEIGHT = 150;
var PASSAGE_WIDTH = 130;

var PASSAGE_FIRST_POSITION_X = 80;
var PASSAGE_FIRST_POSITION_Y = 80;
var PASSAGE_TRANSLATE_X = 150;

var CHOICE_HEIGHT = 30;
var CHOICE_WIDTH = PASSAGE_WIDTH;
var DEFAULT_CHOICE = "";

var DEFAULT_STORY_NAME = "Untitled";
var DEFAULT_AUTHOR = "Anonymous";
var DEFAULT_GRAPH = DEFAULT_STORY_NAME + "_graph";
var DEFAULT_STORY_DATA = DEFAULT_STORY_NAME + "_story";
var DEFAULT_ATTR_DATA = DEFAULT_STORY_NAME + "_attribute";
var DEFAULT_CHOICE_DATA = DEFAULT_STORY_NAME + "_choice";
var DEFAULT_STORY = {
            "metadata":
            {
                "id": 1,
                "title": DEFAULT_STORY_NAME,
                "author": DEFAULT_AUTHOR,
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

export default {
    MAX_CHAR_TITLE : MAX_CHAR_TITLE,
    MAX_CHAR_PASSAGE : MAX_CHAR_PASSAGE,
    MAX_CHAR_CHOICE : MAX_CHAR_CHOICE,

    DEFAULT_TITLE : DEFAULT_TITLE,
    DEFAULT_PASSAGE : DEFAULT_PASSAGE,
    DEFAULT_PASSAGE_SHORTENED : DEFAULT_PASSAGE_SHORTENED,
    PASSAGE_HEIGHT : PASSAGE_HEIGHT,
    PASSAGE_WIDTH : PASSAGE_WIDTH,

    PASSAGE_FIRST_POSITION_X : PASSAGE_FIRST_POSITION_X,
    PASSAGE_FIRST_POSITION_Y : PASSAGE_FIRST_POSITION_Y,
    PASSAGE_TRANSLATE_X : PASSAGE_TRANSLATE_X,

    CHOICE_HEIGHT : CHOICE_HEIGHT,
    CHOICE_WIDTH : CHOICE_WIDTH,
    DEFAULT_CHOICE : DEFAULT_CHOICE,

    DEFAULT_STORY_NAME : DEFAULT_STORY_NAME,
    DEFAULT_AUTHOR : DEFAULT_AUTHOR,
    DEFAULT_GRAPH : DEFAULT_GRAPH,
    DEFAULT_STORY_DATA : DEFAULT_STORY_DATA,
    DEFAULT_ATTR_DATA: DEFAULT_ATTR_DATA,
    DEFAULT_CHOICE_DATA: DEFAULT_CHOICE_DATA,
    DEFAULT_STORY: DEFAULT_STORY
}