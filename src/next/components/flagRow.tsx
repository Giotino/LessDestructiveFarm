import moment from 'moment';
import React, { StatelessComponent } from 'react';
import FlagModel from '../../lib/models/flag';

interface Props {
  flag: FlagModel;
}

const FlagRow: StatelessComponent<Props> = ({ flag }) => (
  <tr>
    <th scope="row">{flag.sploit}</th>
    <td>{flag.team}</td>
    <td>{flag.flag}</td>
    <td>{moment(flag.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
    <td>{flag.status}</td>
    <td>{flag.checksystem_response}</td>
  </tr>
);

export default FlagRow;
