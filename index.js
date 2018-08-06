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

async function createCourse() {
  const Course = mongoose.model('Course', courseSchema);
  const course= new Course({
    name: 'Angular Course',
    author: 'Kumail Jawadi',
    tags: ['angular', 'frontend'],
    isPublished: true
  });

const result = await course.save();
console.log(result);
}

createCourse();
// async function getCourses() {
//   return await Course
//   .find({ isPublished: true, tags: 'backend' })
//   .sort({ name: 1 })
//   .select({ name: 1, author: 1 });
// }

// async function run() {
//   const courses = await getCourses();
//   console.log(courses);
// }
