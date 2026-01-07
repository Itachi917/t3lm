
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@university.edu' },
    update: {},
    create: {
      email: 'student@university.edu',
      name: 'Alex Student',
      password: hashedPassword,
      role: 'STUDENT',
      points: 120,
      level: 2,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    },
  })

  // 2. Create Staff
  await prisma.staff.createMany({
    data: [
      {
        name: 'Dr. Sarah Connor',
        role: 'Professor',
        email: 'sarah.connor@university.edu',
        location: 'Building A, Room 302',
        bio: 'Expert in Artificial Intelligence and Machine Learning.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        timetable: 'Mon/Wed 10:00-12:00'
      },
      {
        name: 'Mr. John Smith',
        role: 'Teaching Assistant',
        email: 'john.smith@university.edu',
        location: 'Lab 4',
        bio: 'Specializes in Web Development and React.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        timetable: 'Tue/Thu 14:00-16:00'
      }
    ]
  })

  // 3. Create Courses & Content
  const pythonCourse = await prisma.course.create({
    data: {
      title: 'Intro to Python',
      description: 'Master Python from scratch. Great for data science and automation.',
      category: 'Programming',
      thumbnail: 'https://placehold.co/600x400/101827/FFF?text=Python',
      chapters: {
        create: [
          {
            title: 'Getting Started',
            order: 1,
            lessons: {
              create: [
                { title: 'Installation & Setup', type: 'VIDEO', content: 'https://www.youtube.com/embed/_uQrJ0TkZlc', order: 1 },
                { title: 'Variables & Data Types', type: 'NOTE', content: '# Variables\nPython uses dynamic typing...', order: 2 },
                { title: 'First Quiz', type: 'QUIZ', content: '{"question": "What is 2+2?", "answer": "4"}', order: 3 }
              ]
            }
          }
        ]
      }
    }
  })

  const webCourse = await prisma.course.create({
    data: {
      title: 'Modern Web Development',
      description: 'Learn React, Next.js, and Tailwind CSS.',
      category: 'Web Dev',
      thumbnail: 'https://placehold.co/600x400/101827/FFF?text=Web+Dev',
      chapters: {
        create: [
          {
            title: 'HTML & CSS Basics',
            order: 1,
            lessons: {
              create: [
                { title: 'HTML Structure', type: 'VIDEO', content: 'https://www.youtube.com/embed/kUMe1FH4CHE', order: 1 },
                { title: 'CSS Grid vs Flexbox', type: 'NOTE', content: '# CSS Layouts\nFlexbox is one-dimensional...', order: 2 }
              ]
            }
          }
        ]
      }
    }
  })

  // 4. Create Achievements
  await prisma.achievement.createMany({
    data: [
      { name: 'First Steps', description: 'Complete your first lesson', icon: 'award', points: 50 },
      { name: 'Python Master', description: 'Complete the Python course', icon: 'code', points: 500 },
      { name: 'Forum Contributor', description: 'Post 10 times in the forum', icon: 'message-circle', points: 100 }
    ]
  })

  // 5. Create Forums & Posts
  const forum = await prisma.forum.create({
    data: {
      name: 'General Discussion',
      description: 'Talk about anything related to student life.',
      posts: {
        create: [
          {
            title: 'Best study spots on campus?',
            content: 'I really like the library 3rd floor, but it gets crowded.',
            authorId: student.id,
            comments: {
              create: [
                { content: 'Try the coffee shop near Building B!', authorId: admin.id }
              ]
            }
          }
        ]
      }
    }
  })

  const pythonForum = await prisma.forum.create({
    data: {
      name: 'Python Help',
      description: 'Get help with Python assignments.',
      courseId: pythonCourse.id
    }
  })

  // 6. Create Tasks
  await prisma.task.createMany({
    data: [
      { title: 'Finish Python Assignment', description: 'Complete the loops exercise.', dueDate: new Date('2024-12-31'), status: 'TODO', priority: 'HIGH', userId: student.id },
      { title: 'Study for Math Exam', description: 'Review chapters 1-3.', dueDate: new Date('2024-12-25'), status: 'IN_PROGRESS', priority: 'MEDIUM', userId: student.id }
    ]
  })

  // 7. Create Shared Resources
  await prisma.sharedResource.create({
    data: {
      title: 'Python Cheat Sheet',
      type: 'CHEATSHEET',
      content: '# Python Cheatsheet\n\n- `print("Hello")`: Output text\n- `len(list)`: Get length',
      authorId: admin.id,
      isPublic: true
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
