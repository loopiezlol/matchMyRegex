import React, { Component } from 'react';
import './App.css';
import RegexGame from './RegexGame.js';
import url from "../public/circle.png";
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: ['aa', 'aaa', 'aaaa'],
      edit: false,
      share: false,
    };
  };

  componentDidMount() {
    this.setOptionsFromUrl();
    this.changeBackground();
  };

  toggleEdit = () => {
    this.setState({
      edit: !this.state.edit,
    });
  };

  toggleShare = () => {
    this.setState({
      share: !this.state.share,
    });
  };

  handleSaveOptions = (options) => {
    this.setState({
      options,
      edit: false,
    });
  };

  handleCopy() {
    const input = document.getElementById("sharable");
    input.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      alert('please press Ctrl/Cmd+C to copy');
    }
  }

  setOptionsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const possibleParams = urlParams.getAll('option');
    if (possibleParams.length > 0) {
      this.setState({
        options: urlParams.getAll('option'),
      });
    }
  };

  generateSharableLink() {
    let url = window.location.origin + '?';
    const {options} = this.state;
    options.forEach(option => {
      url += `option=${option}&`
    });
    url = url.slice(0, -1);
    return url;
  };

  renderShare() {
    const {share} = this.state;
    if (share) {
      return (
        <div className="share-wrapper">
          <h1>Share your exercise:</h1>
          <input id="sharable" type="text" value={this.generateSharableLink()} readOnly />
          <button className="copy-button" onClick={this.handleCopy}>Copy</button>
        </div>
      )
    }
  };

  render() {
    const {options, edit} = this.state;
    return (
      <div className="card-wrapper">
        <h1> Match the following expressions:</h1>
        <RegexGame
          options={options}
          onInput={this.changeBackground}
          foundSrc={url}
          notFoundSrc={url}
          returnScore={true} />
        <button className="share" onClick={this.toggleShare}>share</button>
        <button className="edit" onClick={this.toggleEdit}>edit</button>
        <EditPanel
          className="edit-wrapper"
          options={options}
          open={edit}
          handleSaveOptions={this.handleSaveOptions} />
        {this.renderShare()}
      </div>
    );
  };

  changeBackground = (percent) => {
    if (typeof percent === 'number') {
      console.log(percent);
      const color1 = '66BB6A';
      const color2 = 'EF5350';

      const hex = (x) => {
          x = x.toString(16);
          return (x.length === 1) ? '0' + x : x;
      };
      const r = Math.ceil(parseInt(color1.substring(0,2), 16) * percent + parseInt(color2.substring(0,2), 16) * (1-percent));
      const g = Math.ceil(parseInt(color1.substring(2,4), 16) * percent + parseInt(color2.substring(2,4), 16) * (1-percent));
      const b = Math.ceil(parseInt(color1.substring(4,6), 16) * percent + parseInt(color2.substring(4,6), 16) * (1-percent));

      const color = '#' + hex(r) + hex(g) + hex(b);
      document.body.style.backgroundColor = color;
    } else {
      document.body.style.backgroundColor = "white";
    }

  };

}

const SortableItem = SortableElement(({value, handleChange, index}) => {
  return (
    <div className="option-wrapper" >
      <input className="option-input"
        id={index}
        value={value}
        type="text"
        onChange={handleChange}/>
      <button>Delete</button>
    </div>
  );
});

const SortableList = SortableContainer(({items, handleChange}) => {
    return (
        <div className="options-wrapper">
            {items.map((value, index) => {
              return (
                <SortableItem
                  key={`item-${index}`}
                  index={index}
                  value={value}
                  handleChange={handleChange} />
                )
              },
            )}
        </div>
    );
});

const EditPanel = React.createClass({
  propTypes: {
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    open: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      options: this.props.options.slice(),
    }
  },

  onSortEnd({oldIndex, newIndex}){
    const {options} = this.state;
    this.setState({
      options: arrayMove(options, oldIndex, newIndex)
    });
  },

  handleChange(event) {
    const {options} = this.state;
    const {id, value} = event.target;
    options[id] = value;
    this.setState({
      options,
    });
  },

  saveOptions() {
    const {handleSaveOptions} = this.props;
    const {options} = this.state;
    handleSaveOptions(options);
  },

  addOption() {
    const {options} = this.state;
    options.push(" ");
    this.setState({
      options,
    })
  },

  render() {
    const {options} = this.state;
    const {open} = this.props;
    const toggle = open ? "open" : '';
    return (
      <div className={`edit-wrapper ${toggle}`}>
        <SortableList
          items={options}
          onSortEnd={this.onSortEnd}
          handleChange={this.handleChange} />
        <div className="edit-options">
          <button onClick={this.saveOptions}>Save</button>
          <button onClick={this.addOption}>Add</button>
        </div>
      </div>
    )
  },
});

export default App;
