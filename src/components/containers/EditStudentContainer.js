/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import EditStudentView from '../views/EditStudentView';
import { fetchStudentThunk, editStudentThunk } from '../../store/thunks';

class EditStudentContainer extends Component {
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
      errors: {},
      redirect: false,
      redirectId: null
    };
  }

  //Filled in form with existed data
  async componentDidMount() {
    const studentId = this.props.match.params.id;
    await this.props.fetchStudent(studentId);
  
    const { firstname, lastname, email, gpa, campusId, imageUrl } = this.props.student;
    this.setState({
      firstname: firstname,
      lastname: lastname,
      email: email,
      gpa: gpa || "",
      campusId: campusId || "",
      imageUrl: imageUrl || "",
    });
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

    let updatedstudent = {
        id: this.props.match.params.id,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        campusId: this.state.campusId,
        email: this.state.email || null,
        imageUrl: this.state.imageUrl || null,
        gpa: this.state.gpa || null
    };

 
if (updatedstudent.campusId && updatedstudent.campusId != null) {
    try {
      const response = await axios.get(`/api/campuses/${updatedstudent.campusId}`);
      if (!response.data) {
        this.setState({ 
          errors: { ...this.state.errors, campusId: 'Campus ID does not exist' } 
        });
        return;
      }
    } 
    catch(error) {
      this.setState({ 
        errors: { ...this.state.errors, campusId: 'Error verifying campus ID' } 
      });
      return;
    }
  }

    try {
        await this.props.editStudent(updatedstudent);
        this.setState({
          redirect: true,
          redirectId: this.props.match.params.id
      });
      } 
    catch (error) {
        this.setState({errors: {...this.state.errors, form: 'Failed to edit student'}});
      }
    }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render updated student input form
  render() {
    // Redirect to updated student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditStudentView 
          student = {this.state}
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}   
          errors={this.state.errors}   
        />
      </div>          
    );
  }
}

// The following input argument is passed to the "connect" function used by "EditStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => ({
    fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
    editStudent: (student) => dispatch(editStudentThunk(student))
  });

const mapState = (state) => {
  return {
    student: state.student,  // Get the State object from Reducer "student"
  };
};

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);