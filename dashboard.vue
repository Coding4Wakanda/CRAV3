
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">CRAV Admin Dashboard</h1>
            <p class="text-gray-600">Analytics and insights for your meal planning platform</p>
          </div>
          <router-link to="/" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            Back to Chatbot
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span class="text-white font-semibold">💬</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Chats</dt>
                <dd class="text-3xl font-semibold text-gray-900">{{ stats.totalChats }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span class="text-white font-semibold">👤</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                <dd class="text-3xl font-semibold text-gray-900">{{ stats.activeUsers }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span class="text-white font-semibold">🍽️</span>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Meal Recommendations</dt>
                <dd class="text-3xl font-semibold text-gray-900">{{ stats.mealRecommendations }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Cravings -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Top Cravings</h3>
            <p class="text-sm text-gray-500">Most requested food preferences</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="(craving, index) in topCravings" :key="index" class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span class="text-sm text-gray-900">{{ craving.text }}</span>
                </div>
                <div class="text-sm text-gray-500">{{ craving.count }} requests</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Most Popular Meals -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Most Popular Meals</h3>
            <p class="text-sm text-gray-500">Top recommended dishes</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="(meal, index) in popularMeals" :key="index" class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <div>
                    <div class="text-sm text-gray-900">{{ meal.name }}</div>
                    <div class="text-xs text-gray-500">${{ meal.price.toFixed(2) }}</div>
                  </div>
                </div>
                <div class="text-sm text-gray-500">{{ meal.orders }} orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8 bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
          <p class="text-sm text-gray-500">Latest user interactions</p>
        </div>
        <div class="p-6">
          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in recentActivity" :key="index" class="relative pb-8">
                <div v-if="index !== recentActivity.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                <div class="relative flex space-x-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-white text-xs">
                    {{ activity.icon }}
                  </div>
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between space-x-4">
                      <p class="text-sm text-gray-900">{{ activity.description }}</p>
                      <time class="text-xs text-gray-500">{{ activity.time }}</time>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const stats = reactive({
  totalChats: 234,
  activeUsers: 89,
  mealRecommendations: 567
})

const topCravings = reactive([
  { text: "Sweet but healthy", count: 45 },
  { text: "Post-workout fuel", count: 38 },
  { text: "Comfort food vegan", count: 32 },
  { text: "High protein quick", count: 28 },
  { text: "Spicy and warming", count: 24 }
])

const popularMeals = reactive([
  { name: "Chia Protein Bowl", price: 11.99, orders: 67 },
  { name: "Avocado Wrap", price: 9.99, orders: 54 },
  { name: "Quinoa Chickpea Bowl", price: 11.99, orders: 48 },
  { name: "Thai Peanut Noodles", price: 12.49, orders: 43 },
  { name: "Sweet Potato Buddha Bowl", price: 10.99, orders: 39 }
])

const recentActivity = reactive([
  { icon: "💬", description: "User requested spicy meal recommendations", time: "2 minutes ago" },
  { icon: "🥗", description: "Quinoa Chickpea Bowl recommended to user", time: "5 minutes ago" },
  { icon: "👤", description: "New user started first chat session", time: "8 minutes ago" },
  { icon: "🍜", description: "User asked about soup options", time: "12 minutes ago" },
  { icon: "⭐", description: "High rating received for meal suggestion", time: "15 minutes ago" }
])
</script>

<style scoped>
</style>
