/*==================================================
CampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { Component } from "react";
import { connect } from "react-redux";
import { 
  fetchCampusThunk,
  deleteCampusThunk 
} from "../../store/thunks";

import { CampusView } from "../views";
import { Redirect } from 'react-router-dom';

class CampusContainer extends Component {
  state = {
    redirect: false
  };
  // Get the specific campus data from back-end database
  componentDidMount() {
    // Get campus ID from URL (API link)
    this.props.fetchCampus(this.props.match.params.id);
  }

  handleDelete = () => {
    this.props.deleteCampus(this.props.match.params.id)
      .then(() => this.setState({ redirect: true })) 
      .catch(error => console.error('Delete failed:', error));
  };

  // Render a Campus view by passing campus data as props to the corresponding View component
  render() {
    if (this.state.redirect) {
      return <Redirect to="/campuses" />;
    }

    return (
      <div>
        <Header />
        <CampusView campus={this.props.campus} 
        deleteCampus={this.handleDelete}/>
      </div>
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "CampusContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "campus".
const mapState = (state) => {
  return {
    campus: state.campus,  // Get the State object from Reducer "campus"
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
    deleteCampus: (campusId) => dispatch(deleteCampusThunk(campusId),)
  };
};

// Export store-connected container by default
// CampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(CampusContainer);