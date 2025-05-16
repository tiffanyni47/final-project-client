/*==================================================
EditStudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to edit the information of a student that is currently in the database.
================================================== */
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// Create styling for the input form
const useStyles = makeStyles( () => ({
  formContainer:{  
    width: '500px',
    backgroundColor: '#f0f0f5',
    borderRadius: '5px',
    margin: 'auto',
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    textDecoration: 'none'
  }, 
  customizeAppBar:{
    backgroundColor: '#11153e',
    shadows: ['none'],
  },
  formTitle:{
    backgroundColor:'#c5c8d6',
    marginBottom: '15px',
    textAlign: 'center',
    borderRadius: '5px 5px 0px 0px',
    padding: '3px'
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '0.75rem',
    marginTop: '4px',
    marginLeft: '14px'
  },
}));

const EditStudentView = (props) => {
  const {student, handleChange, handleSubmit, errors} = props;
  const classes = useStyles();

  // Render Student view with an input form
  return (
    <div>
      <h1>Edit Student</h1>

      <div className={classes.root}>
        <div className={classes.formContainer}>
          <div className={classes.formTitle}>
            <Typography style={{fontWeight: 'bold', fontFamily: 'Courier, sans-serif', fontSize: '20px', color: '#11153e'}}>
              Update Student Information
            </Typography>
          </div>
          <form style={{textAlign: 'center'}} onSubmit={(e) => handleSubmit(e)}>
            <label style= {{color:'#11153e', fontWeight: 'bold'}}>First Name: </label>
            <input type="text" name="firstname" value={student.firstname} onChange ={(e) => handleChange(e)} /> {errors.firstname && <div className={classes.errorText}>{errors.firstname}</div>}
            <br/>
            <br/>

            <label style={{color:'#11153e', fontWeight: 'bold'}}>Last Name: </label>
            <input type="text" name="lastname" value={student.lastname} onChange={(e) => handleChange(e)} /> {errors.lastname && <div className={classes.errorText}>{errors.lastname}</div>}
            <br/>
            <br/>

            <label style={{color:'#11153e', fontWeight: 'bold'}}>Campus Id: </label>
            <input type="number" name="campusId" value={student.campusId} onChange={(e) => handleChange(e)} /> {errors.campusId && <div className={classes.errorText}>{errors.campusId}</div>}
            <br/>
            <br/>

            <label style={{color:'#11153e', fontWeight: 'bold'}}>Email: </label>
            <input type="text" name="email" value={student.email} onChange={(e) => handleChange(e)} /> {errors.email && <div className={classes.errorText}>{errors.email}</div>}
            <br/>
            <br/>

            <label style={{color:'#11153e', fontWeight: 'bold'}}>GPA: </label>
            <input type="number" name="gpa" step="0.01" value={student.gpa} onChange={(e) => handleChange(e)} /> {errors.gpa && <div className={classes.errorText}>{errors.gpa}</div>}
            <br/>
            <br/>

            <label style={{color:'#11153e', fontWeight: 'bold'}}>Image URL: </label>
            <input type="text" name="imageUrl" value={student.imageUrl} onChange={(e) => handleChange(e)} /> {errors.imageUrl && <div className={classes.errorText}>{errors.imageUrl}</div>}
            <br/>
            <br/>

            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
            {errors.form && <div className={classes.errorText}>{errors.form}</div>}
            <br/>
            <br/>
          </form>
          </div>
      </div>
    </div>    
  )
}

export default EditStudentView;