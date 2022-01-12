export default [
    { path: 'lesson-manager', component: () => import('@/views/other/lesson-manager.vue'), meta: { auth: 'lesson' } },
    { path: 'student-manager', component: () => import('@/views/other/student-manager.vue'), meta: { auth: 'student' } },
]