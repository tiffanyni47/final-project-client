/*==================================================
HomePageView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the home page.
================================================== */
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( () => ({
  formContainer:{  
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    gap: '30px', 
    padding: '20px',
  },
  formText:{
    fontWeight: 'bold',
    width: '300px',
    height: '300px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '25px',
    color: 'white',
  },
  textOverlay: {
    backgroundColor: 'rgba(58, 55, 55, 0.5)', 
    padding: '15px',
    borderRadius: '10px',
    width: '90%', 
  },
  campusLink: {
    backgroundImage: `url(${process.env.PUBLIC_URL}/AllCampus.jpg)`,
  },
  studentLink: {
    backgroundImage: `url(${process.env.PUBLIC_URL}/AllStudents.jpg)`,
  },
}));

const HomePageView = () => {
  const classes = useStyles();
  // Render Home page view
  return (
    <div>
      <br/>
      <h1>Home Page</h1>
      <div className={classes.formContainer}>
      <Link to="/campuses" className={`${classes.formText} ${classes.campusLink}`}>
        <div className={classes.textOverlay}>
          View all Campuses
        </div>
      </Link>
      <Link to="/students" className={`${classes.formText} ${classes.studentLink}`}>
        <div className={classes.textOverlay}>
          View all Students
        </div>
      </Link>
    </div>
    </div>
  );    
}

export default HomePageView;