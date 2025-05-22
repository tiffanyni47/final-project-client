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
  studentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  addStudentForm: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#f0f0f5',
    borderRadius: '5px',
  },
}));

// Take in props data to construct the component
const CampusView = (props) => {
  const classes = useStyles();
  const { 
    campus,
    showAddForm,
    selectedStudentId,
    onToggleAddForm,
    onSelectStudent,
    onAddStudent,
    deleteCampus,
    removeStudent,
    allStudents,
  } = props;

  const unassignedStudents = allStudents?.filter(student => {
  const isUnassigned = !student.campusId;
  const isNotInCampus = !campus.students?.some(s => s.id === student.id);
  return isUnassigned && isNotInCampus;
}) || [];

  
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
      <br/>
      <h2>Student in {campus.name}</h2> 
      {campus.students && campus.students.length > 0 ? (
        campus.students.map( student => {
        let name = student.firstname + " " + student.lastname;
        return (
          <div key={student.id} style={{ display: "flex", alignItems: "center", gap: "10px" , justifyContent: "center" }}>
            <Link to={`/student/${student.id}`}>
              <h2>{name}</h2>
            </Link>     
              <button onClick={() => removeStudent(student.id)}>
                Remove
              </button>     
          </div> 
        );
      })) : (<h3>No students enrolled</h3>)}

      <button onClick={onToggleAddForm}>
        {showAddForm ? 'Cancel' : 'Add Student'}
      </button>

      {showAddForm && (
        <div className={classes.addStudentForm}>
          <h2>Add Exist Student</h2>
          <select
            value={selectedStudentId}
            onChange={(e) => onSelectStudent(e.target.value)}
          >
            <option value="">Select a student</option>
            {unassignedStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.firstname} {student.lastname}
              </option>
            ))}
          </select>
          <button
            onClick={() => onAddStudent(selectedStudentId)}
            disabled={!selectedStudentId}
          >
            Add Selected Student
          </button>
          <h2>Or</h2>
          <Link to="/newstudent">
            <button>Create New Student</button>
          </Link>
        </div>
      )}

      <br/>
      <br/>
      <Link to={`/campus/${campus.id}/edit/`}>
        <button>Edit Campus</button>
      </Link>
      <button onClick={() => deleteCampus(campus.id)}>Delete Campus</button>
    </div>
  );
};

export default CampusView;