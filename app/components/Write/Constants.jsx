const MAX_CHAR_TITLE = 17;
const MAX_CHAR_PASSAGE = 125;
const MAX_CHAR_CHOICE = 17;

const DEFAULT_TITLE = "Untitled";
const DEFAULT_PASSAGE = "Double click here to start writing and add choices. To branch your story, add a choice to this passage, and drag from the choice to a new passage."
const DEFAULT_PASSAGE_SHORTENED = DEFAULT_PASSAGE.substring(0, MAX_CHAR_PASSAGE) + "...";
const PASSAGE_HEIGHT = 150;
const PASSAGE_WIDTH = 130;

const PASSAGE_FIRST_POSITION_X = 80;
const PASSAGE_FIRST_POSITION_Y = 80;
const PASSAGE_TRANSLATE_X = 150;

const CHOICE_HEIGHT = 30;
const CHOICE_WIDTH = PASSAGE_WIDTH;
const DEFAULT_CHOICE = "";

const DEFAULT_STORY_NAME = "Untitled";
const DEFAULT_AUTHOR = "Anonymous";
const DEFAULT_GRAPH = DEFAULT_STORY_NAME + "_graph";
const DEFAULT_STORY_DATA = DEFAULT_STORY_NAME + "_story";
const DEFAULT_ATTR_DATA = DEFAULT_STORY_NAME + "_attribute";
const DEFAULT_CHOICE_DATA = DEFAULT_STORY_NAME + "_choice";
const DEFAULT_LINK_TO = {conditions: [], events: []};
const DEFAULT_STORY = {
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
    DEFAULT_LINK_TO: DEFAULT_LINK_TO,
    DEFAULT_STORY: DEFAULT_STORY,
}