import React, { Component } from 'react';
import { apolloClient, queries } from '../lib/graphql';
import { GameInfo } from '../lib/types';

interface Props {
  gameInfo: GameInfo;
  onSubmit: () => any;
}

interface State {
  text: string;
}

class ManualSubmission extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { text: '' };

    this.onTextChange = this.onTextChange.bind(this);
    this.onSendClick = this.onSendClick.bind(this);
  }

  onTextChange(event: any) {
    this.setState({ text: event.target.value });
  }

  async onSendClick() {
    const re = new RegExp(this.props.gameInfo.flagFormat, 'g');
    const matches = Array.from(this.state.text.matchAll(re));
    if (matches.length !== 0) {
      const flags = matches.map(r => r[0]);

      try {
        await apolloClient.query({
          query: queries.POST_FLAGS,
          variables: {
            flags
          }
        });

        this.setState({ text: '' });

        this.props.onSubmit();
      } catch (e) {
        console.error(e);
      }
    }
  }

  render() {
    return (
      <div className="col-lg-4 mt-3">
        <div className="card border-light">
          <div className="card-body">
            <h4 className="card-title">Add Flags Manually</h4>
            <label>
              Text with flags
              <small className="text-muted ml-2">
                flag format: {this.props.gameInfo.flagFormat}
              </small>
            </label>
            <textarea
              className="form-control form-control-sm mb-3 text-with-flags"
              onChange={this.onTextChange}
              value={this.state.text}
            ></textarea>
            <button className="btn btn-primary btn-sm" onClick={this.onSendClick}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ManualSubmission;
