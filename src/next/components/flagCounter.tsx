import React, { StatelessComponent } from 'react';

interface Props {
  flagCount: number;
}

const FlagCounter: StatelessComponent<Props> = ({ flagCount }) => <p>Found {flagCount} flags</p>;

export default FlagCounter;
