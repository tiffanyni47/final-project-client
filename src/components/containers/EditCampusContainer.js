/*==================================================
EditCampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditCampusView from '../views/EditCampusView';
import { fetchCampusThunk, editCampusThunk } from '../../store/thunks';

class EditCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      name: "", 
      address: "", 
      description: "",
      imageUrl: "",
      errors: {},
      redirect: false,
      redirectId: null
    };
  }

  //Filled in form with existed data
  async componentDidMount() {
    const campusId = this.props.match.params.id;
    await this.props.fetchCampus(campusId);
  
    const { name, address, description, imageUrl } = this.props.campus;
    this.setState({
      name: name,
      address: address,
      description: description || "",
      imageUrl: imageUrl || ""
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

    let updatedCampus = {
        id: this.props.match.params.id,
        name: this.state.name,
        address: this.state.address,
        description: this.state.description || null,
        imageUrl: this.state.imageUrl || null,
    };

    try {
        await this.props.editCampus(updatedCampus);
        this.setState({
          redirect: true,
          redirectId: this.props.match.params.id
      });
      } 
    catch (error) {
        this.setState({errors: {...this.state.errors, form: 'Failed to edit campus'}});
      }
    }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render updated campus input form
  render() {
    // Redirect to updated campus' page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditCampusView 
          campus = {this.state}
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}   
          errors={this.state.errors}   
        />
      </div>          
    );
  }
}

// The following input argument is passed to the "connect" function used by "EditCampusContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => ({
    fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
    editCampus: (campus) => dispatch(editCampusThunk(campus))
  });

const mapState = (state) => {
  return {
    campus: state.campus,  // Get the State object from Reducer "campus"
  };
};

// Export store-connected container by default
// NewCampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);