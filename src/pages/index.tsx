import Head from 'next/head';
import Router from 'next/router';
import React, { Component } from 'react';
import { GameInfo, SearchParams, SearchValues } from 'src/next/lib/types';
import FlagModel from '../lib/models/flag';
import FlagCounter from '../next/components/flagCounter';
import FlagsTable from '../next/components/flagsTable';
import ManualSubmission from '../next/components/manualSubmission';
import NavBar from '../next/components/navBar';
import Pagination from '../next/components/pagination';
import Search from '../next/components/search';
import { apolloClient, queries } from '../next/lib/graphql';

interface Props {
  query: any;
  totalFlags: number;
  searchParams: SearchParams;
  searchValues: SearchValues;
  flags?: FlagModel[];
  gameInfo: GameInfo;
}

const FLAGS_PER_PAGE = 30;

export default class extends Component<Props> {
  static async getInitialProps({ req, res, query }): Promise<Props> {
    try {
      if (!query.page) query.page = '1';

      const offset = (parseInt(query.page, 10) - 1) * FLAGS_PER_PAGE;

      const { sploit, team, status, flag, since, until, checksystem_response } = query;

      const result = await apolloClient.query({
        query: queries.GET_ALL_DATA,
        variables: {
          offset,
          limit: FLAGS_PER_PAGE,
          sploit,
          team,
          status,
          flag,
          since: new Date(since),
          until: new Date(until),
          checksystem_response
        }
      });

      if (result.errors) throw JSON.stringify(result.errors);

      return {
        totalFlags: parseInt(result.data.getFlagCount, 10),
        flags: result.data.getFlags,
        searchParams: query,
        searchValues: result.data.getSearchValues,
        gameInfo: result.data.getGameInfo,
        query
      };
    } catch (e) {
      if (e.networkError && e.networkError.result)
        console.error(JSON.stringify(e.networkError.result));
      else console.error(e);
    }
  }

  resetSearch() {
    Router.push('/');
  }

  updateQuery(newElements: any, resetPage: boolean = false) {
    const query = {
      ...this.props.query,
      ...newElements
    };

    if (resetPage) query.page = 1;

    //Remove empty params
    for (const item in query) if (!query[item]) delete query[item];

    Router.push({ pathname: '/', query });
  }

  render() {
    const {
      totalFlags,
      flags,
      query
    } = this.props;

    const pages = Math.ceil(totalFlags / FLAGS_PER_PAGE);
    const currentPage = parseInt(query.page, 10);

    return (
      <>
        <Head>
          <title>Less Destructive Farm</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <NavBar />
        <div className="container mt-4">
          <div className="row mb-4">
            <Search
              gameInfo={this.props.gameInfo}
              searchParams={this.props.searchParams}
              searchValues={this.props.searchValues}
              onSearch={(params: any) => this.updateQuery(params, true)}
              onReset={() => this.resetSearch()}
            />

            <ManualSubmission
              gameInfo={this.props.gameInfo}
              onSubmit={() => this.updateQuery({})}
            />
          </div>
          <div className="search-results">
            <FlagCounter flagCount={totalFlags} />
            <Pagination
              totalPages={pages}
              currentPage={currentPage}
              onPageSelected={(page: number) => this.updateQuery({ page })}
            />
            <FlagsTable flags={flags} />
            <Pagination
              totalPages={pages}
              currentPage={currentPage}
              onPageSelected={(page: number) => this.updateQuery({ page })}
            />
          </div>
        </div>
      </>
    );
  }
}
