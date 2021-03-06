const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-demo')
    .then(()=> console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
    minlength: 5,
    maxlength: 255
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true
  },
  author: String, 
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
    },
    message: 'A course should have at least one tag.'
    }
  },
  date: { type: Date, default: Date.now}, 
  isPublished: Boolean,
  price: {
    type: Number,
    required: function(){ return this.isPublished },
    min: 10,
    max:200
    get: v=> Math.round(v),
    set: v=> Math.round(v),
  }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course= new Course({
    name: 'PHP Laravel Course',
    category: 'web',
    author: 'Belal',
    tags: ['php','laravel', 'backend'],
    isPublished: true,
    price: 100,
  });

try{
const result = await course.save();
console.log(result);
}
catch(ex){
  for(field in ex.errors)
    console.log(ex.errors[field].message);
}
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

async function removeCourse(id){
  // const result = await Course.deleteOne({ _id: id });
  // const result = await Course.deleteMany({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

createCourse();
// getCourses();
// updateCourse('5b67ea3f7944e92db0e2b565');
// removeCourse('5b67ea3f7944e92db0e2b565');