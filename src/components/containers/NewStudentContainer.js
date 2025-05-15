/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "", 
      email: "",
      imageUrl: "",
      gpa: "",
      campusId: null, 
      redirect: false, 
      redirectId: null,
      errors: {}
    };
  }


  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  //Validation for inputs
  validate = () => {
    const { firstname, lastname, email, gpa, imageUrl } = this.state;
    const errors = {};
    
    if (!firstname) errors.firstname = 'Required';
    if (!lastname) errors.lastname = 'Required';
    if (!email) {
      errors.email = 'Required';
    } else if (!email.includes('@') || !email.includes('.')) {
      errors.email = 'Invalid email';
    }
    if (imageUrl && !/^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp))$/i.test(imageUrl)) {
      errors.imageUrl = 'Invalid URL';
    }
    if (gpa && (gpa < 0 || gpa > 4)) errors.gpa = 'Must be 0-4';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    //Do the validation first
    if (!this.validate()) {
      return;
    }

    let student = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        campusId: this.state.campusId,
        email: this.state.email || null,
        imageUrl: this.state.imageUrl || null,
        gpa: this.state.gpa || null
    };

    if (student.campusId && student.campusId != null){
      try {
        const response = await axios.get(`/api/campuses/${student.campusId}/exists`);
        if (!response.data.exists) {
          this.setState({ 
            errors: { ...this.state.errors, campusId: 'Campus ID does not exist' } 
          });
          return;
        }
      } 
      catch(error) {
        this.setState({ 
          errors: { ...this.state.errors, campusId: 'Error found, Please try again' } 
        });
      }
    }
    
    try{
      // Add new student in back-end database
      let newStudent = await this.props.addStudent(student);

      // Update state, and trigger redirect to show the new student
      this.setState({
        firstname: "", 
        lastname: "", 
        email: "",
        imageUrl: "",
        gpa: "",
        campusId: null,
        redirect: true, 
        redirectId: newStudent.id
      });
    } 
    catch(error) {
      this.setState({errors: {...this.state.errors, form: 'Failed to create student'}});
    }
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}   
          errors={this.state.errors}   
        />
      </div>          
    );
  }
}

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addStudent: (student) => dispatch(addStudentThunk(student)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(null, mapDispatch)(NewStudentContainer);