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
  deleteCampusThunk,
  editStudentThunk,  
  fetchAllStudentsThunk 
} from "../../store/thunks";

import { CampusView } from "../views";
import { Redirect } from 'react-router-dom';

class CampusContainer extends Component {
  state = {
    redirect: false,
    showAddForm: false,          
    selectedStudentId: '',       
  };
  // Get the specific campus data from back-end database
  componentDidMount() {
    // Get campus ID from URL (API link)
    this.props.fetchCampus(this.props.match.params.id);
    this.props.fetchAllStudents()
  }

  //If delete campus happens, redirect to the all campus view
  handleDelete = () => {
    this.props.deleteCampus(this.props.match.params.id)
      .then(() => this.setState({ redirect: true }));
  };


  //If delete a student, the student's campusId should be set to new and disappear from the current campus 
  handleRemoveStudent = (studentId) => {
    this.props.editStudent({id: studentId, campusId: null})
      .then(() => this.props.fetchCampus(this.props.match.params.id))
      .then(() => this.props.fetchAllStudents()); 
  };

  //Add student(that does not have a campus yet) to the campus
  handleSelectStudent = (studentId) => {
    this.setState({selectedStudentId: studentId});
  };
  handleAddStudent = (studentId) => {
    this.props.editStudent({id: studentId, campusId: this.props.match.params.id})
      .then(() => {
        this.setState({selectedStudentId: '', showAddForm: false});
        this.props.fetchCampus(this.props.match.params.id);
        this.props.fetchAllStudents();
      });
  };

  //Form to add a new student to the campus
  toggleAddForm = () => {
    this.setState(prev => ({ showAddForm: !prev.showAddForm }));
  };

  // Render a Campus view by passing campus data as props to the corresponding View component
  render() {
    if (this.state.redirect) {
      return <Redirect to="/campuses" />;
    }

    return (
      <div>
        <Header />
        <CampusView
          campus={this.props.campus}
          allStudents={this.props.allStudents}
          showAddForm={this.state.showAddForm}
          selectedStudentId={this.state.selectedStudentId}
          onToggleAddForm={this.toggleAddForm}
          onSelectStudent={this.handleSelectStudent}
          onAddStudent={this.handleAddStudent}
          deleteCampus={this.handleDelete}
          removeStudent={this.handleRemoveStudent}
        />
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
    allStudents: state.allStudents 
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
    deleteCampus: (campusId) => dispatch(deleteCampusThunk(campusId),),
    editStudent: (student) => dispatch(editStudentThunk(student)),  
    fetchAllStudents: () => dispatch(fetchAllStudentsThunk())  
  };
};

// Export store-connected container by default
// CampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(CampusContainer);