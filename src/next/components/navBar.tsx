import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-0">
        <img className="logo" src="/public/img/dvteam_white.png" />
        <div className="navbar-brand">Less Destructive Farm</div>
      </nav>
    );
  }
}

export default NavBar;
