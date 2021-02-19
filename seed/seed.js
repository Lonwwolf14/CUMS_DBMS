const mysql = require('mysql');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid').v4;

env.config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'cumsdbms',
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Mysql Connected');
});
// Database query promises
const zeroParamPromise = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

const queryParamPromise = (sql, queryParam) => {
  return new Promise((resolve, reject) => {
    db.query(sql, queryParam, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};
const relations = [
  'assignment_submission',
  'marks',
  'attendance',
  'assignment',
  'class',
  'fee',
  'staffCourse',
  'StudentCourses',
  'student',
  'staff',
  'course',
  'admin',
  'department',
];

const department_data = [
  { dept_id: 'ECE', d_name: 'Electronics and Communications Engineering' },
  { dept_id: 'CSE', d_name: 'Computer Engineering' },
  { dept_id: 'ICE', d_name: 'Instrumentation and Control Engineering' },
  { dept_id: 'IT', d_name: 'Information Technology' },
  { dept_id: 'BT', d_name: 'Bio-Technology' },
  { dept_id: 'MPAE', d_name: 'Manufacturing Processes and Automation' },
  { dept_id: 'ME', d_name: 'Mechanical Engineering' },
];

const ece_courses = [
  {
    semester: 1,
    c_id: 'ECE1',
    name: 'Electronic Engineering Materials',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ECE2',
    name: 'Electronics I',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ECE3',
    name: 'Digital Circuits and Systems',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ECE4',
    name: 'Electrical Machines',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE5',
    name: 'Mathematics III',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE6',
    name: 'Electronics II',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE7',
    name: 'Network Analysis and Synthesis',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE8',
    name: 'Signals and Systems',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE9',
    name: 'Electromagnetic Field Theory',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE10',
    name: 'Linear Integrated Circuits',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE11',
    name: 'Data Structures',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE12',
    name: 'Transmission Lines and Waveguides',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE13',
    name: 'Probability Theory and Communication',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE14',
    name: 'Control Systems',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ECE15',
    name: 'Digital Signal Processing',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ECE16',
    name: 'Digital Communication',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ECE17',
    name: 'Microprocessor and its Applications',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ECE18',
    name: 'Antenna and Wave Propagation',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ECE19',
    name: 'Microwave Engineering',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ECE20',
    name: 'VLSI',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ECE21',
    name: 'Computer Networks',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
];

const cse_courses = [
  {
    semester: 1,
    c_id: 'CSE1',
    name: 'Discrete Structures',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CSE2',
    name: 'Data Structures',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CSE3',
    name: 'Digital Logic Design',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CSE4',
    name: 'Analog and Digital Communication',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE5',
    name: 'Design and Analysis of Algorithms',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE6',
    name: 'Database Management Systems',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE7',
    name: 'Object Orientation',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE8',
    name: 'Computer Architecture and Organization',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE9',
    name: 'Analog Electronics',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE10',
    name: 'Microprocessors',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE11',
    name: 'Software Engineering',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE12',
    name: 'Computer Graphics',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE13',
    name: 'Computer Networking',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE14',
    name: 'Operating Systems',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSE15',
    name: 'Theory of Computation',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSE16',
    name: 'High Performance Computing',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSE17',
    name: 'Compiler Construction',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSE18',
    name: 'Modeling and Simulation',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'CSE19',
    name: 'Computer Control Systems',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'CSE20',
    name: 'IT Law and Ethics',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'CSE21',
    name: 'Open Source Technologies',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
];
const ice_courses = [
  {
    semester: 1,
    c_id: 'ICE1',
    name: 'Physics of Materials',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE2',
    name: 'Applied Mechanics',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE3',
    name: 'Signals and Systems',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE4',
    name: 'Power Apparatus',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE5',
    name: 'Electronic Instrumentation',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE6',
    name: 'Electronics',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE7',
    name: 'Engineering Graphics',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE8',
    name: 'Data Structures',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE9',
    name: 'Chemistry',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE10',
    name: 'Mathematics-III',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE11',
    name: 'Control System-I',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE12',
    name: 'Transducer & measurement',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE13',
    name: 'Industrial Electronics',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE14',
    name: 'Digital Circuits and Systems',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE15',
    name: 'Microprocessor and Microcontroller',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE16',
    name: 'Process Dynamics and Control',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE17',
    name: 'Analog and Digital Communication',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE18',
    name: 'Control System-II',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE19',
    name: 'Industrial Instrumentation',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE20',
    name: 'Robotics',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE21',
    name: 'Digital Signal Processing',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
];

const it_courses = [
  {
    semester: 1,
    c_id: 'IT1',
    name: 'Chemistry',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'IT2',
    name: 'Object Oriented Techniques',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'IT3',
    name: 'Analog and Digital Communication',
    c_type: 'Theory',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'IT4',
    name: 'Discrete Structure',
    c_type: 'Theory',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'IT5',
    name: 'Mathematics-II',
    c_type: 'Theory',
    dept_id: 'IT',
    credits: 4,
  },


  {
    semester: 2,
    c_id: 'IT5',
    name: 'Mathematics-III',
    c_type: 'Theory',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'IT6',
    name: 'Data Structure and Algorithm',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'IT7',
    name: 'Digital Circuits and Systems',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'IT8',
    name: 'Database Management System',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'IT9',
    name: 'Computer Graphics',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },


  {
    semester: 3,
    c_id: 'IT10',
    name: 'Probability and Stochastic Processes',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'IT11',
    name: 'Operating Systems',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'IT12',
    name: 'Computer System Architecture',
    c_type: 'Theory',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'IT13',
    name: 'Computer Networks',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'IT14',
    name: 'Software Engineering',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },


  {
    semester: 4,
    c_id: 'IT15',
    name: 'Multimedia & Applications',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'IT16',
    name: 'Theory of Computation',
    c_type: 'Theory',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'IT17',
    name: 'Design and Analysis of Algorithm',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'IT18',
    name: 'Linux/Unix Lab',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'IT19',
    name: 'Internet and Web Engineering',
    c_type: 'Theory',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'IT20',
    name: 'Compiler and Translator Design',
    c_type: 'Theory',
    dept_id: 'IT',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'IT21',
    name: 'Modeling and Simulation',
    c_type: 'Practical',
    dept_id: 'IT',
    credits: 4,
  },
];

const bt_courses = [
  {
    semester: 1,
    c_id: 'BT1',
    name: 'Physics of Materials',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT2',
    name: 'Advance Chemistry',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT3',
    name: 'Biostatistics',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT4',
    name: 'Introduction to Biotechnology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT5',
    name: 'Biochemistry',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT6',
    name: 'Microbiology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT7',
    name: 'Cell Biology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT8',
    name: 'Data Structure and Algorithms',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT9',
    name: 'Chemical Engg. Principles',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT10',
    name: 'Methods & Instrumentation in Biotechnology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT11',
    name: 'Molecular Biology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT12',
    name: 'Immunology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT13',
    name: 'Database Management Systems',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT14',
    name: 'Genetics',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT15',
    name: 'Recombinant DNA Technology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT16',
    name: 'Structural Biology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT17',
    name: 'Fundamentals of Biochemical Engineering',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT18',
    name: 'Enzymology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT19',
    name: 'Bioprocess Technology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT20',
    name: 'Plant & Animal Biotechnology',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'BT21',
    name: 'Downstream Processing',
    c_type: 'Theory',
    dept_id: 'BT',
    credits: 4,
  },
];
const mpae_courses = [
  {
    semester: 1,
    c_id: 'MPAE1',
    name: 'Chemistry',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE2',
    name: 'Engineering Mechanics',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE3',
    name: 'Workshop Technology',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE4',
    name: 'Engineering Graphics',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE5',
    name: 'Machine Drawing',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE6',
    name: 'Manufacturing Processes I',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE7',
    name: 'Mechanical Sciences',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE8',
    name: 'Control System',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE9',
    name: 'Mathematics III',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE10',
    name: 'Kinematics & Dynamics of Machinery',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE11',
    name: 'Mechanics of solids',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE12',
    name: 'Transducers and Measurements',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE13',
    name: 'Manufacturing Processes II',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE14',
    name: 'Science of Materials',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE15',
    name: 'Machine Tools, CNC and Automation',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE16',
    name: 'Metrology and Quality Control',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE17',
    name: 'Tool Design',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE18',
    name: 'Operations Research',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE19',
    name: 'Geometric Modeling',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE20',
    name: 'Applied Plasticity',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'MPAE21',
    name: 'Mechanical Design',
    c_type: 'Theory',
    dept_id: 'MPAE',
    credits: 4,
  },
];
const me_courses = [
  {
    semester: 1,
    c_id: 'ME1',
    name: 'Chemistry',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME2',
    name: 'Engineering Mechanics',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME3',
    name: 'Workshop Technology',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME4',
    name: 'Engineering Graphics',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME5',
    name: 'Machine Drawing',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME6',
    name: 'Manufacturing Processes-I',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME7',
    name: 'Mathematics - III',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME8',
    name: 'Thermal Engineering',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME9',
    name: 'Science of Materials',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME10',
    name: 'Kinematics & Dynamics of Machines',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME11',
    name: 'Mechanics of Solids',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME12',
    name: 'Fluid Mechanics',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME13',
    name: 'Manufacturing Processes-II',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME14',
    name: 'Management of Manufacturing Systems',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME15',
    name: 'Industrial Engineering',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME16',
    name: 'Refrigeration & Air- conditioning',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME17',
    name: 'Transducer and Measurement',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME18',
    name: 'Control Systems',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME19',
    name: 'Heat & Mass Transfer',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME20',
    name: 'Fluid Systems',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME21',
    name: 'Machine Element Design',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME22',
    name: 'Mechanical Vibration',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
];
const reset = async () => {
  try {
    await new Promise((r) => setTimeout(r, 2000)); // wait for mysql connection
    await zeroParamPromise('SET FOREIGN_KEY_CHECKS = 0');
    for (let i = 0; i < relations.length; ++i) {
      await zeroParamPromise('TRUNCATE TABLE ' + relations[i]);
      console.log(relations[i] + ' truncated');
    }
    await zeroParamPromise('SET FOREIGN_KEY_CHECKS = 1');

    // 1.Add Admin
    const hashedPassword = await bcrypt.hash('123456', 8);
    await queryParamPromise('insert into admin set ?', {
      admin_id: uuidv4(),
      name: 'Admin Boy1',
      email: 'admin1@gmail.com',
      password: hashedPassword,
    });
    // 2.Add departments
    for (let i = 0; i < department_data.length; ++i) {
      await queryParamPromise(
        'insert into department set ?',
        department_data[i]
      );
    }
    // 3.Add Courses
    for (let i = 0; i < ece_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', ece_courses[i]);
    }
    for (let i = 0; i < cse_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', cse_courses[i]);
    }
    for (let i = 0; i < ice_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', ice_courses[i]);
    }
    for (let i = 0; i < it_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', it_courses[i]);
    }
    for (let i = 0; i < bt_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', bt_courses[i]);
    }
    for (let i = 0; i < mpae_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', mpae_courses[i]);
    }
    for (let i = 0; i < me_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', me_courses[i]);
    }
    // 4.Add students
  } catch (err) {
    throw err;
  } finally {
    process.exit();
  }
};
reset();
