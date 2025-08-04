// middleware/auth.js
export default defineNuxtRouteMiddleware((to) => {
  // 1) Проверяем, что пользователь авторизован
  const isAuth = localStorage.getItem('auth')
  if (isAuth !== 'autIsDone') {
    return navigateTo('/login')
  }

  // 2) Проверяем роль, если страница требует её
  const userRole       = localStorage.getItem('role')
  const requiredRoles  = to.meta.requiredRole

  if (requiredRoles) {
    // если в meta — строка, превращаем в массив из одного элемента
    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles]

    // если ни одна из требуемых ролей не совпала — редиректим
    if (!roles.includes(userRole)) {
      return navigateTo('/403')
    }
  }

  // всё остальное — пропускаем
})
