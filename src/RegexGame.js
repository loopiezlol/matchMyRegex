import React from 'react';

const RegexGame = React.createClass({
  propTypes: {
    options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    matchColor: React.PropTypes.string,
    onInput: React.PropTypes.func,
    foundSrc: React.PropTypes.string,
    notFoundSrc: React.PropTypes.string,
    returnScore: React.PropTypes.bool,
    regexType: React.PropTypes.string,
  },

  getInitialState() {
    return {
      pattern: '',
    };
  },

  renderOptions() {
    const {options, foundSrc, notFoundSrc} = this.props;
    const {pattern} = this.state;
    return (
      options.map((option, index) => {
        return (
          <RegexOption
            className='regex-options'
            key={`option-${index}`}
            pattern={pattern}
            text={option}
            foundSrc={foundSrc}
            notFoundSrc={notFoundSrc} />
        );
      })
    );
  },

  render() {
    return (
      <div className='regex-game' >
        <div className='options-wrapper'>
          {this.renderOptions()}
        </div>
        <input className='input-bar' placeholder='Regular Expression'
          type='text' onChange={this.handleChange} />
      </div>
    );
  },

  handleChange(e) {
    const value = e.target.value;
    this.setState({
      pattern: value,
    });
    this.inputCallback(value);
  },

  getScore(options, pattern) {
    let re = '';
    let count = 0;
    try {
      re = new RegExp(pattern);
      options.forEach(option => {
        if(option.match(re)[0] === option) {
          count++;
        }
      });
    } catch (e){

    }

    return count/options.length;
  },

  inputCallback(pattern) {
    const {onInput, returnScore, options} = this.props;
    if (onInput && returnScore && pattern !== '') {
      onInput(this.getScore(options, pattern));
    } else if (onInput) {
      onInput();
    }
  },
});

const RegexOption = React.createClass({
  propTypes: {
    pattern: React.PropTypes.string,
    text: React.PropTypes.string,
    foundSrc: React.PropTypes.string,
    notFoundSrc: React.PropTypes.string,
  },

  getInitialState() {
    return {
      found: true,
    }
  },

  componentWillReceiveProps(nextProps) {
    const {text} = this.props;
    const type = this.props.regexType || 'g';
    let re = '';
    try {
      re = new RegExp(nextProps.pattern, type);
    } catch (e) {
    }
    this.setState({
      found: text.match(re)[0] === text,
    })
  },


  renderText() {
    const {pattern} = this.props;
    const matchColor = this.props.matchColor || 'green';
    const type = this.props.regexType || 'g';
    let {text} = this.props;

    if (pattern) {
      let re = '';
      try {
        re = new RegExp(pattern, type);
      } catch (e) {
      }
      text = text.replace(re, (match, x) => {
        return (`<span class="highlight" style="color:${matchColor}">${match}</span>`);
      });
    }
    return {
      __html: `${text}`
    }
  },

  renderCheck() {
    const {foundSrc, notFoundSrc, pattern} = this.props;
    const {found} = this.state;
    let url = foundSrc || '';
    let match = '';
    if (pattern && foundSrc && notFoundSrc) {
       url = found ? foundSrc : notFoundSrc;
       match = found ? 'match' : 'not-match';
     };
    return (
      <img role='presentation'
        className={`check ${match}`}
        src={url} />
    );
  },

  render() {
    return (
      <div className='option-wrapper'>
        <div dangerouslySetInnerHTML={this.renderText()} />
        {this.renderCheck()}
      </div>
    );
  },

});

export default RegexGame;
