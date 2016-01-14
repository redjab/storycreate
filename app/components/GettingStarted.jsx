import React from 'react';

class GettingStarted extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='main-content container'>
        <h1>Getting Started</h1>
        <ul>
          <li><a href='#start'>Writing a Simple Story</a></li>
          <li><a href='#usage'>Using StoryCreate</a></li>
          <li><a href='#terms'>Terminology</a></li>
          <li><a href='#faq'>FAQs</a></li>
        </ul>
        <h2 id="start">Writing a Simple Story</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis ullamcorper mi, eget venenatis neque. Donec facilisis id quam eu dignissim. Duis pretium velit nec est molestie, consequat maximus tellus gravida. Sed ac pretium sapien. Morbi tincidunt sem at venenatis consequat. 
        </p>
        <img className='front-img' src="../../img/placeholder.png"></img>
        <img className='front-img' src="../../img/placeholder.png"></img>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis ullamcorper mi, eget venenatis neque. Donec facilisis id quam eu dignissim. Duis pretium velit nec est molestie, consequat maximus tellus gravida. Sed ac pretium sapien. Morbi tincidunt sem at venenatis consequat. 
        </p>

        <h2 id="usage">Using StoryCreate</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis ullamcorper mi, eget venenatis neque. Donec facilisis id quam eu dignissim. Duis pretium velit nec est molestie, consequat maximus tellus gravida. Sed ac pretium sapien. Morbi tincidunt sem at venenatis consequat.
        </p>
        <img className='front-img' src="../../img/placeholder.png"></img>
        <img className='front-img' src="../../img/placeholder.png"></img>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis ullamcorper mi, eget venenatis neque. Donec facilisis id quam eu dignissim. Duis pretium velit nec est molestie, consequat maximus tellus gravida. Sed ac pretium sapien. Morbi tincidunt sem at venenatis consequat.
        </p>

        <h2 id="terms">Terminology</h2>
        <h3>Attribute & Condition</h3>
        <p>
Using attributes and conditions can add depth and consequences to your story. <strong>Attributes</strong> are stats that the story keeps track of during a reader's play through. <strong>Conditions</strong> are the requirements to display a choice or not. 
        </p>
        <p>
Take an example,  you set a Yes/No attribute <strong>Help A Friend</strong>, default as No. Earlier in the story, the reader get a choice of whether or not to help a friend with his homework. If the reader chooses to help him, you can then <strong>modify</strong> the <strong>Help A Friend</strong> attribute to Yes.  Later on, the reader runs into a situation where he needs a ride. At this point, you can create a choice called <strong>Ask Your Friend For Help</strong>, but make a <strong>condition</strong> that this choice is only shown if the attribute <strong>Help A Friend</strong> is Yes. This means if the reader chooses to not help his friend earlier, then the choice is not shown to him.
        </p>
        <h3>Persistent Attribute</h3>
        <p>
By default, all attributes are non-persistent, meaning that every time the reader restarts his play through, all attributes will be resetted to their default values.
        </p>
        <p>
<strong>Persistent attributes</strong>, on the other hand, are kept through multiple playthroughs. So even if the reader restarts, all persistent attributes still keep their current values.
        </p>
        <p>
For example, you are writing a story about betrayal and rebirth. You set a persistent attribute <strong>Killed By A</strong>, default to No. In one play through, the reader got killed by A, so at this point you set <strong>Killed By A</strong> to Yes. The reader restarts the story, but <strong>Killed By A</strong> is still Yes at this point since it's persistent, so you can show him a choice of watching out for A this time around (using conditions).
      </p>
        <h2 id="faq">FAQs</h2>
      </div>
    );
  }
}

export default GettingStarted;
