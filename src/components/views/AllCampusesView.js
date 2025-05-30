/*==================================================
AllCampusesView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display all campuses.
================================================== */
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( () => ({
  image:{
    width: '300px',
  },
}));

const AllCampusesView = (props) => {
  const classes = useStyles();
  // If there is no campus, display a message.
  if (!props.allCampuses.length) {
    return (
    <div>
      <p>There are no campuses.</p>
      <Link to={`newcampus`}>
        <button>Add New Campus</button>
      </Link>
    </div>
    );
  }

  // If there is at least one campus, render All Campuses view 
  return (
    <div>
      <h1>All Campuses</h1>

      {props.allCampuses.map((campus) => (
        <div key={campus.id}>
          <Link to={`/campus/${campus.id}`}>
            <h2>{campus.name}</h2>
          </Link>
          <h4>campus id: {campus.id}</h4>
          <p>{campus.address}</p>
          <p>{campus.description}</p>
          <img
            src = {!campus.imageUrl || campus.imageUrl === "default-campus.jpg"
            ? `${process.env.PUBLIC_URL}/default-campus.jpg`
            : campus.imageUrl}
            alt="campus"
            className={classes.image}
          />
          <br/>
          <button onClick={() => props.deleteCampus(campus.id)}>Delete</button>
          <hr/>
        </div>
      ))}
      <br/>
      <Link to={`newcampus`}>
        <button>Add New Campus</button>
      </Link>
      <br/><br/>
    </div>
  );
};

// Validate data type of the props passed to component.
AllCampusesView.propTypes = {
  allCampuses: PropTypes.array.isRequired,
};

export default AllCampusesView;