import React from 'react';

const RegexGame = React.createClass({
  propTypes: {
    options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    matchColor: React.PropTypes.string,
    onInput: React.PropTypes.func,
    foundSrc: React.PropTypes.string,
    notFoundSrc: React.PropTypes.string,
    returnScore: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      pattern: '',
    };
  },

  renderOptions() {
    const {options, foundSrc, notFoundSrc} = this.props;
    return (
      options.map(option => {
        return (
          <RegexOption pattern={this.state.pattern}
            text={option}
            foundSrc={foundSrc}
            notFoundSrc={notFoundSrc} />
        );
      })
    );
  },

  render() {
    return (
      <div className="regex-game" >
        <div className="options">
          {this.renderOptions()}
        </div>
        <input className="input-bar" placeholder="Regular Expression"
          type="text" onChange={this.handleChange} />
      </div>
    );
  },

  handleChange(e) {
    this.setState({
      pattern: e.target.value,
    });
    this.inputCallback(e.target.value);
  },

  getScore(options, pattern) {
    let re = new RegExp(pattern);
    let count = 0;
    options.forEach(option => {
      if(re.test(option)) {
        count++;
      }
    });
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
    const re = new RegExp(nextProps.pattern, "g");
    this.setState({
      found: this.props.text.match(re),
    })
  },


  renderText() {
    const pattern = this.props.pattern;
    const matchColor = this.props.matchColor || 'green';
    let text = this.props.text;

    if (pattern) {
      const re = new RegExp(pattern, "g")
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
    const found = this.state.found;
    let url = foundSrc || '';
    let match = '';
    if (pattern && foundSrc && notFoundSrc) {
       url = found ? foundSrc : notFoundSrc;
       match = found ? 'match' : "not-match";
     };
    return (
      <img role='presentation'
        className={`check ${match}`}
        src={url} />
    );
  },

  render() {
    return (
      <div className="option-wrapper">
        <div dangerouslySetInnerHTML={this.renderText()} />
        {this.renderCheck()}
      </div>
    );
  },

});

export default RegexGame;
