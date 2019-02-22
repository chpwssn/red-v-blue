import React, { Component } from 'react';
import flagIcon from './flag.svg';
import request from 'request';
import moment from 'moment';
import './App.scss';

interface IFlag {
  owner: string;
  score: Number;
  key: string;
}

interface IAppState {
  flags: IFlag[];
  lastFetch: Date | null;
}

class App extends Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      flags: [],
      lastFetch: null
    }
  }

  componentDidMount = () => {
    this.updateScores()
  }

  updateScores = () => {
    var apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
    var options = {
      url: `http://${apiEndpoint}/v1/query/common/${process.env.REACT_APP_CHAINCODE}/queryAllFlags`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    };

    request(options, (error: any, response: any, body: any) => {
      if (!error && response.statusCode == 200) {
        const flags: IFlag[] = JSON.parse(body).data.map((entry: any) => (
          {
            key: entry.Key,
            score: entry.Record.count,
            owner: entry.Record.owner
          }
        ))
        this.setState({ flags, lastFetch: new Date() })
        setTimeout(() => this.updateScores(), 1000)
      }
    });
  }

  render() {
    const { flags, lastFetch } = this.state;
    return (
      <div className="App">
        <div className="scores">
          {
            flags && flags.map((flag: IFlag) => (
              <div className="flag" key={flag.key}>
                <img src={flagIcon} className={flag.owner === "Red" ? 'red-flag' : 'blue-flag'} alt="flag" />
                <p>{flag.owner}</p>
                <p>{flag.score} points</p>
              </div>
            ))
          }
        </div>
        <div className="footer">
          <p>Scores last fetched {lastFetch ? moment(lastFetch).fromNow() : "never"}.</p>
        </div>
      </div>
    );
  }
}

export default App;
