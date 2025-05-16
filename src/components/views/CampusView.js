/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( () => ({
  image:{
    width: '300px',
  },
}));

// Take in props data to construct the component
const CampusView = (props) => {
  const classes = useStyles();
  const {campus} = props;
  
  // Render a single Campus view with list of its students
  return (
    <div>
      <h1>{campus.name}</h1>
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      <img
        src = {!campus.imageUrl || campus.imageUrl === "default-campus.jpg"
        ? `${process.env.PUBLIC_URL}/default-campus.jpg`
        : campus.imageUrl}
        alt="campus"
        className={classes.image}
      />
      {campus.students && campus.students.length > 0 ? (
        campus.students.map( student => {
        let name = student.firstname + " " + student.lastname;
        return (
          <div key={student.id}>
            <Link to={`/student/${student.id}`}>
              <h2>{name}</h2>
            </Link>             
          </div>
        );
      })) : (<h3>No students enrolled</h3>)}
      <br/>
      <Link to={`/campus/${campus.id}/edit/`}>
        <button>Edit Campus</button>
      </Link>
      <br/>
      <button onClick={() => props.deleteCampus(campus.id)}>Delete Campus</button>
    </div>
  );
};

export default CampusView;