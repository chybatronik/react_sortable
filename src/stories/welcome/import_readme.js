import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import contents from 'raw-loader!../../../README.md';

class Readme extends Component {
  render(){
    return (<ReactMarkdown source={contents} />)
  }
}

export default Readme;
