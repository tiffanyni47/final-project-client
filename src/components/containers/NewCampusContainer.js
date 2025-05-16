/*==================================================
NewCampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewCampusView from '../views/NewCampusView';
import { addCampusThunk } from '../../store/thunks';

class NewCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      name: "", 
      address: "",
      description: "",
      imageUrl: "",
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
    const { name, address, imageUrl } = this.state;
    const errors = {};
    
    if (!name) errors.name = 'Required';
    if (!address) errors.address = 'Required';
    if (imageUrl && !/^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp))$/i.test(imageUrl)) {
      errors.imageUrl = 'Invalid URL';
    }

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

    let campus = {
        name: this.state.name,
        address: this.state.address,
        description: this.state.description || null,
        imageUrl: this.state.imageUrl || null,
    };
    
    try{
      // Add new campus in back-end database
      let newCampus = await this.props.addCampus(campus);

      // Update state, and trigger redirect to show the new campus
      this.setState({
        name: "", 
        address: "", 
        description: "",
        imageUrl: "",
        redirect: true, 
        redirectId: newCampus.id
      });
    } 
    catch(error) {
      this.setState({errors: {...this.state.errors, form: 'Failed to create campus'}});
    }
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new campus input form
  render() {
    // Redirect to new campus' page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewCampusView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}   
          errors={this.state.errors}   
        />
      </div>          
    );
  }
}

// The following input argument is passed to the "connect" function used by "NewCampusContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addCampus: (campus) => dispatch(addCampusThunk(campus)),
    })
}

// Export store-connected container by default
// NewCampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(null, mapDispatch)(NewCampusContainer);