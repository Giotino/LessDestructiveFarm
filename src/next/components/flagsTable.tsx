import React, { Component } from 'react';
import FlagModel from '../../lib/models/flag';
import FlagRow from './flagRow';

interface Props {
  flags?: FlagModel[];
}

class FlagsTable extends Component<Props> {
  render() {
    const { flags } = this.props;

    const rows = [];
    for (const flag of flags) rows.push(<FlagRow flag={flag} key={flag.flag} />);

    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr className="table-secondary">
              <th scope="col">Sploit</th>
              <th scope="col">Team</th>
              <th scope="col">Flag</th>
              <th scope="col">Time</th>
              <th scope="col">Status</th>
              <th scope="col">Checksystem Response</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

export default FlagsTable;
