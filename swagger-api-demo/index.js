// index.js
const express = require('express');
const setupSwagger = require('./swagger');
const jwt = require ('jsonwebtoken')
const authenticateToken = require('./auth');

const app = express();
app.use(express.json());
const users = [
  {id:1, username: 'Admin',password: '1234'},
  {id:2, username: 'Cami',password: '1234'},
  {id:3, username: 'Daniel',password: '1234'}
]

const students = [
  {
    "id": 1,
    "firstName": "Jose",
    "lastName": "Montaño",
    "age": 21,
    "email": "Jose@axity.com",
    "enrollmentNumber": "2024-001",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  },
  {
    "id": 2,
    "firstName": "Joshua",
    "lastName": "Hernandez",
    "age": 24,
    "email": "Jhernandez@axity.com",
    "enrollmentNumber": "2024-002",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  },
  {
    "id": 3,
    "firstName": "Ihoky",
    "lastName": "Almaraz",
    "age": 22,
    "email": "IAlmaraz@axity.com",
    "enrollmentNumber": "2024-001",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  }
]
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and get a JWT token
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
 
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
 
  const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token });
});

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve a list of items
 *     seucrity:
 *         - bearerAuth:[]
 *     responses:
 *       200:
 *         description: A list of items
 */
app.get('/items', authenticateToken,  (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(student => student.id ===id);

  if(student){
    res.status(200).json(student);
  }else{
    res.status(404).json({message: `No se encontro el id ${id}`});
  }
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     seucrity:
 *         - bearerAuth:[]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "The student's first name"
 *               lastName:
 *                 type: string
 *                 description: "The student's last name"
 *               age:
 *                 type: integer
 *                 description: "The student's age"
 *               email:
 *                 type: string
 *                 description: "The student's email address"
 *               enrollmentNumber:
 *                 type: string
 *                 description: "The student's enrollment number"
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                     courseName:
 *                       type: string
 *                     grade:
 *                       type: string
 *               status:
 *                 type: string
 *                 description: "The student's status"
 *                 example: "active"
*     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 enrollmentNumber:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                       courseName:
 *                         type: string
 *                       grade:
 *                         type: string
 *                 status:
 *                   type: string
 */
app.post('/items',authenticateToken, (req, res) => {
  const {firstName, lastName,age,email,enrollmentNumber,courses,status} = req.body;
  const studentObject = {
    id: students.length + 1,
    firstName,
    lastName,
    age,
    email,
    enrollmentNumber,
    courses,
    status
  }
  students.push(studentObject);
  res.status(201).json({ 
    message: 'Se ha agregado un estudiante',
    estudiante: studentObject
  });
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Retrieve a single item by ID
 *     seucrity:
 *         - bearerAuth:[]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single item
 */

app.get('/items/:id',authenticateToken, (req, res) => {
const {id} = req.body;
const studentID = id;
  res.status(200).json({ message: `GET request - Retrieve item with ID ${students.studentID}` });
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     seucrity:
 *         - bearerAuth:[]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "The student's first name"
 *               lastName:
 *                 type: string
 *                 description: "The student's last name"
 *               age:
 *                 type: integer
 *                 description: "The student's age"
 *               email:
 *                 type: string
 *                 description: "The student's email address"
 *               enrollmentNumber:
 *                 type: string
 *                 description: "The student's enrollment number"
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                     courseName:
 *                       type: string
 *                     grade:
 *                       type: string
 *               status:
 *                 type: string
 *                 description: "The student's status"
 *                 example: "active"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 */
app.put('/items/:id',authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(student => student.id ===id);

  if(studentIndex !==-1){
    const updateStudent = {... students[studentIndex], ...req.body};
    students[studentIndex] = updateStudent;
    res.status(200).json(updateStudent);
  }else{
    res.status(200).json({ message: `No se encontro el id ${id}` });
  }
  
 
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     seucrity:
 *         - bearerAuth:[]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
app.delete('/items/:id', authenticateToken,(req, res) => {

  res.status(200).json({ message: `DELETE request - Delete item with ID ${req.params.id}` });
});

// Setup Swagger
setupSwagger(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
