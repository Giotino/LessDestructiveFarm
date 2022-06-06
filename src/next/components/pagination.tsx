import React, { Component } from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageSelected: (page: number) => any;
}

interface State {
  currentPageText: string;
}

//Must be even
const MAX_PAGE_TO_SHOW = 5;

class Pagination extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPageText: props.currentPage.toString()
    };

    this.onCurrentPageInputChanged = this.onCurrentPageInputChanged.bind(this);
    this.onCurrentPageKeyDown = this.onCurrentPageKeyDown.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    //If searchParams object changed (needed for update on navigation)
    if (this.props.currentPage !== prevProps.currentPage)
      this.setState({
        currentPageText: this.props.currentPage.toString()
      });
  }

  onCurrentPageInputChanged(event: any) {
    this.setState({
      currentPageText: event.target.value
    });
  }

  onCurrentPageKeyDown(event: any) {
    if (event.key === 'Enter') this.props.onPageSelected(parseInt(this.state.currentPageText, 10));
  }

  render() {
    const half = Math.ceil(MAX_PAGE_TO_SHOW / 2);
    const firstShown = Math.max(1, this.props.currentPage - half);
    const lastShown = Math.min(this.props.totalPages, this.props.currentPage + half);

    const pageButtons = [];

    if (firstShown > 1)
      pageButtons.push(
        <li className="page-item" key={1}>
          <div className="page-link" onClick={() => this.props.onPageSelected(1)}>
            «
          </div>
        </li>
      );

    for (let i = firstShown; i < lastShown + 1; i++) {
      let classes = 'page-item';
      if (i == this.props.currentPage) {
        pageButtons.push(
          <li className="page-item active" key={i}>
            <div className="page-link pagination-current-page-container">
              <input
                type="text"
                className="pagination-current-page-input"
                onChange={this.onCurrentPageInputChanged}
                onKeyDown={this.onCurrentPageKeyDown}
                value={this.state.currentPageText}
              />
            </div>
          </li>
        );
      } else {
        pageButtons.push(
          <li className={classes} key={i}>
            <div className="page-link" onClick={() => this.props.onPageSelected(i)}>
              {i}
            </div>
          </li>
        );
      }
    }

    if (lastShown < this.props.totalPages)
      pageButtons.push(
        <li className="page-item" key={this.props.totalPages}>
          <div
            className="page-link"
            onClick={() => this.props.onPageSelected(this.props.totalPages)}
          >
            »
          </div>
        </li>
      );

    return <ul className="pagination pagination-sm">{pageButtons}</ul>;
  }
  S;
}

export default Pagination;
