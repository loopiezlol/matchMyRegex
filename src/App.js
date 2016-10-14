import React, { Component } from 'react';
import './App.css';
import RegexGame from './RegexGame.js';
import url from '../public/circle.png';
import sortIcon from '../public/sort-arrows.png';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: ['aa', 'aaa', 'aaaa', 'asd'],
      edit: false,
      share: false,
    };
  };

  componentDidMount() {
    this.setOptionsFromUrl();
    this.changeBackground();
    this.resizeContainer();
  };

  componentDidUpdate(){
    this.resizeContainer();
  }

  toggleEdit = () => {
    this.setState({
      edit: !this.state.edit,
      share: false,
    });
  };

  toggleShare = () => {
    this.setState({
      share: !this.state.share,
      edit: false,
    });
  };

  handleSaveOptions = (options) => {
    this.setState({
      options: options.filter(Boolean),
      edit: false,
    });
  };

  handleCopy() {
    const input = document.getElementById('sharable');
    input.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      alert('Please press Ctrl/Cmd+C to copy :(');
    }
  }

  setOptionsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const possibleParams = urlParams.getAll('option');
    if (possibleParams.length > 0) {
      this.setState({
        options: urlParams.getAll('option').filter(Boolean),
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
        <div className='share-screen'>
          <h1>Share your exercise:</h1>
          <input id='sharable' ref='sharable' type='text' value={this.generateSharableLink()} autoFocus  />
          <button className='copy' onClick={this.handleCopy}>Copy</button>
        </div>
      )
    }
  };


  render() {
    const {options, edit, share} = this.state;
    const toggleShare = share ? ' open' : '';
    const toggleHide = share ? ' hide' : '';
    return (
      <div className='exercise frame-wrapper'>
        <h1 className={`title${toggleHide}`}> Match the following expressions:</h1>
        <RegexGame
          options={options}
          onInput={this.changeBackground}
          foundSrc={url}
          notFoundSrc={url}
          returnScore={true} />
        <button className='share' onClick={this.toggleShare}>share</button>
        <button className='edit' onClick={this.toggleEdit}>edit</button>
        <EditPanel
          options={options}
          open={edit}
          handleSaveOptions={this.handleSaveOptions}
          resizeContainer={this.resizeContainer} />
        <div className={`sharing-overlay${toggleShare}`}>
          {this.renderShare()}
        </div>
      </div>
    );
  };

  changeBackground = (percent) => {
    if (typeof percent === 'number') {
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
      document.body.style.backgroundColor = 'white';
    }

  };

  resizeContainer = () => {
    let options = document.getElementsByClassName('options-wrapper');
    const max = Math.max(...[].slice.call(options).map((o => {
      let x = window.getComputedStyle(o).height;
      return x.substring(0, x.length - 2);
    })));

    let frames = document.getElementsByClassName('frame-wrapper');
    for (let i = 0; i < frames.length; i++) {
      frames[i].style.height = (max + 200) + 'px';
    }
  };

}

const SortableItem = SortableElement(({value, handleChange, handleDelete, index}) => {

  return (
    <div className='option-edit-wrapper' >
      <img role='presentation'
        src={sortIcon}
        className='sort-icon' />
      <input className='option-input'
        id={index}
        value={value}
        type='text'
        onChange={handleChange} />
      <input type='button' id={index} className='delete-button' onClick={handleDelete} value='Delete' />
    </div>
  );
});

const SortableList = SortableContainer(({items, handleChange, handleDelete}) => {
    return (
        <div className='options-wrapper'>
            {items.map((value, index) => {
              return (
                <SortableItem
                  key={`item-${index}`}
                  index={index}
                  value={value}
                  handleChange={handleChange}
                  handleDelete={handleDelete} />
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
    resizeContainer: React.PropTypes.func,
    handleSaveOptions: React.PropTypes.func,
  },

  getInitialState() {
    return {
      options: this.props.options.slice(),
    }
  },

  componentDidUpdate() {
    this.props.resizeContainer();
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

  handleDelete(event) {
    let options = this.state.options;
    const {id} = event.target;
    options.splice(id, 1);
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
    options.push('');
    this.setState({
      options,
    })
  },

  render() {
    let {options} = this.state;
    const {open} = this.props;
    const toggle = open ? 'open' : '';
    return (
      <div className={`editor frame-wrapper ${toggle}`}>
        <h1>Craft your own exercise:</h1>
        <SortableList
          items={options}
          onSortEnd={this.onSortEnd}
          handleChange={this.handleChange}
          handleDelete={this.handleDelete} />
        <div className='edit-options'>
          <button onClick={this.addOption}>Add</button>
          <button onClick={this.saveOptions}>Save</button>
        </div>
      </div>
    )
  },
});

export default App;
