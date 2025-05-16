/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( () => ({
  image:{
    width: '150px',
    height: '150px',
  },
}));

const StudentView = (props) => {
  const classes = useStyles();
  const { student } = props;

  // Render a single Student view 
  return (
    <div>
      <h1>{student.firstname + " " + student.lastname}</h1>
      <h3>Student ID: {student.id}</h3>
      {student.campus ? (<Link to={`/campus/${student.campusId}`}><h3>{student.campus.name}</h3></Link>) : (<h3>Currently not enroll to any campus</h3>)}
      <p>Email: {student.email}</p>
      {student.gpa ? (<p>GPA: {student.gpa}</p>) : (<p>Does not have a GPA</p>)}
      <img
        src = {!student.imageUrl || student.imageUrl === "default-student.jpg"
        ? `${process.env.PUBLIC_URL}/default-student.jpg`
        : student.imageUrl}
        alt="Student"
        className={classes.image}
      />

      <br/>
      <Link to={`/student/${student.id}/edit/`}>
        <button>Edit Student</button>
      </Link>
      <br/>
      <button onClick={() => props.deleteStudent(student.id)}>Delete Student</button>
    </div>
  );
};

export default StudentView;