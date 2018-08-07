const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-demo')
    .then(()=> console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String, 
  tags: [ String ],
  date: { type: Date, default: Date.now}, 
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course= new Course({
    name: 'Angular Course',
    author: 'Kumail Jawadi',
    tags: ['angular', 'frontend'],
    isPublished: true
  });

const result = await course.save();
console.log(result);
}

// createCourse();

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course
  .find({ isPublished: true, tags: 'backend' })
  // .find({price: {$gte: 10, $lte: 20}}) //  10<=price<=20
  // . find({price: {$in: [10, 15, 20]}})

  // Logical Expressions
  // .find().or([{author: 'Kumail'}, {isPublished: true}])

  // Regular Expressions
  // .find({author: /^Kumail/})  // Starts with Kumail
  // .find({author: /Kumail$/i})  // Ends with Kumail (is not case sensitive)
  // .find({author: /.*Kumail.*$/i}) // Contains Kumail (is not case sensitive)

  // Pagination
  // .skip((pageNumber - 1) * pageSize).limit(pageSize)

  .sort({ name: 1 })
  .select({ name: 1, author: 1 });
  console.log(courses);
}

// Update using Query-First approach
async function updateCourse(id){
  const course = await Course.findById(id);
  if(!course) return;
  course.set({
    author: 'Reza',
    isPublished: false
  });
  const result =  await course.save();
  console.log(result);
}

// Update using Update-First approach
// async function updateCourse(id){
//   const result = await Course.findByIdAndUpdate({ _id: id }, {
//   $set: { author: 'Kumail Jawadi' }
//   }, { new: true });
//   console.log(result);
// }

// getCourses();
updateCourse('5b67ea3f7944e92db0e2b565');