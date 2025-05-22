<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center items-center antialiased">
    <div class="w-full max-w-md p-8 space-y-8 bg-white/5 backdrop-blur-md rounded-xl shadow-2xl">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-sky-400">Welcome Back</h1>
        <p class="mt-2 text-sm text-slate-300">Please sign in to continue</p>
      </div>

      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-300">Email address</label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none block w-full px-4 py-3 rounded-lg border-0 bg-white/10 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none sm:text-sm transition duration-150 ease-in-out"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-300">Password</label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none block w-full px-4 py-3 rounded-lg border-0 bg-white/10 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none sm:text-sm transition duration-150 ease-in-out"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-sky-500 focus:ring-sky-400 border-slate-600 bg-slate-700 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-slate-300">Remember me</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-sky-500 hover:text-sky-400 transition duration-150 ease-in-out">Forgot your password?</a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 ease-in-out"
          >
            Sign in
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-slate-400">
        This is a visual demonstration. No registration or login functionality is implemented.
      </p>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for a static page
// The login function is just a placeholder
const login = () => {
  console.log('Login attempt (visual only)');
  // In a real app, you would handle API calls here
};
</script>

<style scoped>
/* You can add component-specific styles here if needed,
   but Tailwind CSS classes are preferred for consistency. */
</style>
